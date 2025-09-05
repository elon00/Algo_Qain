#!/usr/bin/env python3
"""
Algorand Launchpad Integration Test Suite
Tests the complete end-to-end functionality of the dApp
"""

import os
import json
import requests
import time
from typing import Dict, Any
from algosdk.v2client import algod
from algosdk import account, mnemonic

class LaunchpadTester:
    def __init__(self):
        self.config = self.load_config()
        self.client = self.setup_client()
        self.test_results = []

    def load_config(self) -> Dict[str, Any]:
        """Load configuration from environment and deployment files"""
        config = {
            'algod_address': os.getenv('ALGOD_ADDRESS', 'https://testnet-algorand.api.purestake.io/ps2'),
            'algod_token': os.getenv('ALGOD_TOKEN', ''),
            'app_id': os.getenv('APP_ID', ''),
            'escrow_address': os.getenv('ESCROW_ADDRESS', ''),
            'backend_url': os.getenv('BACKEND_URL', 'http://localhost:8000'),
            'frontend_url': os.getenv('FRONTEND_URL', 'http://localhost:3000')
        }

        # Try to load from deployment_info.json if it exists
        try:
            with open('deployment_info.json', 'r') as f:
                deployment_info = json.load(f)
                config.update({
                    'app_id': deployment_info.get('application_id', config['app_id']),
                    'escrow_address': deployment_info.get('escrow_address', config['escrow_address'])
                })
        except FileNotFoundError:
            print("⚠️  deployment_info.json not found, using environment variables")

        return config

    def setup_client(self):
        """Setup Algorand client"""
        if not self.config['algod_token']:
            print("❌ ALGOD_TOKEN not set - cannot test blockchain integration")
            return None

        headers = {"X-API-Key": self.config['algod_token']}
        client = algod.AlgodClient(self.config['algod_token'], self.config['algod_address'], headers=headers)
        return client

    def log_test(self, test_name: str, status: str, message: str, details: Any = None):
        """Log test results"""
        result = {
            'test': test_name,
            'status': status,
            'message': message,
            'timestamp': time.time(),
            'details': details
        }
        self.test_results.append(result)
        print(f"{'✅' if status == 'PASS' else '❌' if status == 'FAIL' else '⚠️'} {test_name}: {message}")

    def test_blockchain_connection(self):
        """Test connection to Algorand network"""
        if not self.client:
            self.log_test("Blockchain Connection", "SKIP", "ALGOD_TOKEN not configured")
            return

        try:
            status = self.client.status()
            self.log_test("Blockchain Connection", "PASS", "Connected to Algorand TestNet",
                         {"last_round": status['last-round']})
        except Exception as e:
            self.log_test("Blockchain Connection", "FAIL", f"Connection failed: {str(e)}")

    def test_contract_deployment(self):
        """Test if smart contracts are properly deployed"""
        if not self.config['app_id'] or self.config['app_id'].startswith('demo'):
            self.log_test("Contract Deployment", "SKIP", "App ID not configured or is demo value")
            return

        if not self.client:
            self.log_test("Contract Deployment", "SKIP", "Blockchain client not available")
            return

        try:
            app_info = self.client.application_info(self.config['app_id'])
            self.log_test("Contract Deployment", "PASS", "Application found on blockchain",
                         {"app_id": self.config['app_id'], "creator": app_info['creator']})
        except Exception as e:
            self.log_test("Contract Deployment", "FAIL", f"Application not found: {str(e)}")

    def test_escrow_address(self):
        """Test escrow address validity"""
        if not self.config['escrow_address'] or self.config['escrow_address'].startswith('demo'):
            self.log_test("Escrow Address", "SKIP", "Escrow address not configured or is demo value")
            return

        if not self.client:
            self.log_test("Escrow Address", "SKIP", "Blockchain client not available")
            return

        try:
            account_info = self.client.account_info(self.config['escrow_address'])
            balance = account_info.get('amount', 0) / 1e6  # Convert microAlgos to ALGO
            self.log_test("Escrow Address", "PASS", f"Escrow address valid, balance: {balance} ALGO",
                         {"address": self.config['escrow_address'], "balance": balance})
        except Exception as e:
            self.log_test("Escrow Address", "FAIL", f"Invalid escrow address: {str(e)}")

    def test_backend_api(self):
        """Test backend API endpoints"""
        endpoints = [
            ('Health Check', f"{self.config['backend_url']}/health"),
            ('Deposits API', f"{self.config['backend_url']}/api/deposits"),
            ('Projects API', f"{self.config['backend_url']}/api/projects"),
            ('Airdrops API', f"{self.config['backend_url']}/api/airdrops")
        ]

        for name, url in endpoints:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    self.log_test(f"Backend API - {name}", "PASS", f"Endpoint responding: {response.status_code}")
                else:
                    self.log_test(f"Backend API - {name}", "WARN", f"Unexpected status: {response.status_code}")
            except requests.exceptions.RequestException as e:
                self.log_test(f"Backend API - {name}", "FAIL", f"Connection failed: {str(e)}")

    def test_frontend_accessibility(self):
        """Test frontend accessibility"""
        try:
            response = requests.get(self.config['frontend_url'], timeout=10)
            if response.status_code == 200:
                self.log_test("Frontend Accessibility", "PASS", "Frontend is accessible",
                             {"url": self.config['frontend_url'], "status": response.status_code})
            else:
                self.log_test("Frontend Accessibility", "WARN", f"Unexpected status: {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.log_test("Frontend Accessibility", "FAIL", f"Frontend not accessible: {str(e)}")

    def test_wallet_integration(self):
        """Test wallet integration setup"""
        # This is a basic check - actual wallet testing requires browser automation
        frontend_content = ""
        try:
            response = requests.get(self.config['frontend_url'], timeout=10)
            frontend_content = response.text
        except:
            self.log_test("Wallet Integration", "SKIP", "Cannot access frontend for wallet integration test")
            return

        wallet_checks = [
            ('MyAlgo', 'myAlgoWallet' in frontend_content),
            ('Pera Wallet', 'PeraWalletConnect' in frontend_content),
            ('Wallet Connection', 'connect' in frontend_content.lower()),
            ('Deposit Form', 'deposit' in frontend_content.lower())
        ]

        wallet_features = []
        for feature, found in wallet_checks:
            if found:
                wallet_features.append(feature)

        if wallet_features:
            self.log_test("Wallet Integration", "PASS", f"Wallet features detected: {', '.join(wallet_features)}")
        else:
            self.log_test("Wallet Integration", "WARN", "No wallet integration features detected in frontend")

    def generate_report(self):
        """Generate comprehensive test report"""
        report = {
            'timestamp': time.time(),
            'summary': {
                'total_tests': len(self.test_results),
                'passed': len([r for r in self.test_results if r['status'] == 'PASS']),
                'failed': len([r for r in self.test_results if r['status'] == 'FAIL']),
                'skipped': len([r for r in self.test_results if r['status'] == 'SKIP']),
                'warnings': len([r for r in self.test_results if r['status'] == 'WARN'])
            },
            'results': self.test_results,
            'configuration': self.config
        }

        # Save report
        with open('integration_test_report.json', 'w') as f:
            json.dump(report, f, indent=2)

        return report

    def run_all_tests(self):
        """Run the complete test suite"""
        print("🚀 Starting Algorand Launchpad Integration Tests")
        print("=" * 60)

        # Run all tests
        self.test_blockchain_connection()
        self.test_contract_deployment()
        self.test_escrow_address()
        self.test_backend_api()
        self.test_frontend_accessibility()
        self.test_wallet_integration()

        # Generate report
        report = self.generate_report()

        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {report['summary']['total_tests']}")
        print(f"✅ Passed: {report['summary']['passed']}")
        print(f"❌ Failed: {report['summary']['failed']}")
        print(f"⚠️  Warnings: {report['summary']['warnings']}")
        print(f"⏭️  Skipped: {report['summary']['skipped']}")
        print(f"\n📄 Detailed report saved to: integration_test_report.json")

        # Overall assessment
        success_rate = (report['summary']['passed'] / report['summary']['total_tests']) * 100
        if success_rate >= 80:
            print("🎉 Overall Status: EXCELLENT - Ready for production!")
        elif success_rate >= 60:
            print("👍 Overall Status: GOOD - Minor issues to address")
        else:
            print("⚠️  Overall Status: NEEDS ATTENTION - Critical issues found")

        return report

def main():
    tester = LaunchpadTester()
    report = tester.run_all_tests()

    # Exit with appropriate code
    if report['summary']['failed'] > 0:
        exit(1)
    else:
        exit(0)

if __name__ == "__main__":
    main()