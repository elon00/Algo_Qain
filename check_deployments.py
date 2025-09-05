#!/usr/bin/env python3
"""
Check deployment status of Algorand Launchpad components
"""

import requests
import json
from datetime import datetime

def check_url(url, name):
    """Check if a URL is accessible"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return {"status": "✅ Online", "code": response.status_code}
        else:
            return {"status": f"⚠️ Status {response.status_code}", "code": response.status_code}
    except requests.exceptions.RequestException as e:
        return {"status": "❌ Offline", "error": str(e)}

def main():
    print("🔍 Checking Algorand Launchpad Deployments")
    print("=" * 50)

    deployments = {
        "Main Application (Vercel)": "https://frontend-2qi5baj30-martinlutherupa1-gmailcoms-projects.vercel.app",
        "Landing Page (Vercel)": "https://vercel.com/martinlutherupa1-gmailcoms-projects/v0-algo-launchpad-landing-page"
    }

    results = {}
    for name, url in deployments.items():
        print(f"Checking {name}...")
        result = check_url(url, name)
        results[name] = {
            "url": url,
            "status": result["status"],
            "timestamp": datetime.now().isoformat()
        }
        print(f"  {result['status']}")
        if "code" in result:
            print(f"  HTTP Status: {result['code']}")
        print()

    # Save results
    with open('deployment_status.json', 'w') as f:
        json.dump(results, f, indent=2)

    print("📄 Results saved to deployment_status.json")

    # Summary
    online_count = sum(1 for r in results.values() if "✅" in r["status"])
    print(f"\n📊 Summary: {online_count}/{len(results)} deployments online")

    if online_count == len(results):
        print("🎉 All deployments are live and accessible!")
    else:
        print("⚠️ Some deployments may need attention")

if __name__ == "__main__":
    main()