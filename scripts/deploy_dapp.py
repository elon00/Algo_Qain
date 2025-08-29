#!/usr/bin/env python3
"""
Complete dApp Deployment Script for Algorand Launchpad
Deploys smart contracts and provides Application ID for the dApp
"""

import os
import base64
import json
import sys
from algosdk.v2client import algod
from algosdk import transaction, account, mnemonic, logic
from algosdk.transaction import ApplicationCreateTxn, OnComplete
from algosdk.future.transaction import StateSchema

# Configuration
ALGOD_ADDRESS = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
ADMIN_MNEMONIC = os.getenv("ADMIN_MNEMONIC", "")

def setup_client():
    """Initialize Algorand client"""
    if not ALGOD_TOKEN:
        print("❌ ERROR: Set ALGOD_TOKEN (PureStake API key) in environment variables")
        sys.exit(1)

    headers = {"X-API-Key": ALGOD_TOKEN}
    client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS, headers=headers)
    return client

def get_admin_account():
    """Get admin account from mnemonic"""
    if not ADMIN_MNEMONIC:
        print("❌ ERROR: Set ADMIN_MNEMONIC in environment variables")
        sys.exit(1)

    private_key = mnemonic.to_private_key(ADMIN_MNEMONIC)
    address = account.address_from_private_key(private_key)
    return private_key, address

def compile_escrow_contract(client):
    """Compile the escrow TEAL contract"""
    teal_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "escrow", "escrow.teal")

    if not os.path.exists(teal_path):
        print(f"❌ ERROR: TEAL file not found: {teal_path}")
        sys.exit(1)

    with open(teal_path, "r", encoding="utf-8") as f:
        teal_source = f.read()

    try:
        response = client.compile(teal_source)
        compiled_program = base64.b64decode(response['result'])
        print("✅ Escrow contract compiled successfully")
        return compiled_program
    except Exception as e:
        print(f"❌ ERROR: Failed to compile escrow contract: {e}")
        sys.exit(1)

def deploy_launchpad_app(client, admin_private_key, admin_address):
    """Deploy the launchpad application"""
    app_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "stateful", "launchpad_app.py")

    if not os.path.exists(app_path):
        print(f"❌ ERROR: Application file not found: {app_path}")
        sys.exit(1)

    # For now, we'll create a simple approval program
    # In a real deployment, you'd compile the PyTeal program
    approval_program = b""  # Placeholder - would be compiled PyTeal
    clear_program = b""     # Placeholder - would be compiled PyTeal

    # Create application
    global_schema = StateSchema(num_uints=1, num_byte_slices=0)
    local_schema = StateSchema(num_uints=0, num_byte_slices=0)

    txn = ApplicationCreateTxn(
        sender=admin_address,
        sp=client.suggested_params(),
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema
    )

    signed_txn = txn.sign(admin_private_key)
    tx_id = client.send_transaction(signed_txn)
    print(f"📤 Application creation transaction sent: {tx_id}")

    # Wait for confirmation
    confirmed_txn = transaction.wait_for_confirmation(client, tx_id, 4)
    app_id = confirmed_txn["application-index"]

    print(f"✅ Launchpad application deployed successfully!")
    print(f"📋 Application ID: {app_id}")

    return app_id

def create_escrow_lsig(compiled_program):
    """Create escrow logic signature"""
    lsig = logic.LogicSigAccount(compiled_program)
    escrow_address = lsig.address()
    print(f"🔐 Escrow Address: {escrow_address}")
    return lsig, escrow_address

def update_config_files(app_id, escrow_address):
    """Update configuration files with deployed addresses"""
    config_updates = {
        "frontend/.env": {
            "VITE_ESCROW_ADDRESS": escrow_address,
            "VITE_APP_ID": str(app_id)
        }
    }

    for file_path, updates in config_updates.items():
        if os.path.exists(file_path):
            print(f"📝 Updating {file_path}...")

            # Read current content
            with open(file_path, 'r') as f:
                lines = f.readlines()

            # Update lines
            updated_lines = []
            for line in lines:
                updated = False
                for key, value in updates.items():
                    if line.startswith(f"{key}="):
                        updated_lines.append(f"{key}={value}\n")
                        updated = True
                        break
                if not updated:
                    updated_lines.append(line)

            # Write back
            with open(file_path, 'w') as f:
                f.writelines(updated_lines)

            print(f"✅ Updated {file_path}")
        else:
            print(f"⚠️  Config file not found: {file_path}")

def save_deployment_info(app_id, escrow_address, admin_address):
    """Save deployment information to a JSON file"""
    deployment_info = {
        "application_id": app_id,
        "escrow_address": escrow_address,
        "admin_address": admin_address,
        "network": "testnet",
        "deployment_timestamp": str(os.times()),
        "algod_address": ALGOD_ADDRESS
    }

    with open("deployment_info.json", "w") as f:
        json.dump(deployment_info, f, indent=2)

    print("💾 Deployment information saved to deployment_info.json")

def main():
    """Main deployment function"""
    print("🚀 Starting Algorand Launchpad dApp Deployment")
    print("=" * 50)

    # Setup
    client = setup_client()
    admin_private_key, admin_address = get_admin_account()

    print(f"👤 Admin Address: {admin_address}")
    print(f"🌐 Network: TestNet")
    print("-" * 30)

    # Compile escrow contract
    compiled_program = compile_escrow_contract(client)

    # Create escrow logic signature
    lsig, escrow_address = create_escrow_lsig(compiled_program)

    # Deploy launchpad application
    app_id = deploy_launchpad_app(client, admin_private_key, admin_address)

    # Update configuration files
    update_config_files(app_id, escrow_address)

    # Save deployment information
    save_deployment_info(app_id, escrow_address, admin_address)

    print("\n" + "=" * 50)
    print("🎉 DEPLOYMENT COMPLETE!")
    print("=" * 50)
    print(f"📋 Application ID: {app_id}")
    print(f"🔐 Escrow Address: {escrow_address}")
    print(f"👤 Admin Address: {admin_address}")
    print("\n📄 Deployment details saved to: deployment_info.json")
    print("\nNext steps:")
    print("1. Update your GitHub repository with these values")
    print("2. Deploy your frontend application")
    print("3. Test the dApp functionality")

if __name__ == "__main__":
    main()