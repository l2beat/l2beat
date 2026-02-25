/**
 * Espresso DA blob decode verification for ApeChain (namespace 33139).
 *
 * Usage:
 *   node --experimental-strip-types scripts/espresso-da-blob-decode-test.ts [QUERY_URL]
 *
 * Node.js 22.6+. No external dependencies.
 *
 * Default: https://query.main.net.espresso.network/v0
 */

const QUERY_URL = process.argv[2] ?? 'https://query.main.net.espresso.network/v0'
const NAMESPACE_ID = 33139

const PINNED_BLOCKS = [
  { height: 10798534, timestamp: 1772027634, totalSize: 260, nsSize: 260, numTxs: 1, txPayloadBytes: 252 },
  { height: 10798533, timestamp: 1772027628, totalSize: 519, nsSize: 519, numTxs: 1, txPayloadBytes: 511 },
  { height: 10798529, timestamp: 1772027620, totalSize: 2797, nsSize: 2797, numTxs: 1, txPayloadBytes: 2789 },
]

let failures = 0
function pass(msg: string) { console.log(`  ✓ ${msg}`) }
function fail(msg: string) { console.log(`  ✗ ${msg}`); failures++ }
function check(ok: boolean, passMsg: string, failMsg: string) { ok ? pass(passMsg) : fail(failMsg) }

