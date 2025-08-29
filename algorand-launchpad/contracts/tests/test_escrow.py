from algosdk import algod, transaction
from algosdk.mnemonic import to_public_key
import pytest

@pytest.fixture
def algod_client():
    algod_address = "https://testnet-algorand.api.purestake.io/ps2"
    algod_token = "YOUR_PURESTAKE_API_KEY"
    return algod.AlgodClient(algod_token, algod_address)

@pytest.fixture
def escrow_account(algod_client):
    # Replace with your escrow account mnemonic
    escrow_mnemonic = "YOUR_ESCROW_ACCOUNT_MNEMONIC"
    escrow_private_key = mnemonic.to_private_key(escrow_mnemonic)
    escrow_address = to_public_key(escrow_mnemonic)
    return escrow_address, escrow_private_key

def test_escrow_deposit(algod_client, escrow_account):
    escrow_address, escrow_private_key = escrow_account
    # Simulate a deposit transaction to the escrow account
    params = algod_client.suggested_params()
    amount = 1000000  # Amount in microAlgos (1 Algo)
    
    txn = transaction.PaymentTxn(
        sender="SENDER_ADDRESS",  # Replace with the sender's address
        receiver=escrow_address,
        amt=amount,
        sp=params
    )
    
    # Sign and send the transaction
    signed_txn = txn.sign("SENDER_PRIVATE_KEY")  # Replace with the sender's private key
    txid = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    transaction.wait_for_confirmation(algod_client, txid)

    # Check the balance of the escrow account
    account_info = algod_client.account_info(escrow_address)
    assert account_info['amount'] == amount

def test_escrow_withdraw(algod_client, escrow_account):
    escrow_address, escrow_private_key = escrow_account
    # Simulate a withdrawal transaction from the escrow account
    params = algod_client.suggested_params()
    amount = 500000  # Amount in microAlgos (0.5 Algo)
    
    txn = transaction.PaymentTxn(
        sender=escrow_address,
        receiver="RECEIVER_ADDRESS",  # Replace with the receiver's address
        amt=amount,
        sp=params
    )
    
    # Sign and send the transaction
    signed_txn = txn.sign(escrow_private_key)
    txid = algod_client.send_transaction(signed_txn)
    
    # Wait for confirmation
    transaction.wait_for_confirmation(algod_client, txid)

    # Check the balance of the escrow account
    account_info = algod_client.account_info(escrow_address)
    assert account_info['amount'] == 1000000 - amount  # Check remaining balance after withdrawal