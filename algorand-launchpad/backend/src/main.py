from fastapi import FastAPI
from api.deposits import router as deposits_router

app = FastAPI(title="Algorand Launchpad Backend")

# Include the deposits API routes
app.include_router(deposits_router, prefix="/api/deposits", tags=["deposits"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Algorand Launchpad Backend API"}