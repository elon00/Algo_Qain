# Algo_Qain — Algorand Launchpad Research Prototype

Algo_Qain is an original full-stack Algorand launchpad prototype combining a React frontend, a small FastAPI indexer service, Algorand smart-contract/deployment experiments, and post-quantum cryptography research.

## Current status

**PROTOTYPE / TESTNET-ORIENTED — NOT INDEPENDENTLY AUDITED OR PRODUCTION-CERTIFIED**

| Area | Current evidence | Boundary |
|---|---|---|
| Frontend | A Vercel-hosted demonstration URL is referenced by this repository | A reachable demo does not prove production readiness |
| FastAPI backend | Read-only deposit/indexer endpoint with bounded retries, validated escrow address, explicit CORS configuration and production HTTPS requirement | No user authentication, database, payment settlement, or production SLA is claimed |
| Algorand contracts | TEAL/PyTeal/deployment material exists in the repository | Deployment scripts are not proof of a currently live audited contract |
| PQC | Repository contains ML-DSA/related integration tests | Application-level tests are not independent FIPS validation or end-to-end quantum-security certification |
| Security | CI runs syntax, Bandit, dependency audits, PQC/reality tests | No independent smart-contract/security audit is claimed |
| Mainnet / market | Not claimed | Requires independently reproducible deployment, security review and operational evidence |

## Live/demo links

Repository materials reference a Vercel frontend demonstration. Treat it as a **demo surface**, not evidence that the backend, contracts, custody model, liquidity, or production operations are live.

## Architecture

```text
frontend/                  React demonstration UI
backend_fastapi.py         read-only Algorand indexer API
contracts/                 Algorand smart-contract experiments
scripts/                   deployment/reality tooling
tests/                     integration and PQC/reality tests
```

## Backend security boundary

The backend:

- refuses startup when indexer or escrow configuration is missing;
- validates the configured Algorand escrow address;
- requires HTTPS indexer access in production;
- requires an explicit CORS allowlist in production;
- limits deposit-query result count;
- bounds retry attempts and upstream timeout behavior;
- does not expose deployment mnemonics or Algorand API tokens to the frontend;
- is read-only with respect to blockchain state.

It does **not** currently implement end-user authentication, custody, production rate limiting across distributed instances, or a database-backed application account system.

## Configuration

Copy the template and provide development/testnet values:

```bash
cp .env.template .env
```

Never commit real mnemonics, private keys or API credentials.

Important variables:

- `INDEXER_ADDRESS`
- `INDEXER_TOKEN`
- `ESCROW_ADDRESS`
- `CORS_ALLOWED_ORIGINS`
- `ENVIRONMENT`

Deployment tooling may additionally require `ALGOD_ADDRESS`, `ALGOD_TOKEN` and a testnet deployment mnemonic.

## Verification

Python/backend:

```bash
python -m pip install -r requirements.txt
python -m py_compile backend_fastapi.py
```

Repository PQC/reality checks:

```bash
npm install --ignore-scripts
npm test
```

CI additionally runs Bandit plus Python and JavaScript dependency audits.

A green CI run proves only the assertions covered by those checks. It does not constitute an independent audit or production certification.

## Running the backend

Provide valid environment values, then run with Uvicorn:

```bash
uvicorn backend_fastapi:app --host 127.0.0.1 --port 8000
```

For a public deployment, terminate TLS at a trusted reverse proxy/platform, keep secrets in the platform secret manager, set `ENVIRONMENT=production`, and configure `CORS_ALLOWED_ORIGINS` explicitly.

## Smart-contract deployment

Deployment scripts require real Algorand testnet credentials and should be treated as operator tools. Before any mainnet use:

1. independently review the TEAL/PyTeal contracts;
2. verify application IDs/addresses through an Algorand explorer;
3. use hardware-backed or managed signing/key custody;
4. define upgrade, pause and incident-response procedures;
5. test failure/recovery paths under realistic load;
6. complete applicable legal/compliance review.

## Production-readiness gates

Do not describe Algo_Qain as production-ready until there is evidence for:

- deterministic/reproducible release builds;
- pinned/managed runtime dependencies;
- independent smart-contract and backend security review;
- authenticated/authorized mutation flows where required;
- durable rate limiting and abuse controls;
- monitoring, alerting, logging and incident response;
- backup/recovery and rollback procedures;
- verified deployed contract/application identifiers;
- workload and availability measurements;
- applicable legal/compliance requirements.

## Security

See [SECURITY.md](SECURITY.md) for responsible disclosure and the current security boundary.

## License

Use the repository's license files as authoritative. Third-party dependencies and copied reference material retain their original licenses.

---

**Market rule:** prototype, testnet, deployment-ready and production-ready are different claims. Public wording in this repository should remain narrower than the evidence.
