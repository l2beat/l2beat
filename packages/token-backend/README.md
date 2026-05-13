# @l2beat/token-backend

Token Service exposes high-level interface to access data about Abstract Tokens, Deployed Tokens 
and their connections, e.g. finding all related tokens (even if connections are not direct).

## Automatic token ingestion

The backend also runs a background loop that keeps TokenDB in sync with the
interop transfer table and CoinGecko. The full design is described in
[docs/mdbook/specs/l2b_specs/automatic_token_ingestion.md](../../docs/mdbook/specs/l2b_specs/automatic_token_ingestion.md).
This document MUST be kept up to date.