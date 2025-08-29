from algosdk import algod, transaction, mnemonic
from algosdk.v2client import indexer
import base64
import os

class AlgorandClient:
    def __init__(self):
        self.algod_address = os.getenv("ALGOD_ADDRESS", "https://testnet-algorand.api.purestake.io/ps2")
        self.algod_token = os.getenv("ALGOD_TOKEN", "")
        self.indexer_address = os.getenv("INDEXER_ADDRESS", "https://testnet-algorand.api.purestake.io/idx2")
        self.indexer_token = os.getenv("INDEXER_TOKEN", "")
        
        self.algod_client = algod.AlgodClient(self.algod_token, self.algod_address)
        self.indexer_client = indexer.IndexerClient(self.indexer_token, self.indexer_address)

    def send_transaction(self, sender_mnemonic, receiver_address, amount):
        sender_private_key = mnemonic.to_private_key(sender_mnemonic)
        params = self.algod_client.suggested_params()
        
        txn = transaction.PaymentTxn(sender=sender_private_key, 
                                      receiver=receiver_address, 
                                      amt=amount, 
                                      sp=params)
        
        signed_txn = txn.sign(sender_private_key)
        txid = self.algod_client.send_transaction(signed_txn)
        return txid

    def get_transaction_info(self, txid):
        return self.algod_client.pending_transaction_info(txid)

    def get_account_info(self, address):
        return self.algod_client.account_info(address)

    def wait_for_confirmation(self, txid):
        return transaction.wait_for_confirmation(self.algod_client, txid)

    def get_latest_block(self):
        return self.algod_client.status()["lastRound"]