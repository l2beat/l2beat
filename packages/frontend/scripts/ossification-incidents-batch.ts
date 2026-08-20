/**
 * Batch companion to ossification-incidents.ts: measures exploited-code age
 * at incident time for every row of ossification-incidents.registry.json
 * (extracted from the DeFiHackLabs PoC headers; the registry stores the source
 * file and commit for provenance).
 *
 * Onchain truth per row, or the row is dropped:
 *   - the attack tx must exist on the stated chain (its block timestamp is the
 *     incident time),
 *   - the victim contract must have a creation tx (Etherscan v2) dated before
 *     the incident,
 *   - rows whose victim was deployed by the attacker or by the attack tx
 *     sender are excluded (ATTACKER_DEPLOYED - mislabeled "victims"),
 *   - last pre-incident change = max(deployment, EIP-1967 Upgraded logs in
 *     [creationBlock, incidentBlock]).
 *
 * Results are cached incrementally in ossification-incidents.batch-results.json
 * (keyed by registry source path) so reruns only process new/failed rows.
 *
 * Usage: npx tsx scripts/ossification-incidents-batch.ts [--retry-errors]
 */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'

const UPGRADED_TOPIC =
  '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b'
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  optimism: 10,
  bsc: 56,
  gnosis: 100,
  polygon: 137,
  base: 8453,
  arbitrum: 42161,
  avalanche: 43114,
  linea: 59144,
  blast: 81457,
  scroll: 534352,
  celo: 42220,
  mantle: 5000,
  mode: 34443,
}
const RPC_ENV: Record<string, string> = {
  ethereum: 'ETHEREUM_RPC_URL',
  optimism: 'OPTIMISM_RPC_URL',
  bsc: 'BSC_RPC_URL',
  gnosis: 'GNOSIS_RPC_URL',
  polygon: 'POLYGONPOS_RPC_URL',
  base: 'BASE_RPC_URL',
  arbitrum: 'ARBITRUM_RPC_URL',
  avalanche: 'AVALANCHE_RPC_URL',
  linea: 'LINEA_RPC_URL',
  blast: 'BLAST_RPC_URL',
  scroll: 'SCROLL_RPC_URL',
  celo: 'CELO_RPC_URL',
  mantle: 'MANTLE_RPC_URL',
  mode: 'MODE_RPC_URL',
}
const DAY = 24 * 60 * 60

interface Row {
  name: string
  month: string
  chain: string
  contract: string
  exploitTx: string
  lossUsd: number
  attacker: string | null
  source: string
}

interface BatchResult {
  name: string
  chain: string
  lossUsd: number
  status: string
  incidentTs?: number
  deployTs?: number
  upgradeCount?: number
  lastChangeTs?: number
  ageDays?: number
  ageBasis?: string
  source: string
}

let rpcCalls = 0
async function rpc(chain: string, method: string, params: unknown[]) {
  const url = process.env[RPC_ENV[chain] ?? '']
  if (!url) throw new Error(`no RPC for ${chain}`)
  for (let attempt = 0; ; attempt++) {
    rpcCalls++
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const body = (await res.json().catch(() => ({ error: 'bad json' }))) as {
      result?: unknown
      error?: unknown
    }
    if (body.error) {
      const msg = JSON.stringify(body.error)
      if (attempt < 3 && /rate|limit|timeout|429|capacity/i.test(msg)) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      throw new Error(`${method}: ${msg.slice(0, 140)}`)
    }
    return body.result
  }
}

let lastEtherscanCall = 0
async function etherscan(chain: string, params: Record<string, string>) {
  const qs = new URLSearchParams({
    chainid: String(CHAIN_IDS[chain]),
    ...params,
    apikey: process.env.ETHERSCAN_API_KEY ?? '',
  })
  for (let attempt = 0; attempt < 6; attempt++) {
    const wait = lastEtherscanCall + 260 - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastEtherscanCall = Date.now()
    const res = await fetch(`https://api.etherscan.io/v2/api?${qs}`)
    const body = (await res.json().catch(() => null)) as {
      status: string
      message: string
      result: unknown
    } | null
    if (body?.status === '1') return body.result
    const err = String(body?.result ?? 'no response')
    if (/rate limit|Max calls/i.test(err)) {
      await new Promise((r) => setTimeout(r, 1500))
      continue
    }
    throw new Error(`etherscan: ${body?.message} ${err.slice(0, 100)}`)
  }
  throw new Error('etherscan: rate limited after retries')
}

async function blockTimestamp(chain: string, blockNumber: string) {
  const block = (await rpc(chain, 'eth_getBlockByNumber', [
    blockNumber,
    false,
  ])) as { timestamp: string } | null
  if (!block) throw new Error(`block ${blockNumber} not found`)
  return Number.parseInt(block.timestamp, 16)
}

