from pyteal import *

def launchpad_app():
    # Define the application state schema
    on_initialize = Seq([
        App.globalPut(Bytes("totalDeposits"), Int(0)),
        App.globalPut(Bytes("totalAirdrops"), Int(0)),
        Return(Int(1))
    ])

    on_deposit = Seq([
        # Increment total deposits
        App.globalPut(Bytes("totalDeposits"), App.globalGet(Bytes("totalDeposits")) + Txn.amount()),
        Return(Int(1))
    ])

    on_airdrop = Seq([
        # Logic for distributing airdrops
        # This is a placeholder for actual airdrop logic
        App.globalPut(Bytes("totalAirdrops"), App.globalGet(Bytes("totalAirdrops")) + Int(1)),
        Return(Int(1))
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_initialize],  # Initialize the app
        [Txn.application_id() != Int(0) & Txn.application_id() != Int(0), on_deposit],  # Handle deposits
        [Txn.application_id() != Int(0) & Txn.application_id() != Int(0), on_airdrop]  # Handle airdrops
    )

    return program

if __name__ == "__main__":
    approval = compileTeal(launchpad_app(), mode=Mode.Application, version=5)
    print(approval)