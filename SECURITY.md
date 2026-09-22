# Security Policy

## Supported status

Algo_Qain is currently a **prototype / testnet-oriented research project**. It is not represented as independently audited or production-certified infrastructure.

Security-sensitive production use should wait for independent review, verified deployments, hardened key custody, monitoring, incident response, and the other production gates listed in the README.

## Reporting a vulnerability

Please avoid publishing exploitable details in a public issue before a fix is available.

For a report, provide:

- affected component and commit/release;
- reproduction steps or proof of concept;
- expected and observed behavior;
- security impact;
- suggested remediation if known.

If no private security-reporting channel is available in GitHub for this repository, open a minimal issue asking for a private disclosure channel without including exploit details.

## Secrets and key material

Never commit or paste into issues:

- Algorand mnemonics or private keys;
- API/indexer tokens;
- deployment credentials;
- wallet recovery material;
- production database or service credentials.

Use deployment-platform secret management for hosted environments.

## Current security boundary

The FastAPI service is read-only and is intended to observe deposits through a configured Algorand indexer. Production configuration fails closed unless:

- the indexer URL uses HTTPS;
- the escrow address is syntactically valid;
- an explicit browser CORS allowlist is configured.

The service does not currently claim end-user authentication, distributed rate limiting, custody, or an independently audited smart-contract boundary.

## Dependency and CI controls

CI is expected to run:

- Python syntax checks;
- Bandit against the backend;
- Python dependency audit;
- repository PQC/reality tests;
- JavaScript dependency audit.

A passing automated scan is not equivalent to an independent security audit.

## Production disclosure rule

Do not label Algo_Qain “audited,” “secure,” “production-ready,” or “mainnet-ready” without evidence supporting the exact statement.
