# Polygon PoS Interop Plugin Plan

## Goal
Implement a new interop plugin (`polygon.plugin.ts`) and a config plugin (`polygon.config.ts`) that index Polygon PoS bridge deposits and withdrawals between **ethereum** and **polygonpos**. The solution must:
- Match deposits via `StateSender.StateSynced` (L1) ↔ `StateReceiver.StateCommitted` (L2) using `id/stateId`.
- Match withdrawals via **Transfer** and **Withdraw** events, using a synthetic `matchId` based on **recipient + rootToken + amount**.
- Produce **both a Message and a Transfer** for each matched deposit or withdrawal.
- Keep the runtime plugin lean (events); heavy RPC scans for root/child mappings and predicate discovery live in the config plugin.

This plan assumes knowledge of `packages/backend/src/modules/interop/plugins/PLUGIN_GUIDE.md` and the zkstack plugin/config patterns (packages/backend/src/modules/interop/plugins/zkstack/).

---

## Files to Add / Modify

### Add
- `packages/backend/src/modules/interop/plugins/polygon/polygon.plugin.ts`
- `packages/backend/src/modules/interop/plugins/polygon/polygon.config.ts`
- (this file) `packages/backend/src/modules/interop/plugins/polygon/PLAN.md`

### Modify
- `packages/backend/src/modules/interop/plugins/index.ts`
  - import and register PolygonConfigPlugin in `configPlugins`
  - import and register PolygonPlugin in `eventPlugins`
- `packages/config/src/types.ts`
  - add `'polygon'` to `InteropPluginName`

---

## Constants & Event Signatures

### Addresses (constants in plugin)
- **StateSender** (ethereum): `0x28e4F3a7f651294B9564800b2D01f35189A5bFbE`
- **StateReceiver** (polygonpos): `0x0000000000000000000000000000000000001001`
- **RootChainManager** (ethereum): `0xA0c68C638235ee32657e8f720a23ceC1bFc77C77`
- **DepositManager** (ethereum): `0x401F6c983eA34274ec46f84D70b31C151321188b`
- **Registry** (ethereum): `0x33a02E6cC863D393d6Bf231B697b82F6e499cA71`

### Event signatures (plugin + config)
- **Deposits**
  - `StateSender.StateSynced(uint256 indexed id, address indexed contractAddress, bytes data)`
  - `StateReceiver.StateCommitted(uint256 indexed stateId, bool success)`
- **Withdrawals**
  - `Transfer(address indexed from, address indexed to, uint256 value)` (ERC20)
  - `Withdraw(address indexed token, address indexed from, uint256 amount, uint256 input1, uint256 output1)`
- **Config (RootChainManager / Registry)**
  - `RootChainManager.PredicateRegistered(bytes32 indexed tokenType, address indexed predicateAddress)`
  - `RootChainManager.TokenMapped(address indexed rootToken, address indexed childToken, bytes32 indexed tokenType)`
  - `Registry.TokenMapped(address indexed rootToken, address indexed childToken)`

### Config scan min blocks (Ethereum)
- RootChainManager: `10735430`
- Registry: `10167710`

---

## Config Plugin Design (`polygon.config.ts`)

### Config data shape (stored in InteropConfigStore)
```ts
export interface PolygonInteropConfig {
  lastSyncedBlock: number
  predicates: EthereumAddress[]
  rootToChild: Record<Address32, Address32>
  childToRoot: Record<Address32, Address32>
  rootTokens: Address32[]
  childTokens: Address32[]
}

export const PolygonConfig = defineConfig<PolygonInteropConfig>('polygon')
```

### Purpose
- Keep a token map for **rootToken ↔ childToken**.
- Keep a list of **predicate escrows** for L1 withdrawals.
- Store `lastSyncedBlock` to scan only new logs.

### RPC usage
- Only Ethereum RPC is required.
- Use `IRpcClient.getLogs(from, to, addresses, topics)`.
- No batching required (large ranges are allowed).

### Algorithm (per run)
1. Read previous config from store (if any). Initialize maps from it.
2. Resolve `latestBlock` via `ethereumRpc.getLatestBlockNumber()`.
3. Decide `fromBlock`:
   - If previous exists: `fromBlock = previous.lastSyncedBlock + 1`
   - Else: `fromBlock = min(RegistryMinBlock, RootChainManagerMinBlock)`
   - For each contract, clamp `fromBlock` to its min block if needed.
