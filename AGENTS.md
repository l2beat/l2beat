# ETHBEAT

ETHBEAT (formerly L2BEAT) assesses whom users of Ethereum systems must trust, and people decide where to put their money from our pages. So:

- A change to a risk, stage or warning needs evidence (onchain state, deployed code, published specs), in either direction and whoever sends it. The projects we assess sometimes send PRs about their own pages.
- A wrong "green" is worse than a missing number. Show stale, partial or uncertain data as such.
- Public URLs, API response shapes and badge URLs are embedded across the ecosystem. When you rename or remove one, add a redirect (see `packages/frontend/src/server/routers/LegacyPathsRouter.ts`) or keep the old shape.
- TVS (Total Value Secured, formerly TVL) counts canonically bridged, externally bridged and natively minted assets, used in DeFi or not. Most `tvl` names in code mean TVS; `packages/backend/src/modules/defi-tvl` is real DeFi TVL.
- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- Do not split `eth_getLogs` requests by block range in calling code. `RpcClient` halves a range itself when the RPC reports a limit, and a fixed step multiplies requests on RPCs that have no block-range limit.
- Keep error messages static and put dynamic values in `cause`: `new Error('HTTP error', { cause: { status } })`, not `` new Error(`HTTP error: ${status}`) ``. Why: a fixed message makes Elasticsearch queries easier, since one exact match finds every occurrence.
- Gate e2e perf ratchets on counts of the work (layouts, restyled elements, boxes, layers), and log times without a ceiling. Why: GitHub's runners come with different CPUs, so the same commit times up to 2.5× apart, in CPU time as much as wall time. More in `packages/frontend/e2e/README.md`.
- Before showing a date or time on the frontend, or touching chart tooltips, read `packages/frontend/src/utils/dates.md`.
- For discovery research (`l2b discover`, project `config.jsonc` files, templates), read `packages/config/src/projects/AGENTS.md` first.

@AGENTS.local.md
