"""
Safety check: compute totals required for an airdrop CSV and compare with admin holdings.
Usage:
 $env:ALGOD_TOKEN="YOUR_KEY"
 python .\scripts\safety_check.py --csv .\data\recipients.csv --asset 12345
"""
import os, sys, csv, json
from algosdk.v2client import algod

def load_csv(path):
    if not os.path.exists(path):
        print("CSV not found", path, file=sys.stderr); sys.exit(2)
    total_algo = 0
    total_asset = 0
    rows = []
    with open(path, newline='') as f:
        r = csv.reader(f)
        for row in r:
            if not row or all(not c.strip() for c in row): continue
            addr = row[0].strip()
            amt = int(row[1])
            rows.append((addr, amt))
            total_algo += amt
    return rows, total_algo, total_asset

def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("--csv", required=True)
    p.add_argument("--asset", type=int, default=None)
    args = p.parse_args()

    token = os.getenv("ALGOD_TOKEN", "")
    if not token:
        print("ALGOD_TOKEN env required", file=sys.stderr); sys.exit(2)
    algod_address = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
    client = algod.AlgodClient(token, algod_address, headers={"X-API-Key":token})

    rows, total_algo, total_asset = load_csv(args.csv)
    acct = os.getenv("ADMIN_ADDRESS", "")
    if not acct:
        print("Set ADMIN_ADDRESS env to verify holdings", file=sys.stderr); sys.exit(2)
    info = client.account_info(acct)
    balance = int(info.get("amount",0))
    assets = {a.get("asset-id"): int(a.get("amount",0)) for a in info.get("assets",[])}
    report = {
        "recipients": len(rows),
        "total_algo_required": total_algo,
        "admin_algo_balance": balance,
        "asset_id": args.asset,
        "admin_asset_holdings": assets.get(args.asset, 0)
    }
    print(json.dumps(report, indent=2))
    if balance < total_algo:
        print("WARNING: admin ALGO balance < required", file=sys.stderr)
        sys.exit(3)

if __name__ == "__main__":
    main()