from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from algosdk.encoding import is_valid_address
from algosdk.v2client import indexer
from urllib.parse import urlparse
import logging
import os
import time

app = FastAPI(title="Algo_Qain Algorand Launchpad Backend", version="2.1.0")
logging.basicConfig(level=logging.INFO)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
INDEXER_ADDRESS = (os.getenv("INDEXER_ADDRESS") or "").strip()
INDEXER_TOKEN = (os.getenv("INDEXER_TOKEN") or "").strip()
ESCROW_ADDRESS = (os.getenv("ESCROW_ADDRESS") or "").strip()
CORS_ALLOWED_ORIGINS = [
    value.strip()
    for value in (os.getenv("CORS_ALLOWED_ORIGINS") or "").split(",")
    if value.strip()
]

missing = [
    name
    for name, value in (
        ("INDEXER_ADDRESS", INDEXER_ADDRESS),
        ("INDEXER_TOKEN", INDEXER_TOKEN),
        ("ESCROW_ADDRESS", ESCROW_ADDRESS),
    )
    if not value
]
if missing:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

parsed_indexer = urlparse(INDEXER_ADDRESS)
is_loopback = parsed_indexer.hostname in {"localhost", "127.0.0.1", "::1"}
if parsed_indexer.scheme not in {"https", "http"}:
    raise RuntimeError("INDEXER_ADDRESS must use http:// or https://")
if ENVIRONMENT == "production" and parsed_indexer.scheme != "https":
    raise RuntimeError("Production INDEXER_ADDRESS must use HTTPS")
if parsed_indexer.scheme == "http" and not is_loopback and ENVIRONMENT == "production":
    raise RuntimeError("Plain HTTP indexer access is not allowed in production")
if not is_valid_address(ESCROW_ADDRESS):
    raise RuntimeError("ESCROW_ADDRESS is not a valid Algorand address")
if ENVIRONMENT == "production" and not CORS_ALLOWED_ORIGINS:
    raise RuntimeError("CORS_ALLOWED_ORIGINS must be configured in production")

if CORS_ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ALLOWED_ORIGINS,
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["Accept", "Content-Type"],
        max_age=600,
    )

class Deposit(BaseModel):
    txid: str | None
    sender: str | None
    amount: int
    round: int


HEADERS = {"X-API-Key": INDEXER_TOKEN}
indexer_client = indexer.IndexerClient(
    INDEXER_TOKEN,
    INDEXER_ADDRESS,
    headers=HEADERS,
    timeout=30,
)


def safe_search_transactions(receiver: str, limit: int = 10, max_retries: int = 3):
    if not is_valid_address(receiver):
        raise ValueError("receiver is not a valid Algorand address")
    limit = max(1, min(int(limit), 500))
    max_retries = max(1, min(int(max_retries), 5))

    for attempt in range(max_retries):
        try:
            response = indexer_client.search_transactions(
                limit=limit,
                receiver=receiver,
                tx_type="pay",
            )
            return response.get("transactions", [])
        except Exception as exc:
            logging.warning(
                "Indexer request failed (attempt %s/%s): %s",
                attempt + 1,
                max_retries,
                type(exc).__name__,
            )
            if attempt + 1 < max_retries:
                time.sleep(1 + attempt)
    raise RuntimeError("Failed to query indexer after retries")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "algo-qain-indexer-api",
        "environment": ENVIRONMENT,
        "network_claim": "configured-indexer-observation-only",
        "production_certified": False,
    }


@app.get("/deposits/latest")
def get_latest_deposits(limit: int = 10):
    if limit <= 0:
        raise HTTPException(status_code=400, detail="limit must be > 0")
    if limit > 500:
        limit = 500

    try:
        transactions = safe_search_transactions(ESCROW_ADDRESS, limit=limit)
        results = []
        for tx in transactions:
            payment = tx.get("payment-transaction", {}) or {}
            results.append(
                {
                    "txid": tx.get("id"),
                    "sender": tx.get("sender"),
                    "amount": int(payment.get("amount", 0)),
                    "round": int(tx.get("confirmed-round") or 0),
                }
            )
        return {
            "deposits": results,
            "count": len(results),
            "source": "configured_algorand_indexer",
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        logging.error("Indexer query failed: %s", type(exc).__name__)
        raise HTTPException(status_code=502, detail="Indexer query failed") from exc
