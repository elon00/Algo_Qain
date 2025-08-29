"""
Create an Algorand Standard Asset (ASA).
Env vars required:
 - ALGOD_ADDRESS (eg https://testnet-algorand.api.purestake.io/ps2)
 - ALGOD_TOKEN (PureStake API key)
 - ADMIN_MNEMONIC (mnemonic of admin account)  -- USE HSM/multisig in prod
Usage (PowerShell):
 $env:ALGOD_TOKEN="YOUR_KEY"; $env:ADMIN_MNEMONIC="your twelve word mnemonic"
 python .\scripts\create_asa.py --name "MyToken" --unit "MTK" --total 1000000 --decimals 0 --url "https://example.com/meta.json"
"""
import os
import sys
import argparse
from algosdk import mnemonic, account
from algosdk.v2client import algod
from algosdk.future.transaction import AssetConfigTxn

ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
HEADERS = {"X-API-Key": ALGOD_TOKEN} if ALGOD_TOKEN else None

def get_client():
    if not ALGOD_TOKEN:
        print("ERROR: set ALGOD_TOKEN in env", file=sys.stderr); sys.exit(1)
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS, headers=HEADERS, timeout=30)

def get_admin_account():
    m = os.getenv("ADMIN_MNEMONIC", "")
    if not m:
        print("ERROR: set ADMIN_MNEMONIC in env (for dev only). Use multisig/HW in production.", file=sys.stderr)
        sys.exit(1)
    sk = mnemonic.to_private_key(m)
    addr = account.address_from_private_key(sk)
    return addr, sk

def create_asa(args):
    client = get_client()
    sender, sk = get_admin_account()
    params = client.suggested_params()
    txn = AssetConfigTxn(
        sender=sender,
        sp=params,
        total=args.total,
        default_frozen=False,
        unit_name=args.unit,
        asset_name=args.name,
        manager=sender,
        reserve=sender,
        freeze=sender,
        clawback=sender,
        decimals=args.decimals,
        url=args.url or "",
    )
    signed = txn.sign(sk)
    txid = client.send_transaction(signed)
    print("Sent create-asa txid:", txid)
    print("Waiting for confirmation...")
    from algosdk.v2client import algod as algod_client_mod
    try:
        confirmed = client.pending_transaction_info(txid)
        while not confirmed.get("confirmed-round", None):
            confirmed = client.pending_transaction_info(txid)
        asset_id = confirmed["asset-index"]
        print("ASA created. Asset ID:", asset_id)
    except Exception as e:
        print("Warning: could not fetch confirmation:", e)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--name", required=True)
    p.add_argument("--unit", required=True)
    p.add_argument("--total", type=int, required=True)
    p.add_argument("--decimals", type=int, default=0)
    p.add_argument("--url", default="")
    args = p.parse_args()
    create_asa(args)