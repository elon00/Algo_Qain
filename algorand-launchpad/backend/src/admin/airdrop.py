from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.algorand_client import AlgorandClient

router = APIRouter()

class AirdropRequest(BaseModel):
    project_id: str
    recipient_addresses: List[str]
    amounts: List[int]

@router.post("/airdrop")
async def trigger_airdrop(airdrop_request: AirdropRequest):
    if len(airdrop_request.recipient_addresses) != len(airdrop_request.amounts):
        raise HTTPException(status_code=400, detail="Recipient addresses and amounts must match in length.")
    
    algorand_client = AlgorandClient()
    
    try:
        transaction_ids = []
        for address, amount in zip(airdrop_request.recipient_addresses, airdrop_request.amounts):
            tx_id = algorand_client.send_asset_transfer(address, amount, project_id=airdrop_request.project_id)
            transaction_ids.append(tx_id)
        
        return {"transaction_ids": transaction_ids}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))