4. Fetch logs:
   - RootChainManager:
     - `PredicateRegistered`
     - `TokenMapped` (pos)
   - Registry:
     - `TokenMapped` (plasma)
5. Parse logs with `decodeEventLog` (via `viem` ABI) or reusing `createEventParser` with a light log adapter.
6. **Apply in strict chronological order**: sort by `(blockNumber, logIndex)` to ensure remaps overwrite earlier mappings.
7. Update:
   - `predicates`: add `EthereumAddress(predicateAddress)` (dedupe by equality)
   - `rootToChild[Address32.from(rootToken)] = Address32.from(childToken)` (overwrite for remaps)
8. Recompute `childToRoot`, `rootTokens`, `childTokens` from `rootToChild`.
9. Set `lastSyncedBlock = latestBlock`.
10. Only `store.set()` if config changed (`isEqual` like zkstack).

### Notes
- RootChainManager events **remap** rootToken → childToken; always overwrite with the latest event if the rootToken is already known.
- Normalize every address via `EthereumAddress()` or `Address32.from()` on ingress; avoid manual `.toLowerCase()` comparisons by always comparing normalized types.
- If Ethereum RPC missing, log and skip (or throw; follow zkstack style).

---

## Event Plugin Design (`polygon.plugin.ts`)

### Plugin name
- `name = 'polygon'`
- Must be added to `InteropPluginName` union

### Interop events
Recommended event types:
```ts
const L1StateSynced = createInteropEventType<{
  stateId: bigint
  srcTokenAddress?: Address32
  srcAmount?: bigint
}>('polygon.StateSynced', { direction: 'outgoing', ttl: 30 * UnixTime.DAY })

const L2StateCommitted = createInteropEventType<{
  stateId: bigint
  success: boolean
}>('polygon.StateCommitted', { direction: 'incoming' })

const L2WithdrawalInitiated = createInteropEventType<{
  matchId: string
  rootToken: Address32
  childToken?: Address32
  recipient: EthereumAddress
  amount: bigint
}>('polygon.WithdrawalInitiated', { direction: 'outgoing', ttl: 30 * UnixTime.DAY })

const L1WithdrawalFinalized = createInteropEventType<{
  matchId: string
  rootToken: Address32
  recipient: EthereumAddress
  amount: bigint
}>('polygon.WithdrawalFinalized', { direction: 'incoming' })
```

### Helper functions
- `polygonWithdrawMatchId(rootToken: Address32, recipient: EthereumAddress, amount: bigint)` → `${rootToken}-${recipient}-${amount}` (use normalized `Address32`/`EthereumAddress` inputs; no manual lowercasing)
- `parseTransferAmount(log)` → parse ERC20 Transfer and return `{amount, from, to}`
- `findClosestTransfer()` using `findParsedAround()` on tx logs

### getDataRequests()
Always include StateSender/StateReceiver logs. Add token-based logs when config is available.

```ts
const config = configs.get(PolygonConfig)
const rootTokens = config?.rootTokens ?? []
const childTokens = config?.childTokens ?? []

return [
  { type: 'event', signature: stateSyncedLog, includeTxEvents: [transferLog], addresses: [STATE_SENDER] },
  { type: 'event', signature: stateCommittedLog, addresses: [STATE_RECEIVER] },
  { type: 'event', signature: transferLog, addresses: rootTokens.map(a => ChainSpecificAddress.fromLong('ethereum', Address32.cropToEthereumAddress(a))) },
  { type: 'event', signature: transferLog, addresses: childTokens.map(a => ChainSpecificAddress.fromLong('polygonpos', Address32.cropToEthereumAddress(a))) },
  { type: 'event', signature: withdrawLog, addresses: childTokens.map(a => ChainSpecificAddress.fromLong('polygonpos', Address32.cropToEthereumAddress(a))) },
]
```
- Use one `transferLog` signature for topic0; parsers handle ERC20/721 differences.
- If config missing: return only StateSender/StateReceiver requests so deposits still index.

### capture() logic

