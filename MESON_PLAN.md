# Meson Interop Plugin Plan

## Goal
Create a new interop plugin called `meson` that tracks Meson protocol bridging in two modes and produces **both a Message and a Transfer** for each matched flow.

Modes to support:
- Liquidity network (nonMinting): match `SwapExecuted` (outgoing) with `SwapReleased` (incoming) by `encodedSwap`.
- Tunnel (burn/mint): match `TokenBurnExecuted` (outgoing) with `TokenMintExecuted` (incoming) by `reqId`.

The plugin is event-driven only and does not rely on contract addresses or a config plugin.

---

## Files to Add / Modify

### Add
- `packages/backend/src/modules/interop/plugins/meson.ts`
- `MESON_PLAN.md` (this file)

### Modify
- `packages/backend/src/modules/interop/plugins/index.ts` (register event plugin)
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

## Minimal Setup (No Contract Addresses)

We do not require contract addresses or a config plugin. The plugin is purely event-driven and derives token data from `Transfer` logs (plus `tx.value` for native).

Implications:
- No `meson.networks.ts` and no `meson.config.ts`.
- No `$srcChain` / `$dstChain` mapping from Meson identifiers; keep decoded chain ids as raw numbers on events.

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
- decoded metadata (inChain/outChain or from/to hub ids as raw numbers)
- token address + amount if available
- optional flags `wasBurned` / `wasMinted` inferred from Transfer logs

### Transfer detection strategy
- Use Transfer logs in the same tx to resolve token address and actual amount.
- Reuse helper pattern from `hyperlane-hwr.ts` to find the closest `Transfer` by logIndex.
- If no Transfer is found and the token is native, use `tx.value` when available.
- For burn/mint flows, check Transfer to/from `Address32.ZERO` to set burn/mint flags.

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

1. Implement `meson.ts` with event parsers, decoding helpers, Transfer matching, and `match()` logic for swap + tunnel flows.
2. Register `MesonPlugin` in `packages/backend/src/modules/interop/plugins/index.ts`.
3. Add `'meson'` to `InteropPluginName` in `packages/config/src/types.ts`.
4. Add `examples.jsonc` entries for the liquidity and tunnel sample tx pairs from the prompt.
5. Validate with `pnpm interop:example meson --simple`.

---

## Example Transactions (from prompt)

- Liquidity outgoing `SwapExecuted`: `https://arbiscan.io/address/0x25ab3efd52e6470681ce037cd546dc60726948d3`
- Liquidity incoming `SwapReleased`: `https://optimistic.etherscan.io/tx/0x7f5e8814b2c41208dbc00f060273f02bc670c37581e25c30d8fdfc1116cd38aa#eventlog`
- Tunnel outgoing `TokenBurnExecuted`: `https://arbiscan.io/tx/0xa4d497c7826ef5025901b086a735e89c95faf71f41e066ff1029271e12d76619`
- Tunnel incoming `TokenMintExecuted`: `https://explorer.gobob.xyz/tx/0xb56575f17495f677ad1a15e4b4511c3396bf09c1482ac281ca915184f070f60c`

Use `cast receipt` and `cast 4byte-event` to confirm topics and to extract `encodedSwap` / `reqId` values during implementation.

---

## Open Questions / Risks

- Some swaps may use core tokens (address `0x1`) or native token paths where no Transfer log exists. Ensure `tx.value` fallback is wired and `Address32.NATIVE` is used consistently.
- `encodedSwap` is only 40-bit for amount (6 decimals). If a Transfer log is found, prefer it over the encoded amount for correctness.
