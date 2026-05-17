# @l2beat/token-backend

Token Service exposes high-level interface to access data about Abstract Tokens, Deployed Tokens 
and their connections, e.g. finding all related tokens (even if connections are not direct).

## Design docs

All TokenDB design docs live under
[docs/mdbook/specs/l2b_specs/token_db/](../../docs/mdbook/specs/l2b_specs/token_db/).
These documents MUST be kept up to date when their subjects change:

- [Automatic token ingestion](../../docs/mdbook/specs/l2b_specs/token_db/automatic_token_ingestion.md) —
  the background loop that keeps TokenDB in sync with the interop
  transfer table and CoinGecko.
- [Intent / Plan / Execute](../../docs/mdbook/specs/l2b_specs/token_db/intent_plan_execute.md) —
  the pipeline behind every human-driven write from token-UI (intents →
  plans → commands), and the rationale (visible blast radius +
  concurrency safety).
