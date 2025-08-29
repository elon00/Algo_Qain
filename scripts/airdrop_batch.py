"""
Hardened batched airdrop for ASA or ALGO.

CSV format: recipient,amount
 - amount = integer (units for ASA; microAlgos for ALGO)

Env:
 - ALGOD_ADDRESS (optional, default to PureStake testnet)
 - ALGOD_TOKEN (required)
 - ADMIN_MNEMONIC (dev only; use multisig/HW in prod)

Usage (PowerShell example):
 $env:ALGOD_TOKEN="YOUR_KEY"
 $env:ADMIN_MNEMONIC="your twelve word mnemonic"
 # dry run (no tx submitted)
 python .\scripts\airdrop_batch.py --csv .\data\recipients.csv --asset 12345 --batch 8 --dry-run
 # execute (will send txs)
 python .\scripts\airdrop_batch.py --csv .\data\recipients.csv --asset 12345 --batch 8 --execute
"""
from __future__ import annotations
import os, sys, csv, argparse, math, time, logging
from typing import List, Tuple, Optional
from algosdk import mnemonic, account
from algosdk.v2client import algod
from algosdk.future.transaction import AssetTransferTxn, PaymentTxn, assign_group_id

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
HEADERS = {"X-API-Key": ALGOD_TOKEN} if ALGOD_TOKEN else None

MAX_GROUP = 16  # Algorand supports up to 16 txns in a group
DEFAULT_BATCH = 16

def get_algod_client() -> algod.AlgodClient:
    if not ALGOD_TOKEN:
        logging.error("ALGOD_TOKEN not set (PureStake or Algod token required)")
        sys.exit(1)
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS, headers=HEADERS, timeout=30)

def get_admin() -> Tuple[str, str]:
    m = os.getenv("ADMIN_MNEMONIC", "")
    if not m:
        logging.error("ADMIN_MNEMONIC not set; set env for dev only (use multisig/HW in prod)")
        sys.exit(1)
    sk = mnemonic.to_private_key(m)
    addr = account.address_from_private_key(sk)
    return addr, sk

def load_csv(path: str) -> List[Tuple[str, int]]:
    if not os.path.exists(path):
        logging.error("CSV file not found: %s", path)
        sys.exit(1)
    rows = []
    with open(path, newline='') as f:
        r = csv.reader(f)
        for i, row in enumerate(r, start=1):
            if not row or all(not c.strip() for c in row): 
                continue
            if len(row) < 2:
                logging.warning("Skipping malformed line %d: %s", i, row)
                continue
            try:
                addr = row[0].strip()
                amt = int(row[1])
            except Exception as e:
                logging.warning("Skipping bad line %d: %s (%s)", i, row, e)
                continue
            rows.append((addr, amt))
    return rows

def check_optin(acl: algod.AlgodClient, addr: str, asset_id: Optional[int]) -> bool:
    if asset_id is None:
        return True
    try:
        info = acl.account_info(addr)
        for a in info.get("assets", []):
            if a.get("asset-id") == asset_id:
                return True
        return False
    except Exception as e:
        logging.warning("Account info error for %s: %s", addr, e)
        return False

def ensure_admin_has_funds(acl: algod.AlgodClient, admin_addr: str, total_algo_required: int, asset_id: Optional[int], total_asset_required: int) -> None:
    info = acl.account_info(admin_addr)
    bal = int(info.get("amount", 0))
    logging.info("Admin ALGO balance: %d microAlgos", bal)
    if bal < total_algo_required:
        logging.error("Admin does not have enough ALGO for fees/ALGO airdrop. required=%d balance=%d", total_algo_required, bal)
        sys.exit(1)
    if asset_id:
        assets = info.get("assets", [])
        found = 0
        for a in assets:
            if a.get("asset-id") == asset_id:
                found = int(a.get("amount", 0))
                break
        logging.info("Admin asset %s balance: %d units", asset_id, found)
        if found < total_asset_required:
            logging.error("Admin does not hold enough of asset %s. required=%d holding=%d", asset_id, total_asset_required, found)
            sys.exit(1)

