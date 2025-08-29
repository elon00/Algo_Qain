# Algorand Launchpad Backend

This document provides an overview of the backend setup for the Algorand Launchpad project. The backend is built using FastAPI and interacts with the Algorand blockchain to manage deposits, airdrops, and other functionalities.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Airdrop Management](#airdrop-management)
- [Dependencies](#dependencies)

## Installation

To set up the backend application, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/elon00/algorand-launchpad.git
    cd algorand-launchpad/backend
    ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Application

To run the backend application, execute the following command:
```
uvicorn src.main:app --reload
```
This will start the FastAPI server on `http://127.0.0.1:8000`.

## API Endpoints

The backend provides several API endpoints for managing deposits and airdrops. Key endpoints include:

- **Deposits**
  - `POST /api/deposits`: Create a new deposit.
  - `GET /api/deposits`: Retrieve a list of deposits.

- **Airdrops**
  - `POST /api/airdrop`: Trigger an airdrop for eligible users.

Refer to the `src/api/deposits.py` and `src/admin/airdrop.py` files for detailed endpoint implementations.

## Database Models

The database models are defined in `src/db/models.py`. Key models include:

- **Deposit**: Represents a user's deposit, including fields for amount, user ID, and timestamp.
- **User**: Represents a user in the system, including fields for wallet address and eligibility status.

## Airdrop Management

The airdrop functionality is managed in `src/admin/airdrop.py`. This module includes functions to trigger airdrops based on user deposits and eligibility criteria.

## Dependencies

The backend application requires the following Python packages:

- `fastapi`: For building the web application.
- `uvicorn`: ASGI server for running the FastAPI application.
- `algosdk`: Algorand SDK for interacting with the Algorand blockchain.
- `sqlalchemy`: For database interactions.

Refer to `requirements.txt` for the complete list of dependencies.