# Meson Interop Plugin Plan

## Goal
Create a new interop plugin called `meson` that tracks Meson protocol bridging in two modes and produces **both a Message and a Transfer** for each matched flow.

Modes to support:
- Liquidity network (nonMinting): match `SwapExecuted` (outgoing) with `SwapReleased` (incoming) by `encodedSwap`.
- Tunnel (burn/mint): match `TokenBurnExecuted` (outgoing) with `TokenMintExecuted` (incoming) by `reqId`.

The plugin must be event-driven only. Extra RPC/API calls are allowed only inside a `meson.config.ts` config plugin that runs periodically.

---

## Files to Add / Modify

### Add
- `packages/backend/src/modules/interop/plugins/meson.ts`
- `packages/backend/src/modules/interop/plugins/meson.config.ts`
- `packages/backend/src/modules/interop/plugins/meson.networks.ts` (static mapping helpers)
- `MESON_PLAN.md` (this file)

### Modify
- `packages/backend/src/modules/interop/plugins/index.ts` (register config plugin + event plugin)
- `packages/config/src/types.ts` (add `'meson'` to `InteropPluginName`)
- `packages/backend/src/modules/interop/examples/examples.jsonc` (add sample flows)

---

## Contract Facts (from flat sources)

### Liquidity network (MesonSwap)
Event signatures:
- `SwapExecuted(uint256 indexed encodedSwap)`
- `SwapReleased(uint256 indexed encodedSwap)`

`encodedSwap` format: `version:uint8 | amount:uint40 | salt:uint80 | fee:uint40 | expireTs:uint40 | outChain:uint16 | outToken:uint8 | inChain:uint16 | inToken:uint8`

Decode helpers in `mesonSwap_flat.sol`:
- `inChain = uint16(encodedSwap >> 8)`
- `inToken = uint8(encodedSwap)`
- `outChain = uint16(encodedSwap >> 32)`
- `outToken = uint8(encodedSwap >> 24)`
- `amount = (encodedSwap >> 208) & 0xFFFFFFFFFF` (amount is in **6 decimals**)

Token mapping is on-chain via `tokenForIndex(uint8)` and `getSupportedTokens()`.

### Tunnel (burn/mint)
Event signatures:
- `TokenBurnExecuted(bytes32 indexed reqId, address indexed proposer)`
- `TokenMintExecuted(bytes32 indexed reqId, address indexed recipient)`

`reqId` format: `version:uint8 | createdTime:uint40 | action:uint8 | tokenIndex:uint8 | amount:uint64 | from:uint8 | to:uint8 | (TBD):uint112`

Decode helpers in `tunnelContract_flat.sol`:
- `action = uint8(uint256(reqId) >> 200)`
- `tokenIndex = uint8(uint256(reqId) >> 192)`
- `amount = (uint256(reqId) >> 128) & 0xFFFFFFFFFFFFFFFF` with scaling by tokenIndex
- `from = uint8(uint256(reqId) >> 120)`
- `to = uint8(uint256(reqId) >> 112)`

Token mapping is on-chain via `tokenForIndex(uint8)` and `getSupportedTokens()`.

---

## Proposed Config Plugin (`meson.config.ts`)

### Purpose
Provide stable mapping for:
- Meson **chain identifiers** (SLIP-44 short coin types for swaps, hub ids for tunnel) to L2BEAT chain names.
- Meson **token index** to token address per chain for both Swap and Tunnel contracts.

### Suggested config shape
```
export interface MesonConfigState {
  swaps: Record<string, { chain: string; slip44: number; tokenIndexToAddress: Record<string, Address32> }>
  tunnels: Record<string, { chain: string; hubId: number; tokenIndexToAddress: Record<string, Address32> }>
  slip44ToChain: Record<number, string>
  hubIdToChain: Record<number, string>
}

export const MesonConfig = defineConfig<MesonConfigState>('meson')
```

### How to build it
Maintain a **static map** in `meson.networks.ts` for known deployments that includes chain name, MesonSwap contract address, tunnel contract address, slip44 short coin type, and hubId. Start with chains we have example txs for (arbitrum, optimism, bob) and grow later.

On each `run()`:
- For each known swap contract: call `getSupportedTokens()` and build `tokenIndex -> address` map.
- For each known tunnel contract: call `getSupportedTokens()` and build `tokenIndex -> address` map.
- Build `slip44ToChain` and `hubIdToChain` maps from static networks.

Store only if changed, using the `isEqual` pattern like `zkstack.config.ts`.

### RPC usage
- Use rpcs from `packages/config/.env` via provided `rpcs` map
- If a chain RPC is missing, log and skip that chain, but keep the previous data for it

---

## Event Plugin (`meson.ts`)

