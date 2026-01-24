# ZK Stack asset config (zkstack-assets)

This document describes how `packages/backend/src/modules/interop/plugins/zkstack/zkstack.config.ts` works, how it is wired into the examples script and the production backend, and notes potential improvements.

## What the config is

- **Key**: `zkstack-assets`
- **Type**: `ZkStackAssetMapping[]`
  - `assetId: 0x…` (bytes32)
  - `originChainId: number`
  - `l1TokenAddress: Address32`
  - `l2TokenAddresses: Record<string, Address32>` (one entry per L2 chain that resolved)

The config is stored via `InteropConfigStore` and consumed by `ZkStackPlugin` to resolve asset IDs into L1/L2 token addresses while parsing/matching events.

## How the config is built (zkstack.config.ts)

`ZkStackConfigPlugin` is a `TimeLoop` that refreshes every 20 minutes. Each run:

1. **Select RPCs**
   - Requires an L1 RPC for `ethereum`.
   - Uses all `ZKSTACK_SUPPORTED` L2s that have configured RPCs.

2. **Load token addresses from token DB**
   - Uses the token backend to fetch all deployed tokens (once).
   - Filters to valid 20-byte addresses per chain.

3. **Resolve asset IDs**
   - Calls `assetId(tokenAddress)` on:
     - L1 `l1NativeTokenVault` for L1 tokens.
     - Each L2 `l2SharedBridge` for that chain’s tokens.
   - Filters out failed calls and `assetId == 0x00..00`.

4. **Merge asset IDs and fetch origin chains**
   - Union of asset IDs from L1 + all L2s.
   - Calls `originChainId(assetId)` on available L1 vaults until all are resolved.

5. **Fill missing token addresses**
   - For asset IDs missing on a side, calls `tokenAddress(assetId)` on the relevant L1 vault / L2 bridge.

6. **Build mappings**
   - Keeps only entries that resolve **at least two token addresses** total
     (L1 + any L2s).
   - Stores per-chain L2 token addresses in a map.
   - Sorts by `assetId`.

7. **Store on change**
   - Compares with the previous config using deep equality.
   - Writes to `InteropConfigStore` only if changed.

## Where the config is used (zkstack.plugin.ts)

`ZkStackPlugin` calls `configs.get(ZkStackAssetsConfig)` and builds an in-memory lookup:

- `assetId -> { l1TokenAddress, l2TokenAddresses }`

This lookup is required to:

- Resolve token addresses for:
  - `BridgehubDepositInitiated` (L1 deposit of ERC-20)
  - `BridgeBurn` / `BridgeMint` (L2 shared bridge events)
  - `BridgeMintL1` (L1 withdrawals, with gas asset handled specially)

If the config is missing, the plugin skips events that need token resolution, which can lead to missing transfers/messages in matching.

## Integration #1: examples script

Relevant files:
- `packages/backend/src/modules/interop/examples/script.ts`
- `packages/backend/src/modules/interop/examples/runner.ts`
- `packages/backend/src/modules/interop/examples/examples.jsonc`

Flow:

1. The examples script creates an **in-memory** `InteropConfigStore` (no DB).
2. `ExampleRunner` builds plugins via `createInteropPlugins(...)`.
3. If an example includes `loadConfigs: ["zkstack-assets"]`, the runner:
   - finds the matching config plugin via `provides`
   - calls `config.run()` once
4. `ZkStackPlugin` then consumes the config from the in-memory store during capture/match.

Examples that load this config (from `examples.jsonc`):
- `zksync-deposit-eth`
- `zksync-deposit-erc20`
- `zksync-deposit-message`
- `zksync-withdrawal-eth`
- `zksync-withdrawal-erc20`

The examples script needs the same env as the backend for RPC access and token DB:
- `${CHAIN}_RPC_URL` for the referenced chains
- `TOKEN_BACKEND_TRPC_URL`
- `TOKEN_BACKEND_CF_TOKEN` (if required by the token backend)

## Integration #2: backend + DB (production)

Relevant files:
- `packages/backend/src/modules/interop/engine/InteropModule.ts`
- `packages/backend/src/modules/interop/engine/config/InteropConfigStore.ts`
- `packages/database/src/repositories/InteropConfigRepository.ts`
- `packages/database/prisma/schema.prisma`

Flow in prod:

1. `InteropModule` creates `InteropConfigStore(db)` and `ZkStackConfigPlugin`.
2. When `interop.config.enabled` is true:
   - `configStore.start()` loads the latest config rows from DB.
   - each config plugin `start()` begins its periodic refresh loop.
3. Each update inserts a new row into `InteropConfig`:
   - `key` (e.g., `zkstack-assets`)
   - `timestamp`
   - JSON-encoded `value`
4. The latest row per key is loaded on startup and kept in memory by `InteropConfigStore`.
5. `ZkStackPlugin` reads the config from the store during capture/match.

The DB table schema:

```
model InteropConfig {
  key       String   @db.VarChar(64)
  timestamp DateTime @db.Timestamp(6)
  value     String   @db.Text

  @@id([key, timestamp])
}
```

## Potential improvements (simplicity + robustness)

1. **Multi-chain support**
   - Implemented: builds a single mapping with L1 + per-L2 addresses across all `ZKSTACK_SUPPORTED` chains with RPCs.

2. **Token DB dependency**
   - Asset ID discovery is limited to tokens present in the token DB.
   - Consider supplementing with onchain discovery (e.g., event-derived asset IDs) or a canonical registry to avoid silent omissions when the token DB lags.

3. **Graceful degradation**
   - Missing non-critical inputs now log warnings and skip updates rather than throwing.

4. **Duplicate asset IDs**
   - Implemented: duplicates are logged when overwriting, but do not throw.

5. **Config validation + versioning**
   - Add shape validation when reading configs from DB (e.g., validate `assetId` length, chain IDs, address formats).
   - Consider a version field to allow future schema changes.

6. **Performance controls**
   - `MULTICALL_CHUNK = 400` is fixed; some RPCs may require smaller batches.
   - Option: make it configurable per RPC or auto-tune based on failures.

7. **Origin chain ID safety**
   - Keep as `number` and assume chain IDs are within safe bounds.
