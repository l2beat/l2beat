- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- Do not split `eth_getLogs` requests by block range in calling code. `RpcClient` halves a range itself when the RPC reports a limit, and a fixed step multiplies requests on RPCs that have no block-range limit.
- Keep error messages static and put dynamic values in `cause`: `new Error('HTTP error', { cause: { status } })`, not `` new Error(`HTTP error: ${status}`) ``. Why: a fixed message makes Elasticsearch queries easier, since one exact match finds every occurrence.
- Gate e2e perf ratchets on counts of the work (layouts, restyled elements, boxes, layers), and log times without a ceiling. Why: GitHub's runners come with different CPUs, so the same commit times up to 2.5× apart, in CPU time as much as wall time. More in `packages/frontend/e2e/README.md`.
- For discovery research (`l2b discover`, project `config.jsonc` files, templates), read `packages/config/src/projects/AGENTS.md` first.

@AGENTS.local.md
