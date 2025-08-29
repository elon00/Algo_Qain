from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..services.algorand_client import AlgorandClient

router = APIRouter()
algorand_client = AlgorandClient()

class Deposit(BaseModel):
    txid: str
    sender: str
    amount: int  # in microAlgos
    round: int

deposits_db = []  # This will act as a temporary in-memory database for deposits

@router.post("/deposits/", response_model=Deposit)
def create_deposit(deposit: Deposit):
    deposits_db.append(deposit)
    return deposit

@router.get("/deposits/", response_model=List[Deposit])
def get_deposits():
    if not deposits_db:
        raise HTTPException(status_code=404, detail="No deposits found")
    return deposits_db

@router.get("/deposits/{txid}", response_model=Deposit)
def get_deposit(txid: str):
    for deposit in deposits_db:
        if deposit.txid == txid:
            return deposit
    raise HTTPException(status_code=404, detail="Deposit not found")