async function query(path: string): Promise<unknown> {
  const url = `${QUERY_URL}${path}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`HTTP ${resp.status} from ${url}: ${await resp.text()}`)
  return (resp.headers.get('content-type') ?? '').includes('application/json')
    ? resp.json()
    : resp.text()
}

function readU32LE(buf: Buffer, offset: number): number {
  return buf.readUInt32LE(offset)
}

function parseNsTable(b64: string): { count: number; entries: { nsId: number; offset: number }[] } {
  const buf = Buffer.from(b64, 'base64')
  if (buf.length < 4) {
    throw new Error(`ns_table too short: ${buf.length} bytes (need >=4)`)
  }
  const count = readU32LE(buf, 0)
  const needed = 4 + count * 8
  if (buf.length < needed) {
    throw new Error(`ns_table truncated: ${buf.length} bytes, count=${count} needs ${needed}`)
  }
  const entries: { nsId: number; offset: number }[] = []
  for (let i = 0; i < count; i++) {
    const base = 4 + i * 8
    entries.push({ nsId: readU32LE(buf, base), offset: readU32LE(buf, base + 4) })
  }
  return { count, entries }
}

function namespaceSizes(entries: { nsId: number; offset: number }[]): Map<number, number> {
  const sizes = new Map<number, number>()
  let prev = 0
  for (const { nsId, offset } of entries) {
    sizes.set(nsId, offset - prev)
    prev = offset
  }
  return sizes
}

async function main() {
  console.log('=== Espresso DA Blob Decode Verification ===')
  console.log(`Query: ${QUERY_URL}  NS: ${NAMESPACE_ID}`)
  console.log()

  // Step 1: Pinned block metadata
  console.log('--- Step 1: Pinned block metadata ---')
  for (const pin of PINNED_BLOCKS) {
    const block = (await query(`/availability/block/${pin.height}`)) as {
      size: number; num_transactions: number
    }
    const header = (await query(`/availability/header/${pin.height}`)) as {
      fields: { height: number; timestamp: number }
    }
    const h = header.fields
    console.log(`  block=${pin.height} ts=${h.timestamp} size=${block.size} txs=${block.num_transactions}`)
    check(h.height === pin.height, `height=${h.height}`, `height: got ${h.height}, want ${pin.height}`)
    check(h.timestamp === pin.timestamp, `timestamp=${h.timestamp}`, `timestamp: got ${h.timestamp}, want ${pin.timestamp}`)
    check(block.size === pin.totalSize, `size=${block.size}`, `size: got ${block.size}, want ${pin.totalSize}`)
    check(block.num_transactions === pin.numTxs, `num_transactions=${block.num_transactions}`, `num_transactions: got ${block.num_transactions}, want ${pin.numTxs}`)
  }

  // Timestamp unit check: fetch a live header, compare to wall clock.
  // If timestamp * 1000 is within 10 minutes of Date.now(), it's unix seconds.
  const liveHeight = Number(await query('/status/block-height')) - 5
  const liveHeader = (await query(`/availability/header/${liveHeight}`)) as {
    fields: { timestamp: number }
  }
  const liveTs = liveHeader.fields.timestamp
  const wallSec = Math.floor(Date.now() / 1000)
  const drift = Math.abs(liveTs - wallSec)
  console.log(`  live block=${liveHeight} ts=${liveTs} wall=${wallSec} drift=${drift}s`)
  check(drift < 600, `timestamp ≈ wall clock (drift ${drift}s < 600s → unix seconds)`, `drift ${drift}s too large — timestamp may not be unix seconds`)
  console.log()

  // Step 2: ns_table parsing
  console.log('--- Step 2: ns_table parsing and namespace sizes ---')
  for (const pin of PINNED_BLOCKS) {
    const header = (await query(`/availability/header/${pin.height}`)) as {
      fields: { ns_table: { bytes: string } }
    }
    const { count, entries } = parseNsTable(header.fields.ns_table.bytes)
    const sizes = namespaceSizes(entries)
    const nsSize = sizes.get(NAMESPACE_ID)
    console.log(`  block=${pin.height} ns_count=${count} entries=[${entries.map(e => `${e.nsId}:${e.offset}`).join(', ')}]`)
    check(entries.some(e => e.nsId === NAMESPACE_ID), `ns ${NAMESPACE_ID} present`, `ns ${NAMESPACE_ID} missing`)
    check(nsSize === pin.nsSize, `ns size=${nsSize}`, `ns size: got ${nsSize}, want ${pin.nsSize}`)
  }
  console.log()

  // Step 3: Namespace endpoint consistency
  console.log('--- Step 3: Namespace endpoint consistency ---')
  for (const pin of PINNED_BLOCKS) {
    const nsResp = (await query(`/availability/block/${pin.height}/namespace/${NAMESPACE_ID}`)) as {
      proof: { ns_payload: string }
      transactions: { namespace: number; payload: string }[]
    }
    const nsPayloadLen = Buffer.from(nsResp.proof.ns_payload, 'base64').length
    console.log(`  block=${pin.height} ns_payload=${nsPayloadLen} txs=${nsResp.transactions.length}`)
    check(nsPayloadLen === pin.nsSize, `ns_payload (${nsPayloadLen}) == ns_table (${pin.nsSize})`, `ns_payload (${nsPayloadLen}) != ns_table (${pin.nsSize})`)

    let txPayloadSum = 0
    for (const tx of nsResp.transactions) {
      txPayloadSum += Buffer.from(tx.payload, 'base64').length
      check(tx.namespace === NAMESPACE_ID, `tx ns=${tx.namespace}`, `tx ns: got ${tx.namespace}, want ${NAMESPACE_ID}`)
    }
    const expected = txPayloadSum + nsResp.transactions.length * 8
    check(nsPayloadLen === expected, `${nsPayloadLen} == ${txPayloadSum} + ${nsResp.transactions.length}*8`, `${nsPayloadLen} != ${txPayloadSum} + ${nsResp.transactions.length}*8`)

    if (nsResp.transactions.length === 1) {
      const len = Buffer.from(nsResp.transactions[0].payload, 'base64').length
      check(len === pin.txPayloadBytes, `tx payload=${len}`, `tx payload: got ${len}, want ${pin.txPayloadBytes}`)
    }
  }
  console.log()

  // Step 4: Sample block intervals (observational)
  console.log('--- Step 4: Sample block intervals (observational) ---')
  const tip = Number(await query('/status/block-height')) - 5
  const sampleCount = 8
  const start = tip - sampleCount
  console.log(`  tip=${tip} range=${start}..${tip}`)

  const timestamps: number[] = []
  for (let h = start; h <= tip; h++) {
    const hdr = (await query(`/availability/header/${h}`)) as { fields: { timestamp: number } }
    timestamps.push(hdr.fields.timestamp)
  }
  let min = Infinity, max = 0, sum = 0, n = 0
  for (let i = 1; i < timestamps.length; i++) {
    const d = timestamps[i] - timestamps[i - 1]
    console.log(`  block=${start + i} delta=${d}s`)
    sum += d; n++
    if (d < min) min = d
    if (d > max) max = d
  }
  if (n > 0) console.log(`  avg=${(sum / n).toFixed(1)}s min=${min}s max=${max}s (n=${n})`)
  console.log()

  // Step 5: Protocol config
  console.log('--- Step 5: Protocol config ---')
  const cfgHeader = (await query(`/availability/header/${PINNED_BLOCKS[0].height}`)) as {
    fields: { chain_config: { chain_config: { Left: { max_block_size: string; chain_id: string } } } }
  }
  const cfg = cfgHeader.fields.chain_config.chain_config.Left
  const maxBlock = Number(cfg.max_block_size)
  console.log(`  max_block_size=${maxBlock} chain_id=${cfg.chain_id}`)
  check(maxBlock === 1_000_000, `max_block_size=1000000`, `max_block_size=${maxBlock}, want 1000000`)
  check(cfg.chain_id === '1', `chain_id="1"`, `chain_id="${cfg.chain_id}", want "1"`)
  console.log()

  // Summary
  console.log('--- Summary ---')
  if (failures === 0) {
    console.log('PASS: all checks succeeded.')
  } else {
    console.log(`FAIL: ${failures} check(s) failed.`)
    process.exit(1)
  }
}

main().catch((err) => { console.error('FATAL:', err); process.exit(2) })
