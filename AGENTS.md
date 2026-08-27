- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- `docs/` holds how-tos and infrastructure notes: `docs/rpc.md` (RPC proxy and cache layer, which chains use it, what providers bill), `docs/activity.md`, `docs/tvs.md`, `docs/da-tracking.md`. Read the relevant one before changing how a feature fetches data or estimating RPC provider usage.

@AGENTS.local.md
