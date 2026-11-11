# ETHBEAT

ETHBEAT (formerly L2BEAT) is an independent research organization that assesses whom users of Ethereum systems (L2s, interop, privacy, ZK and more) must trust. Our mission is to help people understand and reduce their dependence on intermediaries.

## What we never compromise on

- **Credibly neutral.** No one can pay for a better assessment. A change to a risk, stage or warning needs evidence, in either direction and whoever sends it. The projects we assess sometimes send PRs about their own pages.
- **Verifiable.** Every claim points to evidence: onchain state, deployed code, published specs. We don't do security audits, so nothing we publish should read like one.
- **Open source.** Outsiders read this repo to check and challenge our assessments, so write configs and descriptions they can follow.
- **Accurate over flattering.** A wrong "green" is worse than a missing number, because people use our pages to decide where to put their money. Show stale, partial or uncertain data as such.

## Who depends on us

Researchers, builders and the projects we assess reuse and scrutinize our work, and AI agents read it through `.md` project pages and `/llms.txt`. Our public URLs (those included), API response shapes and badge URLs are embedded across the ecosystem. When you change published content, check the `.md` pages too. When you rename or remove a URL or field, add a redirect (see `packages/frontend/src/server/routers/LegacyPathsRouter.ts`) or keep the old shape.

## Terms we use differently

- **TVS** (Total Value Secured, formerly TVL) counts canonically bridged, externally bridged and natively minted assets, used in DeFi or not. Most `tvl` names in code mean TVS; `packages/backend/src/modules/defi-tvl` is real DeFi TVL.

## Rules for working in this repo

- When writing unit tests, for repository mocks, type `mockObject` as `Database['repo']` or `TokenDatabase['repo']`; do not export/import repository classes just for tests.
- Do not split `eth_getLogs` requests by block range in calling code. `RpcClient` halves a range itself when the RPC reports a limit, and a fixed step multiplies requests on RPCs that have no block-range limit.
- Keep error messages static and put dynamic values in `cause`: `new Error('HTTP error', { cause: { status } })`, not `` new Error(`HTTP error: ${status}`) ``. Why: a fixed message makes Elasticsearch queries easier, since one exact match finds every occurrence.
- Gate e2e perf ratchets on counts of the work (layouts, restyled elements, boxes, layers), and log times without a ceiling. Why: GitHub's runners come with different CPUs, so the same commit times up to 2.5× apart, in CPU time as much as wall time. More in `packages/frontend/e2e/README.md`.
- Before showing a date or time on the frontend, or touching chart tooltips, read `packages/frontend/src/utils/dates.md`.
- For discovery research (`l2b discover`, project `config.jsonc` files, templates), read `packages/config/src/projects/AGENTS.md` first.

@AGENTS.local.md