### Event signatures
```
const swapExecutedLog = 'event SwapExecuted(uint256 indexed encodedSwap)'
const swapReleasedLog = 'event SwapReleased(uint256 indexed encodedSwap)'
const tokenBurnExecutedLog = 'event TokenBurnExecuted(bytes32 indexed reqId, address indexed proposer)'
const tokenMintExecutedLog = 'event TokenMintExecuted(bytes32 indexed reqId, address indexed recipient)'
const transferLog = 'event Transfer(address indexed from, address indexed to, uint256 value)'
```

### Interop event types
- `meson.SwapExecuted` (direction: outgoing)
- `meson.SwapReleased` (direction: incoming)
- `meson.TunnelBurnExecuted` (direction: outgoing)
- `meson.TunnelMintExecuted` (direction: incoming)

Each event should carry:
- matching key (`encodedSwap` or `reqId`)
- `$srcChain` or `$dstChain`
- decoded metadata (inChain/outChain or from/to hub ids)
- token address + amount if available
- optional flags `wasBurned` / `wasMinted` inferred from Transfer logs

### Transfer detection strategy
- Use Transfer logs in the same tx to resolve token address and actual amount.
- Reuse helper pattern from `hyperlane-hwr.ts` to find the closest `Transfer` by logIndex.
- If no Transfer is found, fall back to config mapping for ERC20 tokens.
- If no Transfer is found and the token is native, use `tx.value` (requires `includeTx: true`).
- For burn/mint flows, check Transfer to/from `Address32.ZERO` to set burn/mint flags.

### Data requests (resync-safe)
We do not need to follow the `InteropPluginResyncable` standard (this would require all addresses of the emitting contracts on all supported chains) and can instead use `InteropPlugin`.

---

## Matching Logic

### Liquidity network
- Match `SwapExecuted` with `SwapReleased` by `encodedSwap`.
Create Message: `Result.Message('meson.Message', { app: 'meson-swap', srcEvent, dstEvent })`.
Create Transfer: `Result.Transfer('meson.SwapTransfer', { srcEvent, dstEvent, srcTokenAddress, srcAmount, dstTokenAddress, dstAmount, srcWasBurned, dstWasMinted })`.

### Tunnel
- Match `TokenBurnExecuted` with `TokenMintExecuted` by `reqId`.
Create Message: `Result.Message('meson.Message', { app: 'meson-tunnel', srcEvent, dstEvent })`.
Create Transfer: `Result.Transfer('meson.TunnelTransfer', { srcEvent, dstEvent, srcTokenAddress, srcAmount, dstTokenAddress, dstAmount, srcWasBurned: true, dstWasMinted: true })`.

---

## Implementation Steps

1. Add `meson.networks.ts` with a small initial static mapping of known deployments.
2. Implement `meson.config.ts` with the `MesonConfig` key, token index lookups via `getSupportedTokens()`, and chain id maps.
3. Implement `meson.ts` with event parsers, decoding helpers, Transfer matching, and `match()` logic for swap + tunnel flows.
4. Register `MesonConfigPlugin` and `MesonPlugin` in `packages/backend/src/modules/interop/plugins/index.ts`.
5. Add `'meson'` to `InteropPluginName` in `packages/config/src/types.ts`.
6. Add `examples.jsonc` entries for the liquidity and tunnel sample tx pairs from the prompt.
7. Validate with `pnpm interop:example meson --simple`.

---

## Example Transactions (from prompt)

- Liquidity outgoing `SwapExecuted`: `https://arbiscan.io/address/0x25ab3efd52e6470681ce037cd546dc60726948d3`
- Liquidity incoming `SwapReleased`: `https://optimistic.etherscan.io/tx/0x7f5e8814b2c41208dbc00f060273f02bc670c37581e25c30d8fdfc1116cd38aa#eventlog`
- Tunnel outgoing `TokenBurnExecuted`: `https://arbiscan.io/tx/0xa4d497c7826ef5025901b086a735e89c95faf71f41e066ff1029271e12d76619`
- Tunnel incoming `TokenMintExecuted`: `https://explorer.gobob.xyz/tx/0xb56575f17495f677ad1a15e4b4511c3396bf09c1482ac281ca915184f070f60c`

Use `cast receipt` and `cast 4byte-event` to confirm topics and to extract `encodedSwap` / `reqId` values during implementation.

---

## Open Questions / Risks

- Mapping `slip44` short coin types and tunnel `hubId` to L2BEAT chain names requires a trusted source. If that mapping is incomplete, matches should still be made on the basis on reqId and encodedSwap but the other metadata will be undefined or null (or for networks we usually use the UNKNOWN_xxxslip44 to designate that the decoding failed).
- Some swaps may use core tokens (address `0x1`) or native token paths where no Transfer log exists. Ensure `tx.value` fallback is wired and `Address32.NATIVE` is used consistently.
- `encodedSwap` is only 40-bit for amount (6 decimals). If a Transfer log is found, prefer it over the encoded amount for correctness.