def send_batch(acl: algod.AlgodClient, admin_addr: str, admin_sk: str, batch_rows: List[Tuple[str,int]], asset_id: Optional[int], wait_confirm: bool = True) -> List[str]:
    params = acl.suggested_params()
    txns = []
    for to, amount in batch_rows:
        if asset_id:
            txn = AssetTransferTxn(sender=admin_addr, sp=params, receiver=to, amt=amount, index=asset_id)
        else:
            txn = PaymentTxn(sender=admin_addr, sp=params, receiver=to, amt=amount)
        txns.append(txn)
    if len(txns) > MAX_GROUP:
        raise ValueError(f"Batch size {len(txns)} exceeds max group size {MAX_GROUP}")
    assign_group_id(txns)
    signed = [t.sign(admin_sk) for t in txns]
    try:
        txid = acl.send_transactions(signed)
        # algosdk may return a single txid or list depending on client; normalize to list
        if isinstance(txid, list):
            txids = txid
        elif isinstance(txid, str):
            txids = [txid]
        else:
            txids = [txid]
        logging.info("Submitted batch with len=%d first_txid=%s", len(txns), txids[0] if txids else None)
        if wait_confirm:
            # wait for first tx confirmation
            first = txids[0]
            for _ in range(30):
                try:
                    info = acl.pending_transaction_info(first)
                    if info.get("confirmed-round", 0) > 0:
                        logging.info("Batch confirmed in round %s", info.get("confirmed-round"))
                        break
                except Exception:
                    pass
                time.sleep(2)
        return txids
    except Exception as e:
        logging.exception("Failed to send batch: %s", e)
        raise

def run_airdrop(csv_path: str, asset_id: Optional[int], batch_size: int, dry_run: bool=False, execute: bool=False):
    if batch_size <= 0 or batch_size > MAX_GROUP:
        logging.error("Invalid batch size: %d (must be 1..%d)", batch_size, MAX_GROUP)
        sys.exit(1)
    acl = get_algod_client()
    admin_addr, admin_sk = get_admin()
    rows = load_csv(csv_path)
    if not rows:
        logging.error("No recipients found in CSV")
        sys.exit(1)

    # filter opt-in for ASA
    ok_rows = []
    skipped = []
    for to, amt in rows:
        if asset_id is not None:
            if not check_optin(acl, to, asset_id):
                skipped.append((to, amt))
                continue
        ok_rows.append((to, amt))

    logging.info("Total recipients: %d, will_send: %d, skipped_no_optin: %d", len(rows), len(ok_rows), len(skipped))
    if skipped:
        logging.info("Skipped examples: %s", skipped[:5])

    # estimate total fees and totals
    sample_params = acl.suggested_params()
    fee_per_txn = int(sample_params.fee) if sample_params and getattr(sample_params, "fee", None) else 1000
    total_fee = fee_per_txn * len(ok_rows)
    total_algo_required = 0
    total_asset_required = 0
    for _, amt in ok_rows:
        if asset_id is None:
            total_algo_required += amt
        else:
            total_asset_required += amt

    # Include fees for sending transactions (microAlgos)
    required_algo_micro = total_fee + (total_algo_required if total_algo_required else 0)
    logging.info("Estimated total fees (microAlgos): %d; total_algo_required: %d; total_asset_required: %d", total_fee, total_algo_required, total_asset_required)

    if dry_run:
        logging.info("Dry run enabled — no transactions will be submitted.")
        return

    # ensure admin has enough funds and assets
    ensure_admin_has_funds(acl, admin_addr, required_algo_micro, asset_id, total_asset_required)

    if not execute:
        logging.error("Execution flag not provided. Add --execute to actually submit transactions. Use --dry-run to preview.")
        sys.exit(1)

    total_batches = math.ceil(len(ok_rows)/batch_size)
    for i in range(total_batches):
        batch = ok_rows[i*batch_size:(i+1)*batch_size]
        logging.info("Sending batch %d/%d size=%d", i+1, total_batches, len(batch))
        send_batch(acl, admin_addr, admin_sk, batch, asset_id, wait_confirm=True)
        # small delay to avoid hitting rate limits
        time.sleep(1)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--csv", required=True, help="Path to recipients CSV")
    p.add_argument("--asset", type=int, default=None, help="Asset ID for ASA airdrop; omit for ALGO microAlgos")
    p.add_argument("--batch", type=int, default=DEFAULT_BATCH, help=f"Batch size (1..{MAX_GROUP})")
    p.add_argument("--dry-run", action="store_true", help="Show estimates and validations, do not submit txs")
    p.add_argument("--execute", action="store_true", help="Actually submit transactions (required to send)")
    args = p.parse_args()
    run_airdrop(args.csv, args.asset, args.batch, dry_run=args.dry_run, execute=args.execute)