- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- Do not split `eth_getLogs` requests by block range in calling code. `RpcClient` halves a range itself when the RPC reports a limit, and a fixed step multiplies requests on RPCs that have no block-range limit.

@AGENTS.local.md
