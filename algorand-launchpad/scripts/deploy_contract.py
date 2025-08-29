from algosdk import algod, transaction, mnemonic
import os
import base64

# Load environment variables
ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
ADMIN_MNEMONIC = os.getenv("ADMIN_MNEMONIC", "")

# Initialize Algorand client
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

def deploy_contract(teal_file_path):
    # Read TEAL file
    with open(teal_file_path, "r") as file:
        teal_source = file.read()

    # Compile TEAL
    response = algod_client.compile(teal_source)
    compiled_teal = base64.b64decode(response['result'])
    print("Compiled TEAL:", response['result'])

    # Get the admin account from mnemonic
    admin_private_key = mnemonic.to_private_key(ADMIN_MNEMONIC)
    admin_address = mnemonic.to_public_key(ADMIN_MNEMONIC)

    # Create the application
    txn = transaction.ApplicationCreateTxn(
        sender=admin_address,
        sp=algod_client.suggested_params(),
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=compiled_teal,
        clear_program=compiled_teal,
        global_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0),
        local_schema=transaction.StateSchema(num_uints=0, num_byte_slices=0)
    )

    # Sign and send the transaction
    signed_txn = txn.sign(admin_private_key)
    txid = algod_client.send_transaction(signed_txn)
    print("Transaction ID:", txid)

    # Wait for confirmation
    transaction.wait_for_confirmation(algod_client, txid)
    print("Contract deployed successfully.")

if __name__ == "__main__":
    deploy_contract("contracts/escrow/escrow_teal.py")  # Adjust the path as necessary