async function measure(row: Row): Promise<BatchResult> {
  const base: BatchResult = {
    name: row.name,
    chain: row.chain,
    lossUsd: row.lossUsd,
    status: 'PENDING',
    source: row.source,
  }
  const tx = (await rpc(row.chain, 'eth_getTransactionByHash', [
    row.exploitTx,
  ])) as { blockNumber: string; from: string } | null
  if (!tx?.blockNumber) return { ...base, status: 'TX_NOT_FOUND' }
  const incidentTs = await blockTimestamp(row.chain, tx.blockNumber)

  const creation = (await etherscan(row.chain, {
    module: 'contract',
    action: 'getcontractcreation',
    contractaddresses: row.contract,
  }).catch(() => null)) as
    | { txHash: string; contractCreator: string; timestamp?: string }[]
    | null
  const info = creation?.[0]
  if (!info) return { ...base, incidentTs, status: 'NO_CREATION_INFO' }

  const creator = info.contractCreator?.toLowerCase()
  const suspects = [row.attacker?.toLowerCase(), tx.from?.toLowerCase()]
  if (creator && suspects.includes(creator)) {
    return { ...base, incidentTs, status: 'ATTACKER_DEPLOYED' }
  }

  let deployTs: number
  let creationBlockHex = '0x0'
  if (info.timestamp) {
    deployTs = Number(info.timestamp)
  } else {
    const ctx = (await rpc(row.chain, 'eth_getTransactionByHash', [
      info.txHash,
    ])) as { blockNumber: string } | null
    if (!ctx?.blockNumber)
      return { ...base, incidentTs, status: 'NO_CREATION_INFO' }
    creationBlockHex = ctx.blockNumber
    deployTs = await blockTimestamp(row.chain, ctx.blockNumber)
  }
  if (deployTs > incidentTs)
    return { ...base, incidentTs, deployTs, status: 'DEPLOY_AFTER_INCIDENT' }

  let upgrades: number[] = []
  let scanFailed = false
  try {
    const logs = (await rpc(row.chain, 'eth_getLogs', [
      {
        address: row.contract,
        topics: [UPGRADED_TOPIC],
        fromBlock: creationBlockHex,
        toBlock: tx.blockNumber,
      },
    ])) as { blockNumber: string }[]
    const blocks = [...new Set(logs.map((l) => l.blockNumber))]
    for (const b of blocks) upgrades.push(await blockTimestamp(row.chain, b))
    upgrades = upgrades.sort((a, b) => a - b).filter((t) => t <= incidentTs)
  } catch {
    scanFailed = true
  }

  const lastChangeTs = Math.max(deployTs, upgrades.at(-1) ?? 0)
  return {
    ...base,
    status: 'OK',
    incidentTs,
    deployTs,
    upgradeCount: upgrades.length,
    lastChangeTs,
    ageDays: (incidentTs - lastChangeTs) / DAY,
    ageBasis: upgrades.length
      ? `last of ${upgrades.length} upgrade events (onchain)`
      : scanFailed
        ? 'deployment (onchain; upgrade scan failed)'
        : 'deployment (onchain)',
  }
}

async function main() {
  const dir = __dirname
  const registry = JSON.parse(
    readFileSync(
      path.join(dir, 'ossification-incidents.registry.json'),
      'utf-8',
    ),
  ) as { rows: Row[] }
  const cachePath = path.join(dir, 'ossification-incidents.batch-results.json')
  const cache: Record<string, BatchResult> = existsSync(cachePath)
    ? JSON.parse(readFileSync(cachePath, 'utf-8'))
    : {}
  const retryErrors = process.argv.includes('--retry-errors')

  const todo = registry.rows.filter((row) => {
    const prev = cache[row.source]
    if (!prev) return true
    if (retryErrors && /ERROR|TX_NOT_FOUND|NO_CREATION_INFO/.test(prev.status))
      return true
    return false
  })
  console.log(
    `registry: ${registry.rows.length} rows, to process: ${todo.length}`,
  )

  let done = 0
  const workers = Array.from({ length: 5 }, async () => {
    while (todo.length) {
      const row = todo.shift()
      if (!row) break
      try {
        cache[row.source] = await measure(row)
      } catch (e) {
        cache[row.source] = {
          name: row.name,
          chain: row.chain,
          lossUsd: row.lossUsd,
          status: `ERROR: ${e instanceof Error ? e.message.slice(0, 120) : e}`,
          source: row.source,
        }
      }
      done++
      if (done % 20 === 0) {
        writeFileSync(cachePath, JSON.stringify(cache, null, 1))
        console.log(`${done} processed (rpc calls: ${rpcCalls})`)
      }
    }
  })
  await Promise.all(workers)
  writeFileSync(cachePath, JSON.stringify(cache, null, 1))

  const results = Object.values(cache)
  const byStatus = new Map<string, number>()
  for (const r of results) {
    const key = r.status.startsWith('ERROR') ? 'ERROR' : r.status
    byStatus.set(key, (byStatus.get(key) ?? 0) + 1)
  }
  console.log('\nstatus counts:', Object.fromEntries(byStatus))

  const ok = results.filter((r) => r.status === 'OK')
  const ages = ok.map((r) => (r.ageDays ?? 0) / 365).sort((a, b) => a - b)
  const q = (p: number) => ages[Math.floor(p * (ages.length - 1))] ?? 0
  console.log(`\nmeasured n=${ages.length}`)
  console.log(
    `median ${(q(0.5) * 12).toFixed(1)}mo  p25 ${(q(0.25) * 12).toFixed(1)}mo  p75 ${(q(0.75) * 12).toFixed(1)}mo`,
  )
  for (const cut of [1 / 12, 0.25, 0.5, 1, 2]) {
    const frac = ages.filter((a) => a <= cut).length / ages.length
    console.log(
      `<= ${(cut * 12).toFixed(0).padStart(2)}mo: ${(100 * frac).toFixed(0)}%`,
    )
  }
  const mean = ages.reduce((a, b) => a + b, 0) / (ages.length || 1)
  console.log(`exploit-age MLE mean: ${mean.toFixed(2)}y`)
  const lossTotal = ok.reduce((a, r) => a + r.lossUsd, 0)
  const lossYoung = ok
    .filter((r) => (r.ageDays ?? 0) <= 365)
    .reduce((a, r) => a + r.lossUsd, 0)
  console.log(
    `losses: $${(lossTotal / 1e9).toFixed(2)}B total, ${((100 * lossYoung) / lossTotal).toFixed(0)}% on code <= 12mo`,
  )
  console.log(`(rpc calls this run: ${rpcCalls})`)
}

main()
