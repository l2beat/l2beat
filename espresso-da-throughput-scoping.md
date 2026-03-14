# Espresso DA Throughput Tracking — Scoping

## Scope

Only claims reproducible via `scripts/espresso-da-blob-decode-test.ts`.

## Re-Verify

```bash
node --experimental-strip-types scripts/espresso-da-blob-decode-test.ts [QUERY_URL]
```

## How Espresso DA Works

Espresso runs a shared sequencing network (HotShot consensus) that produces a single block stream. Multiple L2s post data to the same stream, isolated by **namespace ID** — a u32 that identifies which L2 the data belongs to (e.g. 33139 for ApeChain). A block can contain data for zero, one, or many namespaces.

The key design choice is that namespace membership is encoded in the block **header** via a binary `ns_table`. A consumer can read just the header, check if their namespace is present, and know exactly how many bytes it occupies — without downloading any payload data. This makes scanning cheap.

### Query API

Base URL: `https://query.main.net.espresso.network/v0`

```
GET /status/block-height                          → current tip (plain integer)
GET /availability/header/:height                  → header with ns_table, timestamp, chain_config
GET /availability/block/:height                   → full block (header + payload + size + tx count)
GET /availability/block/:height/namespace/:ns_id  → namespace slice: proof.ns_payload + transactions[]
```

The header endpoint is the cheapest — use it for scanning. The namespace endpoint returns only the slice for one namespace, including a proof and decoded transactions.

### Block structure

```
Block
├── header
│   ├── height, timestamp (unix seconds)
│   ├── ns_table (binary, base64-encoded)
│   │   ├── [4 bytes] namespace count (u32 little-endian)
│   │   └── [8 bytes] × N entries: [ns_id: u32_le][cumulative_offset: u32_le]
│   └── chain_config
│       ├── max_block_size (1,000,000 bytes)
│       └── chain_id ("1")
├── payload (concatenated namespace payloads, ordered by ns_table)
└── size, num_transactions
```

### ns_table — how to find your namespace

The ns_table is the index into the payload. It's a flat binary array:

1. First 4 bytes: number of namespaces (u32 little-endian)
2. Then N entries of 8 bytes each: `[ns_id: u32_le][cumulative_offset: u32_le]`

To get the byte size for namespace `i`: `offset[i] - offset[i-1]` (where `offset[-1] = 0`). If your namespace ID isn't in the table, the block has no data for you.

### Namespace payload — transaction framing

Within a namespace's payload, each transaction has 8 bytes of overhead plus the raw tx bytes:

```
ns_payload = [8-byte header | tx_bytes] [8-byte header | tx_bytes] ...

ns_payload_bytes == sum(tx_payload_sizes) + num_txs * 8
```

The `/namespace/:id` endpoint returns these transactions already decoded — `transactions[].payload` is the raw tx (base64), and `proof.ns_payload` is the full namespace slice including the 8-byte headers.

## What the Script Does

Pins three ApeChain blocks (namespace 33139) and runs five checks:

**Step 1 — Block metadata.** Fetches each pinned block and header. Asserts height, timestamp, size, and tx count. Verifies timestamps are unix seconds by comparing a live block's timestamp to wall clock (drift < 600s).

| Height | Timestamp | Size | NS size | Txs |
|---:|---:|---:|---:|---:|
| 10798534 | 1772027634 | 260 | 260 | 1 |
| 10798533 | 1772027628 | 519 | 519 | 1 |
| 10798529 | 1772027620 | 2797 | 2797 | 1 |

**Step 2 — ns_table parsing.** Decodes the binary ns_table from each header. Validates bounds, parses entries, checks namespace 33139 is present with expected byte size from offset deltas.

**Step 3 — Namespace endpoint cross-check.** Fetches `/namespace/33139` for each block. Verifies:
- ns_payload byte count == ns_table-derived size
- `ns_payload == sum(tx_payloads) + num_txs * 8`
- Each transaction's decoded payload matches pinned size

| Height | TX payload | NS payload | payload + 8 |
|---:|---:|---:|---:|
| 10798534 | 252 | 260 | 260 |
| 10798533 | 511 | 519 | 519 |
| 10798529 | 2789 | 2797 | 2797 |

**Step 4 — Block intervals (observational).** Samples ~8 recent consecutive blocks, prints deltas. Not asserted.

**Step 5 — Protocol config.** Asserts `max_block_size = 1,000,000` and `chain_id = "1"` from header's `chain_config`.

## Not Verified

- Throughput (e.g. "5 MB/s")
- Finality time
- VID/DAC retention guarantees
- Namespace ID = chain ID mapping (script only tests ns 33139)
- Empty block frequency

## Implementation Implications

1. **Scan by height range** — `GET /status/block-height` for tip, iterate over `/availability/header/:h`
2. **Fast-path: parse ns_table from header** — if target namespace absent, skip block
3. **Size from offset deltas** — no payload download needed; `/namespace/:id` endpoint for full tx data
4. **`max_block_size` is a protocol cap, not throughput** — script verifies the configured value only
5. **Namespace ID is an explicit u32 per-project** — don't assume it equals chain ID
6. **Namespace may be absent in a block** — provider should skip efficiently

## File-Level Plan

| File | Change |
|---|---|
| `packages/shared/src/clients/espresso/EspressoClient.ts` | `getBlockHeight()`, `getBlock()`, `getHeader()`, `getNamespace()` |
| `packages/shared/src/clients/espresso/types.ts` | Block, header, namespace response types |
| `packages/shared/src/providers/da/EspressoDaProvider.ts` | Scan blocks, parse ns_table, extract sizes |
| `packages/shared/src/providers/da/types.ts` | `EspressoBlob` with `namespace: number` |
| `packages/config/src/types.ts` | `EspressoDaTrackingConfig` with `namespaceId`, `sinceBlock` |
| `packages/backend/.../DaService.ts` | `'espresso'` matching logic |
| Project configs (apechain) | `daTracking` with `type: 'espresso'` |
