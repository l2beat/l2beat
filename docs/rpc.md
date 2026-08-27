# RPC

## TL;DR

- Most chains' RPC traffic from the backend goes through **L2BEAT RPC**
  ([l2beat/rpc](https://github.com/l2beat/rpc)): our own log indexer plus a
  caching proxy in front of Alchemy/QuickNode. Some chains talk to a provider
  or a public node directly.
- Which of the two a chain uses is decided only by its `<CHAIN>_RPC_URL` in
  the environment (Coolify), never in code. Proxy URLs look like
  `https://<host>/<chain>/<apikey>`.
- The proxy answers `eth_getLogs` and `eth_blockNumber` itself and serves
  repeated block fetches from a cache, so the providers only bill what the
  proxy *forwards*. When measuring or optimizing RPC cost, look at the proxy
  and at the providers (see [Where to look](#where-to-look)), not at how many
  requests the backend sends.

## What the proxy does

One Go binary, two processes:

- `sync` walks every configured chain (blocks and logs) into ClickHouse and
  handles reorgs.
- `serve` exposes `POST /{chain}/{apikey}` and plans each JSON-RPC method:
  - `eth_getLogs` is answered from ClickHouse: any block range in one request.
    Above 10,000 events it returns `ErrLogResponseSizeExceeded` and the caller
    splits the range (`RpcClient` already does).
  - `eth_blockNumber` is answered from the indexed tip. Free.
  - Everything else (`eth_getBlockByNumber`, `eth_call`, `eth_getCode`, …) is
    proxied to an upstream provider through a scheduler (rate-limit pacing,
    batching, retries on 429) with an in-memory LRU response cache.

## Cache semantics

This is the part that decides what we pay for.

- The cache key is `(chain, block hash, method, full params)`.
  - The same request from any service or feature — prod, staging, activity,
    block sync, TVS — costs one upstream call; every repeat is a hit.
  - Different params are different entries: `eth_getBlockByNumber(n, false)`
    is **not** served from a cached `(n, true)`.
  - `'latest'` is resolved to the indexed tip and cached per tip hash, so it
    misses on every new block. `'pending'`, `'safe'` and `'finalized'` are
    never cached. Prefer `eth_blockNumber` plus an explicit block number.
  - Methods without a block parameter (`eth_getTransactionByHash`, receipts, …)
    are not cached.
- The cache is bounded (`CACHE_GB`). When it is full, old blocks are evicted and
  bought again; prod runs it close to 100% (`cache_usage` in the logs).
- Reorgs are safe: a reorged block has a different hash, hence a different key.

## Which chains use it

Only chains whose `<CHAIN>_RPC_URL` points at the proxy. In production (Aug
2026) that is about 30 chains: arbitrum, avalanche, base, blast, boba, bsc,
celo, ethereal, ethereum, ethscriptions, gnosis, hyperliquid, ink, katana,
linea, manta, mantle, megaeth, metis, mode, monad, nova, optimism, polygon,
robinhood, scroll, tempo, unichain, worldchain, zircuit, zksync, zora.
Everything else (e.g. abstract, lasernet, lightlink, playblock, plume) goes
straight to a provider: every request is billed and nothing is deduplicated.

The authoritative list is the Kibana data view `RPC-PROD`, field `chain`, with
`service: prod`. Staging shares the same proxy and cache (`service: stag`), so
staging traffic for chains that prod does not sync is fully billed.

## Where to look

- Kibana `RPC-PROD` (`l2beat-new-rpc*,l2beat-rpc-prod-*`): `msg: RPC` documents
  with `method`, `chain`, `service`, `cache_status` (`hit` / `miss` /
  `uncacheable`) and `cache_usage`. Misses plus uncacheable requests are what
  reaches the providers.
- Kibana `provider-usage*`: what Alchemy (compute units, per day) and QuickNode
  (credits, per billing month) actually charge, per method, chain and account.
- Backend `Rpc metrics` logs (`l2beat-production-*`, `parameters.coreFeature`):
  requests the backend *sends*, per feature. Good for proxy load and bandwidth,
  misleading for provider cost.
- `l2beat/rpc` README (architecture, configuration) and `FAILURE.md` (runbook).

## Rules of thumb for backend code

- On proxied chains, fetching the same block from several features is already a
  cache hit; deduplicating it in code saves proxy load and bandwidth, not money.
- Request the same block the same way everywhere (same `includeTransactions`
  flag) so features share one cache entry.
- Never poll with `'latest'`; use `eth_blockNumber` (free) and fetch by number.
- Large `eth_getLogs` ranges are fine on proxied chains. Direct chains keep the
  provider's range limits (`<CHAIN>_RPC_GETLOGS_MAX_RANGE`).
