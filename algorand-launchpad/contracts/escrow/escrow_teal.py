from pyteal import *

# Stateless escrow logic: accepts outgoing payments only to ADMIN_ADDRESS.
# Deposits can be sent to this account by anyone (no TEAL executed on receive).
# Withdrawals from escrow require the logic signature to authorize and will succeed
# only if the receiver is ADMIN_ADDRESS (so funds can't be sent to arbitrary attackers).
# NOTE: Replace ADMIN_ADDRESS with your Algorand address (checksum string).

ADMIN_ADDRESS = Addr("ADMIN_ALGORAND_ADDRESS_HERE")  # <-- replace this before compiling

def escrow_logic():
    # Only allow Payment transactions spending from this account where the receiver is admin
    is_payment = Txn.type_enum() == TxnType.Payment
    pay_to_admin = Txn.receiver() == ADMIN_ADDRESS
    # Disallow rekeying and abnormal fields
    no_rekey = Txn.rekey_to() == Global.zero_address()
    # Prevent close-to other parties (optional: allow closing to admin)
    allow_close_to_admin = Or(Txn.close_remainder_to() == Global.zero_address(), Txn.close_remainder_to() == ADMIN_ADDRESS)

    program = And(is_payment, pay_to_admin, no_rekey, allow_close_to_admin)
    return program

if __name__ == "__main__":
    approval = compileTeal(escrow_logic(), mode=Mode.Signature, version=5)
    print(approval)