#### Ethereum branch (`input.chain === 'ethereum'`)
1. **StateSynced deposit (L1)**
   - Parse `StateSynced` from StateSender address.
   - Use `findParsedAround()` on `txLogs` to find the **closest Transfer** (ERC20).
   - Set:
     - `srcTokenAddress = Address32.from(transferLog.address)`
     - `srcAmount = transfer.value`
   - Emit `L1StateSynced`.

2. **Withdrawal finalized (L1)**
   - Parse **Transfer** from rootToken address.
   - Check `from` is either:
     - `DepositManager`, or
     - Any predicate escrow from config (`predicates`).
   - If match: compute `matchId` from normalized values:
     - `recipient = EthereumAddress(to)`
     - `rootToken = Address32.from(log.address)`
     - `amount` (ERC20 value)
   - Emit `L1WithdrawalFinalized`.

#### Polygon branch (`input.chain === 'polygonpos'`)
1. **StateCommitted deposit (L2)**
   - Parse `StateCommitted` from StateReceiver.
   - If `success === false`, skip.
   - Emit `L2StateCommitted`.

2. **Withdrawal initiated (L2) via Transfer burn**
   - Parse Transfer on childToken address.
   - Condition: `to == EthereumAddress.ZERO`.
   - `recipient = from` (burner).
   - Determine `rootToken` via config `childToRoot[childToken]` (skip if missing).
   - `amount` from ERC20 value.
   - Emit `L2WithdrawalInitiated`.

3. **Withdrawal initiated (L2) via Withdraw event**
   - Parse `Withdraw` event on childToken address.
   - `recipient = from`, `amount = amount`.
   - `rootToken`:
     - Prefer `Address32.from(event.token)` (if provided), else fallback to `childToRoot[childToken]`.
   - Emit `L2WithdrawalInitiated`.

### matchTypes
- `matchTypes = [L2StateCommitted, L1WithdrawalFinalized]`
  - Deposits match when destination (`StateCommitted`) exists.
  - Withdrawals match when L1 transfer occurs (finalization).

### match() logic

#### Deposit match
- Triggered by `L2StateCommitted`.
- Find `L1StateSynced` with same `stateId`.
- Create:
  - `Result.Message('polygon.Message', { app: 'polygonpos', srcEvent: L1StateSynced, dstEvent: L2StateCommitted })`
  - `Result.Transfer('polygon.Transfer', { ... })`
    - src: `L1StateSynced` + token info from transfer
    - dstTokenAddress: map `rootToken -> childToken` if available
    - dstAmount: same as srcAmount when present
    - `srcWasBurned = false`, `dstWasMinted = true` (if you decide to set flags)

#### Withdrawal match
- Triggered by `L1WithdrawalFinalized`.
- Find `L2WithdrawalInitiated` by `matchId`.
- Create:
  - `Result.Message('polygon.Message', { app: 'polygonpos', srcEvent: L2WithdrawalInitiated, dstEvent: L1WithdrawalFinalized })`
  - `Result.Transfer('polygon.Transfer', { ... })`
    - src: L2 withdrawal (burn) with `srcWasBurned = true`
    - dst: L1 finalized (unlock) with `dstWasMinted = false`

### Notes
- `StateSynced.contractAddress` is **not used**; per requirements, capture all state syncs and match by stateId alone.
- If no Transfer found near `StateSynced`, still emit deposit events; transfer fields remain undefined.
- Ensure addresses are normalized via `Address32.from()` / `EthereumAddress()` before building `matchId`.

---

## Registration / Wiring

1. **Add plugin name**
   - `packages/config/src/types.ts`: extend `InteropPluginName` union with `'polygon'`.

2. **Register config plugin**
   - `packages/backend/src/modules/interop/plugins/index.ts`:
     - import `PolygonConfigPlugin`
     - append to `configPlugins` list

3. **Register event plugin**
   - same file: import `PolygonPlugin`
   - add to `eventPlugins` (standalone, not in a cluster)

---

## Testing & Examples

Examples already exist in `examples.jsonc`:
- `polygon-deposit` (plasma + pos deposits)
- `polygon-withdrawal` (plasma + pos withdrawals)

After implementation:
```bash
pnpm interop:example polygon-deposit --simple
pnpm interop:example polygon-withdrawal --simple
```

Then add expected events/messages/transfers to the example definitions if needed.
