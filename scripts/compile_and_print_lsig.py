# Compile escrow.teal via Algod (PureStake) and print the logic-sig (escrow) address.
# Do NOT put private keys here. Set ALGOD_TOKEN to your PureStake API key in env vars.

import os, base64, sys
from algosdk.v2client import algod
from algosdk import logic

ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
if not ALGOD_TOKEN:
    print("ERROR: set ALGOD_TOKEN (PureStake API key) in environment", file=sys.stderr)
    sys.exit(1)

HEADERS = {"X-API-Key": ALGOD_TOKEN}
client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS, headers=HEADERS, timeout=30)

teal_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "escrow", "escrow.teal")
if not os.path.exists(teal_path):
    print("ERROR: TEAL file not found:", teal_path, file=sys.stderr)
    sys.exit(1)

with open(teal_path, "r", encoding="utf-8") as f:
    teal_source = f.read()

try:
    resp = client.compile(teal_source)
    prog_b64 = resp.get("result")
    prog = base64.b64decode(prog_b64)
    lsig = logic.LogicSigAccount(prog)
    print("Escrow (lsig) address:", lsig.address())
    print("Compiled program (base64):", prog_b64)
except Exception as e:
    print("Compile failed:", e, file=sys.stderr)
    sys.exit(1)