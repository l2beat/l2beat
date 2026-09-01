# Adding a Chain to the CCIP Plugin

Workflow for checking if a chain is already supported, adding support if not, and finding real txs to verify the plugin on examples.

## 1. Check if the chain is already supported

Open `ccip.config.ts` and scan `CHAINLINK_TO_L2BEAT`:

```typescript
const CHAINLINK_TO_L2BEAT: Record<string, string> = {
  'ethereum-mainnet-unichain-1': 'unichain',
  // ...
}
```

If the chain's Chainlink identifier is a key AND the L2BEAT chain name on the right is registered (passed into `CCIPConfigPlugin` via `chains`), nothing more is needed. Lanes, onRamps, offRamps, and chain selectors auto-populate from Chainlink's docs repo on the next run.

Chainlink identifier reference: `https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/chains.json`

## 2. Add a new chain

1. Find the Chainlink name in `chains.json` above.
2. Add one line to `CHAINLINK_TO_L2BEAT`:
   ```typescript
   '<chainlink-name>': '<l2beat-chain-name>',
   ```

That's it. The plugin filters to L2BEAT-tracked chains only, so nothing else has to change.

## 3. Find ramps for the chain

Enumerate lanes from `v1_2_0/mainnet/lanes.json`. Lane structure: `lanes[A][B].onRamp` lives on chain A and sends TO B. `lanes[A][B].offRamp` also lives on A and receives FROM B. Do not confuse with the mirrored entries `lanes[B][A]`.

```bash
CHAIN='ethereum-mainnet-unichain-1'
curl -s "https://raw.githubusercontent.com/smartcontractkit/documentation/main/src/config/data/ccip/v1_2_0/mainnet/lanes.json" \
| python3 -c "
import json, sys, os
d = json.load(sys.stdin)
c = os.environ['CHAIN']
print('Outbound (ON our chain, TO X):')
for dst, cfg in d.get(c, {}).items():
    print(f'  {dst}: onRamp={cfg.get(\"onRamp\",{}).get(\"address\")} offRamp={cfg.get(\"offRamp\",{}).get(\"address\")}')
print('Inbound mirror (on X side, to/from our chain):')
for src, dests in d.items():
    if c in dests:
        cfg = dests[c]
        print(f'  {src}: onRamp={cfg.get(\"onRamp\",{}).get(\"address\")} offRamp={cfg.get(\"offRamp\",{}).get(\"address\")}')
" CHAIN="$CHAIN"
```

## 4. Count activity on each ramp

Use the L2BEAT RPC from `packages/config/.env`. It accepts `fromBlock=0x0 toBlock=latest` in a single call. Public RPCs (e.g. `mainnet.unichain.org`) often cap `eth_getLogs` at 10,000 blocks, which misses older activity.

```bash
RPC="https://rpc.l2beat.com/<chain>/local:<token>"
curl -s -X POST "$RPC" -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getLogs","params":[{"fromBlock":"0x0","toBlock":"latest","address":"<ramp>"}],"id":1}' \
  | python3 -c "import json,sys; print(len(json.load(sys.stdin)['result']))"
```

Pick ramps with a healthy count (dozens or more) so you have room to pick diverse examples.

## 5. Extract real message events

Contracts emit config/ownership events too. Filter by topic0.

| Event | Topic0 |
|---|---|
| v1.5 CCIPSendRequested (OnRamp) | `0xd0c3c799bf9e2639de44391e7f524d229b2b55f5b1ea94b2bf7da42f7243dddd` |
| v1.5 ExecutionStateChanged (OffRamp) | `0xd4f851956a5d67c3997d1c9205045fef79bae2947fdee7e9e2641abc7391ef65` |

On ExecutionStateChanged: `topic[1]` is `sequenceNumber`, `topic[2]` is `messageId`, and the first 32 bytes of `data` are `state` (2 = SUCCESS).

On CCIPSendRequested, `messageId` and `sequenceNumber` are inside the non-indexed `message` struct in `data`. The struct starts after a 32-byte offset (`0x20`). Fixed fields in order: sourceChainSelector, sender, receiver, sequenceNumber (each 32 bytes). Extract seq:

```python
seq_hex = log['data'][2:][256:320]  # after 0x, skip offset+3 static fields
seq = int(seq_hex, 16)
```

## 6. Pair a source tx with its destination

Two ways:

**By sequenceNumber.** Pick a SUCCESS ExecutionStateChanged on the destination OffRamp. Read `seq = topic[1]`. Fetch every CCIPSendRequested on the source OnRamp, parse seq from `data[256:320]`, and match. Reliable and 100% local.

**By messageId via CCIP Explorer.**
```
https://ccip.chain.link/api/h/atlas/search?msgIdOrTxnHash=<txOrMsgId>
```
Only confirms a messageId exists. The `/api/h/atlas/transactions` endpoint silently ignores chain filters (`chainIds`, `sourceNetworkName`, etc.) so it is not useful for chain-scoped searches. Fall back to RPC.

## 7. Handle CCTP-backed USDC

If the chain has Circle native USDC, CCIP on that chain usually delegates USDC to CCTP. The plugin detects this (`DepositForBurn` in the same tx) and marks the CCIPSendRequested event `isCctpBacked=true`. No `ccip.Transfer` is produced for that pair.

To assert USDC flows end-to-end, load both plugins:

```jsonc
"loadConfigs": ["ccip", "cctp-v1"]
```

And assert `cctp-v1.Transfer` for the USDC pairs. Verify the chain is present in `cctp/cctp.config.ts` first.

## 8. Write and run the example

Add to `packages/backend/src/modules/interop/examples/examples.jsonc`:

```jsonc
"ccip-<chain>": {
  "loadConfigs": ["ccip", "cctp-v1"],
  "txs": [
    // Outbound (chain -> X, USDC via CCTP)
    { "chain": "<chain>", "tx": "0x..." },
    { "chain": "<other>", "tx": "0x..." },
    // Inbound (X -> chain, v1.5 Burned + Minted, TOKEN)
    { "chain": "<other>", "tx": "0x..." },
    { "chain": "<chain>", "tx": "0x..." }
  ],
  "expects": {
    "transfers": [
      { "type": "cctp-v1.Transfer" },
      { "type": "ccip.Transfer" }
    ]
  }
}
```

Run:

```bash
NODE_OPTIONS="--no-experimental-strip-types" pnpm interop:example ccip-<chain> --simple
```

Output markers:
- `[PASS]` asserted transfer was produced
- `[XTRA]` event/message/transfer was produced but not asserted (usually fine)
- `[MTCH]` event was consumed by a matcher (good, not dangling)
- `[UNMT]` event captured but nothing matched it (investigate)

## Troubleshooting

- **No logs on your ramp scans.** Confirm the L2BEAT RPC, not the chain's public endpoint. Public RPCs often cap log range at 10k blocks.
- **OffRamp on your chain shows zero activity.** You probably looked up the mirrored lane. `lanes[X][yourChain].offRamp` is on X, not yours. Use `lanes[yourChain][X].offRamp`.
- **`[UNMT]` on events.** Either the counterpart tx is missing, the chain isn't in `CHAINLINK_TO_L2BEAT`, or the chain isn't in the plugin's `chains` list.
- **`ts-node: command not found` in a fresh workspace.** Run `pnpm install` then `pnpm build` at the repo root first.
