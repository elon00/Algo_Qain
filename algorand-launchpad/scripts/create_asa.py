from algosdk import algod, transaction
from algosdk.future import transaction
import os
import base64

# Configuration for Algorand client
ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "YOUR_PURESTAKE_API_KEY")
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS, headers={"X-API-Key": ALGOD_TOKEN})

def create_asa(creator_address, asset_name, unit_name, total_supply, decimals, manager=None, reserve=None, freeze=None, clawback=None):
    params = algod_client.suggested_params()

    txn = transaction.AssetConfigTxn(
        sender=creator_address,
        sp=params,
        total=total_supply,
        decimals=decimals,
        default_frozen=False,
        unit_name=unit_name,
        asset_name=asset_name,
        manager=manager,
        reserve=reserve,
        freeze=freeze,
        clawback=clawback,
        url="https://example.com/asset-metadata.json"  # Replace with your asset metadata URL
    )

    # Sign the transaction
    signed_txn = txn.sign(creator_address)

    # Send the transaction
    txid = algod_client.send_transaction(signed_txn)
    print(f"Asset creation transaction sent with ID: {txid}")

    # Wait for confirmation
    transaction.wait_for_confirmation(algod_client, txid)
    print("Asset created successfully.")

if __name__ == "__main__":
    # Replace with your creator address and asset details
    creator_address = "YOUR_CREATOR_ADDRESS"
    asset_name = "MyLaunchpadToken"
    unit_name = "MLT"
    total_supply = 1000000
    decimals = 0

    create_asa(creator_address, asset_name, unit_name, total_supply, decimals)