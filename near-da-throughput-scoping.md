# NEAR DA Throughput Tracking — Scoping (Verification-Backed)

## Scope
This document is constrained to claims that can be reproduced from:

- `scripts/near-da-blob-decode-test.sh`
- NEAR JSON-RPC responses used by that script

Any statement not covered by those checks is marked `UNVERIFIED` and should not drive implementation decisions yet.

## How To Re-Verify

```bash
bash scripts/near-da-blob-decode-test.sh [RPC_URL]
```

Example:

```bash
bash scripts/near-da-blob-decode-test.sh https://rpc.mainnet.near.org
```

The script exits non-zero if an explicit check fails.

## Verified Claims (Script-Enforced)

### 1. Example RSS3 transactions are valid `submit()` calls

The script verifies for each pinned hash:

- tx hash round-trips correctly from RPC
- `signer_id == vsl-submitter.near`
- `receiver_id == vsl-da.near`
- method is `submit`
- block height matches expected historical block

| Tx hash | Expected block | Expected decoded bytes | Expected shard |
|---|---:|---:|---:|
| `AhV75ZvmiFDmuSNXYTXzUnVTmNvrc5juF7PnXLskrxmd` | 186940409 | 10402 | 5 |
| `HjFyPUXcozKv53bMSe51fYc83HYeELCcFzjQJjLxXDMY` | 186939614 | 10819 | 5 |
| `YHupXSrz81LZTxmacsHQqgACSGcpToJxaEL5ze3XSNA` | 186938792 | 10401 | 5 |

### 2. Chunk-level extraction matches tx-level extraction

Verified flow:

```text
block(block_id)
  -> chunks[] (chunk_hash, shard_id, gas_used)
  -> chunk(chunk_id = chunk_hash)
  -> transactions[] filter by tx hash + receiver
  -> actions[].FunctionCall.args (base64)
  -> decode and count bytes
```

For all three pinned txs, chunk-derived byte size equals tx-derived byte size.

### 3. Protocol limits used in this scoping doc are RPC-derived

The script fetches `EXPERIMENTAL_protocol_config` and prints:

- `gas_limit` (per chunk)
- `epoch_length`
- `max_transaction_size`
- `max_arguments_length`
- `max_total_prepaid_gas`
- current shard count

Interpretation used here:

- `gas_limit = 1_000_000_000_000_000` means 1000 Tgas per chunk
- `max_total_prepaid_gas = 300_000_000_000_000` means 300 Tgas per transaction cap

### 4. Block interval and tx gap outputs are sample measurements only

The script measures:

- live finalized block intervals over a small recent sample
- gaps between the 3 pinned tx timestamps

These are useful sanity checks, not long-range throughput statistics.

## Explicitly Not Verified (Do Not Treat As Fact Yet)

- Total tx count for `vsl-da.near` (for example `~128,644`)
- Network-wide submission rate claims (for example `~8 tx/hour`, `~195/day`)
- Throughput claims like `4 MB/s per shard` or `~36 MB/s aggregate`
- Blob commitment structure/size claims (for example `64 bytes`)
- Full-node retention policy claims (`3-5 epochs`, `~21-36h`)
- Ethereum inbox commitment mapping claim (`0xfFFF...12553`) as a hard fact in this doc
- Any production decision to change `pruningWindow` based only on block-time arithmetic

## Implementation Implications (Based On Verified Data)

1. Add NEAR block/chunk RPC methods to the client:
   - `block` by finality and block id
   - `chunk` by chunk hash
   - `tx` for debugging/baseline validation
2. Implement `NearDaProvider` with chunk-level scanning:
   - iterate non-empty chunks
   - filter txs by configured receiver (and optional submitter)
   - decode `FunctionCall.args` and record byte length
3. Keep RPC endpoint configurable:
   - no hardcoded provider assumption in code
4. Do not hardcode shard `5`:
   - examples are on shard 5 today, but resharding can move accounts
5. Keep `pruningWindow` unchanged until policy is defined:
   - decide whether we model minimum guaranteed retention, typical retention, or conservative UX value

## File-Level Plan

| File | Planned change |
|---|---|
| `packages/shared/src/clients/near/NearClient.ts` | Add `getLatestBlockNumber()`, `getBlock()`, `getChunk()`, `getTx()` helpers |
| `packages/shared/src/clients/near/types.ts` | Add block/chunk/tx response types used by provider |
| `packages/shared/src/providers/da/NearDaProvider.ts` | New provider that extracts sizes from chunk transaction actions |
| `packages/shared/src/providers/da/types.ts` | Add `NearBlob` and extend `DaBlob` union |
| `packages/config/src/types.ts` | Add `NearDaTrackingConfig` and extend tracking unions |
| `packages/backend/src/config/features/da.ts` | Add configurable NEAR DA layer config |
| `packages/backend/src/providers/Providers.ts` | Wire `NearDaProvider` when NEAR DA layer enabled |
| `packages/backend/src/modules/data-availability/services/DaService.ts` | Add matching logic for `type: 'near'` |
| `packages/config/src/projects/rss3/rss3.ts` | Add `daTracking` mapping for `vsl-da.near` |
| `packages/config/src/projects/near/near-da.ts` | Leave `pruningWindow` unchanged until retention policy is agreed |

## Acceptance Criteria

- Script runs and ends with `PASS`.
- Script verifies tx metadata, block heights, shard, and byte sizes for pinned examples.
- Script verifies chunk-level and tx-level byte parity.
- Markdown only presents facts covered by script checks or clearly labels them `UNVERIFIED`.
