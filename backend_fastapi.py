from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from algosdk.v2client import indexer
import os, logging, time

app = FastAPI(title="Algorand Launchpad Backend - Deposit Indexer")
logging.basicConfig(level=logging.INFO)

# Required environment values
INDEXER_ADDRESS = os.getenv("INDEXER_ADDRESS")
INDEXER_TOKEN = os.getenv("INDEXER_TOKEN")
ESCROW_ADDRESS = os.getenv("ESCROW_ADDRESS")

if not INDEXER_ADDRESS or not INDEXER_TOKEN or not ESCROW_ADDRESS:
    logging.error("Missing one or more required env vars: INDEXER_ADDRESS, INDEXER_TOKEN, ESCROW_ADDRESS")
    # stop early by raising so server won't start silently in insecure state
    raise RuntimeError("Set INDEXER_ADDRESS, INDEXER_TOKEN, and ESCROW_ADDRESS environment variables")

HEADERS = {"X-API-Key": INDEXER_TOKEN}
indexer_client = indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS, headers=HEADERS, timeout=30)

class Deposit(BaseModel):
    txid: str
    sender: str
    amount: int  # microAlgos
    round: int

def safe_search_transactions(receiver, limit=10, max_retries=3):
    if limit > 1000:
        limit = 1000
    for attempt in range(max_retries):
        try:
            resp = indexer_client.search_transactions(limit=limit, receiver=receiver, tx_type="pay")
            return resp.get("transactions", [])
        except Exception as e:
            logging.warning("Indexer request failed (attempt %s): %s", attempt+1, e)
            time.sleep(1 + attempt)
    raise RuntimeError("Failed to query indexer after retries")

@app.get("/deposits/latest")
def get_latest_deposits(limit: int = 10):
    if limit <= 0:
        raise HTTPException(status_code=400, detail="limit must be > 0")
    if limit > 500:
        limit = 500
    try:
        txs = safe_search_transactions(ESCROW_ADDRESS, limit=limit)
        results = []
        for tx in txs:
            # defensive parsing of transaction structure
            pay = tx.get("payment-transaction", {}) or {}
            amt = int(pay.get("amount", 0))
            results.append({
                "txid": tx.get("id"),
                "sender": tx.get("sender"),
                "amount": amt,
                "round": int(tx.get("confirmed-round") or 0)
            })
        return {"deposits": results, "count": len(results)}
    except Exception as e:
        logging.exception("Error fetching deposits")
        raise HTTPException(status_code=500, detail="Indexer query failed")        # ...existing code...
        from fastapi import FastAPI, HTTPException
        from pydantic import BaseModel
        from algosdk.v2client import indexer
        import os, logging, time
        
        app = FastAPI(title="Algorand Launchpad Backend - Deposit Indexer")
        logging.basicConfig(level=logging.INFO)
        
        # Required environment values
        INDEXER_ADDRESS = os.getenv("INDEXER_ADDRESS")
        INDEXER_TOKEN = os.getenv("INDEXER_TOKEN")
        ESCROW_ADDRESS = os.getenv("ESCROW_ADDRESS")
        
        if not INDEXER_ADDRESS or not INDEXER_TOKEN or not ESCROW_ADDRESS:
            logging.error("Missing one or more required env vars: INDEXER_ADDRESS, INDEXER_TOKEN, ESCROW_ADDRESS")
            # stop early by raising so server won't start silently in insecure state
            raise RuntimeError("Set INDEXER_ADDRESS, INDEXER_TOKEN, and ESCROW_ADDRESS environment variables")
        
        HEADERS = {"X-API-Key": INDEXER_TOKEN}
        indexer_client = indexer.IndexerClient(INDEXER_TOKEN, INDEXER_ADDRESS, headers=HEADERS, timeout=30)
        
        class Deposit(BaseModel):
            txid: str
            sender: str
            amount: int  # microAlgos
            round: int
        
        def safe_search_transactions(receiver, limit=10, max_retries=3):
            if limit > 1000:
                limit = 1000
            for attempt in range(max_retries):
                try:
                    resp = indexer_client.search_transactions(limit=limit, receiver=receiver, tx_type="pay")
                    return resp.get("transactions", [])
                except Exception as e:
                    logging.warning("Indexer request failed (attempt %s): %s", attempt+1, e)
                    time.sleep(1 + attempt)
            raise RuntimeError("Failed to query indexer after retries")
        
        @app.get("/deposits/latest")
        def get_latest_deposits(limit: int = 10):
            if limit <= 0:
                raise HTTPException(status_code=400, detail="limit must be > 0")
            if limit > 500:
                limit = 500
            try:
                txs = safe_search_transactions(ESCROW_ADDRESS, limit=limit)
                results = []
                for tx in txs:
                    # defensive parsing of transaction structure
                    pay = tx.get("payment-transaction", {}) or {}
                    amt = int(pay.get("amount", 0))
                    results.append({
                        "txid": tx.get("id"),
                        "sender": tx.get("sender"),
                        "amount": amt,
                        "round": int(tx.get("confirmed-round") or 0)
                    })
                return {"deposits": results, "count": len(results)}
            except Exception as e:
                logging.exception("Error fetching deposits")
                raise HTTPException(status_code=500, detail="Indexer query failed")
        # ...existing code...