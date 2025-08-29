import os
import io
import csv
import pytest
from types import SimpleNamespace

# adjust import path if needed
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from airdrop_batch import load_csv, get_algod_client, get_admin, run_airdrop, check_optin, ensure_admin_has_funds

def test_load_csv_tmp(tmp_path):
    p = tmp_path / "rec.csv"
    p.write_text("ADDR1,100\nADDR2,200\n\nbadline\nADDR3,300\n")
    rows = load_csv(str(p))
    assert ("ADDR1", 100) in rows
    assert ("ADDR2", 200) in rows
    assert ("ADDR3", 300) in rows
    # badline skipped

class DummyACL:
    def __init__(self, acct_info=None):
        self._acct = acct_info or {}
    def account_info(self, addr):
        return self._acct
    def suggested_params(self):
        return SimpleNamespace(fee=1000)

def test_check_optin_true(monkeypatch):
    dummy = DummyACL({"assets":[{"asset-id":123,"amount":1}]})
    assert check_optin(dummy, "X", 123) is True

def test_check_optin_false(monkeypatch):
    dummy = DummyACL({"assets":[]})
    assert check_optin(dummy, "X", 123) is False

def test_ensure_admin_has_funds_ok(monkeypatch):
    dummy = DummyACL({"amount": 5000000, "assets":[{"asset-id":111,"amount":100}]})
    # should not raise
    ensure_admin_has_funds(dummy, "admin", 1000, 111, 10)

def test_ensure_admin_has_funds_fail_algo(monkeypatch):
    dummy = DummyACL({"amount": 500, "assets":[]})
    with pytest.raises(SystemExit):
        ensure_admin_has_funds(dummy, "admin", 1000, None, 0)

def test_run_airdrop_dry_run(monkeypatch, tmp_path):
    # create CSV
    p = tmp_path / "rec.csv"
    p.write_text("ADDR1,100\n")
    # monkeypatch clients and admin
    monkeypatch.setenv("ALGOD_TOKEN", "dummy")
    monkeypatch.setenv("ADMIN_MNEMONIC", "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
    # stub get_algod_client to dummy with needed methods
    import airdrop_batch as ab
    class ACL:
        def suggested_params(self): return SimpleNamespace(fee=1000)
        def account_info(self, addr): return {"amount": 10000000, "assets":[{"asset-id":999,"amount":1000}]}
    monkeypatch.setattr(ab, "get_algod_client", lambda: ACL())
    # stub check_optin to True
    monkeypatch.setattr(ab, "check_optin", lambda acl, a, b: True)
    # run dry run (should exit cleanly without raising)
    ab.run_airdrop(str(p), asset_id=None, batch_size=1, dry_run=True, execute=False)