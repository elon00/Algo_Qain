#!/bin/bash

# Compile the TEAL code for the escrow smart contract
python3 -m pyteal contracts/escrow/escrow_teal.py > contracts/escrow/escrow.teal

# Compile the TEAL code for the stateful launchpad application smart contract
python3 -m pyteal contracts/stateful/launchpad_app.py > contracts/stateful/launchpad_app.teal

echo "TEAL compilation completed."