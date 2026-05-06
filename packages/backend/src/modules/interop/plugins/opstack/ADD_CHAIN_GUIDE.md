# Adding a new OP Stack chain to interop

## 1. Collect L1 proxy addresses

From the project's `discovered.json` (e.g. `packages/config/src/projects/<chain>/discovered.json`), grab the **proxy** addresses (not implementations) for:

- `OptimismPortal2`
- `L1CrossDomainMessenger`
- `L1StandardBridge`

```bash
grep -A3 '"name": "OptimismPortal2"\|"name": "L1StandardBridge"\|"name": "L1CrossDomainMessenger"' \
  packages/config/src/projects/<chain>/discovered.json | grep '"address"'
```

The implementation address is the second one listed under `implementationNames`. Use the top-level `address` instead.

## 2. Register the chain in `opstack.ts`

Add an entry to `OPSTACK_NETWORKS`. L2 predeploys are the same across OP Stack chains:

```ts
{
  chain: '<chain>',
  l2ToL1MessagePasser: ChainSpecificAddress('<chain>:0x4200000000000000000000000000000000000016'),
  l2CrossDomainMessenger: ChainSpecificAddress('<chain>:0x4200000000000000000000000000000000000007'),
  l2StandardBridge: ChainSpecificAddress('<chain>:0x4200000000000000000000000000000000000010'),
  optimismPortal: ChainSpecificAddress('eth:0x...'),
  l1CrossDomainMessenger: ChainSpecificAddress('eth:0x...'),
  l1StandardBridge: ChainSpecificAddress('eth:0x...'),
  // only for chains with a custom gas token (e.g. Celo)
  // l1CustomGasToken: Address32.from('0x...'),
},
```

Verify the `<chain>:` prefix exists in `packages/shared-pure/src/types/ChainSpecificAddress.ts`. If not, add it there first.

## 3. Find example txs

Requires `ETHEREUM_RPC_URL` and `<CHAIN>_RPC_URL` in `packages/config/.env`.

```bash
cd packages/backend
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:find-opstack <chain>
```

The script (`findOpstackExamples.ts`) searches the last 10k L1 blocks and prints tx pairs for:

- `ethDeposit` — L1→L2 ETH via StandardBridge
- `erc20Deposit` — L1→L2 ERC20 via StandardBridge
- `ethWithdrawal` — L2→L1 ETH via StandardBridge (looks back 14 days on L2)
- `erc20Withdrawal` — L2→L1 ERC20 via StandardBridge
- `directPortalEthDeposit` — L1→L2 ETH via direct OptimismPortal call (exercises the generic `OpStackPlugin` with `app: unknown`)

L2 block time is auto-detected by sampling recent blocks, so the withdrawal lookback window works for any OP Stack chain.

If a category comes back `not found`, try a larger range: `pnpm interop:find-opstack <chain> 30000`.

## 4. Add the txs to `examples.jsonc`

Mirror existing patterns. At minimum add two bidirectional standard bridge examples (eth + erc20) and append the direct portal deposit pair into the main `opstack` group:

```jsonc
"opstack-standardbridge-<chain>-eth": {
  "tags": ["opstack"],
  "description": "<chain> <-> ethereum (eth)",
  "txs": [
    { "chain": "ethereum", "tx": "<l1EthDeposit>" },
    { "chain": "<chain>",  "tx": "<l2EthDeposit>" },
    { "chain": "<chain>",  "tx": "<l2EthWithdrawal>" },
    { "chain": "ethereum", "tx": "<l1EthWithdrawal>" }
  ],
  "messages": [
    { "type": "opstack.L1ToL2Message", "app": "opstack-standardbridge" },
    { "type": "opstack.L2ToL1Message", "app": "opstack-standardbridge" }
  ],
  "transfers": [
    "opstack-standardbridge.L1ToL2Transfer",
    "opstack-standardbridge.L2ToL1Transfer"
  ]
},
```

The main `opstack` group should cover direct portal deposits so the generic plugin path is exercised.

## 5. Register the chain's `interopConfig`

Without this, matched transfers never reach `AggregatedInteropTransfer` and the dashboard shows nothing for the canonical bridge. Add an `interopConfig` block to `packages/config/src/projects/<chain>/<chain>.ts` registering the `opstack` and `opstack-standardbridge` plugins. Copy from `ink/ink.ts`.

Then from `packages/frontend` run `pnpm og-images && pnpm tinify` and commit the new `static/meta-images/interop/projects/<chain>/opengraph-image.png` plus `scripts/tinify/metadata.json`.

## 6. Run examples to verify

```bash
cd packages/backend
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example opstack-standardbridge-<chain>-eth --simple
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example opstack-standardbridge-<chain>-erc20 --simple
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example opstack --simple
```

All messages/transfers for the new chain should report `PASS`.

## Common pitfalls

- **Using implementation addresses instead of proxies.** Implementations are shared across OP Stack chains and emit no events for your specific rollup. Always use the proxy.
- **Custom gas token chains.** If the chain uses a non-ETH gas token (Celo-style), set `l1CustomGasToken` and expect native transfers to reference that ERC-20 on L1.
- **No withdrawals in recent range.** The script searches the recent 10k L1 blocks for `WithdrawalFinalized`. Rollups with low activity may need a larger `l1Blocks` argument.
- **Missing `interopConfig` on the project.** Examples pass and rows appear in `InteropTransfer`, but the dashboard shows nothing for the canonical bridge. `getInteropAggregationConfigs` iterates projects with `interopConfig`, so a chain without one is silently skipped from aggregation.
