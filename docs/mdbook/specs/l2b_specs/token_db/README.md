<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [TokenDB](#tokendb)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# TokenDB

TokenDB is the system that holds L2BEAT's canonical token catalogue —
**Abstract Tokens** (the asset, e.g. "USDC") and **Deployed Tokens**
(individual `(chain, address)` instances of an asset), plus the
connections between them. It is served by the `token-backend` package and
edited through the `token-ui` package.

The docs in this folder describe how TokenDB is kept correct:

- [Automatic token ingestion](./automatic_token_ingestion.md) — the
  background loop that discovers new deployed tokens from interop
  transfers, links them to abstract tokens (via transfer evidence and
  CoinGecko), and surfaces conflicts/errors to humans.
- [Intent / Plan / Execute](./intent_plan_execute.md) — the
  intent → plan → commands pipeline behind every human-driven write
  from token-UI, and why it exists (visible blast radius + concurrency
  safety).
