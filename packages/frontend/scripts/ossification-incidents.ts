/**
 * Incident backtest for the ossification factor.
 *
 * For every code-bug incident in ossification-incidents.data.json with an EVM
 * contract address, this script derives the exploited code's age at incident
 * time from onchain evidence:
 *   - deployment timestamp: Etherscan v2 getcontractcreation -> creation tx block
 *   - last pre-incident implementation change: EIP-1967 Upgraded(address) logs
 *     (or a per-incident event override, e.g. Compound's NewImplementation)
 *   - incident timestamp: exploit tx block when recorded, else the documented
 *     UTC date at 12:00 (max error half a day, irrelevant at month scale)
 *   - age = incident - max(deploy, last change <= incident, knownLastChange)
 *
 * knownLastChange covers architectures whose change emits no standard event
 * (beacon proxies, diamonds, route registries); the data file documents each.
 *
 * Usage:
 *   npx tsx scripts/ossification-incidents.ts          # verify + measure + stats
 *   npx tsx scripts/ossification-incidents.ts --json   # machine-readable results
 */
import { readFileSync } from 'fs'
import path from 'path'

const UPGRADED_TOPIC =
  '0xbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b'
const EVENT_TOPICS: Record<string, string> = {
  'Upgraded(address)': UPGRADED_TOPIC,
  'NewImplementation(address,address)':
    '0xd604de94d45953f9138079ec1b82d533cb2160c906d1076d1f7ed54befbca97a',
}
const CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  optimism: 10,
  bsc: 56,
  avalanche: 43114,
  arbitrum: 42161,
  linea: 59144,
  base: 8453,
}
const RPC_ENV: Record<string, string> = {
  ethereum: 'ETHEREUM_RPC_URL',
  optimism: 'OPTIMISM_RPC_URL',
  bsc: 'BSC_RPC_URL',
  avalanche: 'AVALANCHE_RPC_URL',
  arbitrum: 'ARBITRUM_RPC_URL',
  linea: 'LINEA_RPC_URL',
  base: 'BASE_RPC_URL',
}
const DAY = 24 * 60 * 60

interface Incident {
  name: string
  date: string
  chain: string
  category: string
  lossUsd: number
  contract: string | null
  exploitTx: string | null
  knownLastChange?: string | null
  upgradeEventOverride?: { event: string }
  notes: string
}

interface Result {
  name: string
  chain: string
  category: string
  lossUsd: number
  incidentTs: number
  status: string
  deployTs?: number
  upgradeCount?: number
  lastChangeTs?: number
  ageBasis?: string
  ageDays?: number
  notes: string
}

let rpcCalls = 0
async function rpc(chain: string, method: string, params: unknown[]) {
  const url = process.env[RPC_ENV[chain] ?? '']
  if (!url) throw new Error(`no RPC for ${chain}`)
  rpcCalls++
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })
  const body = (await res.json()) as { result?: unknown; error?: unknown }
  if (body.error) throw new Error(`${method}: ${JSON.stringify(body.error)}`)
  return body.result
}

async function etherscan(chain: string, params: Record<string, string>) {
  const key = process.env.ETHERSCAN_API_KEY
  const qs = new URLSearchParams({
    chainid: String(CHAIN_IDS[chain]),
    ...params,
    apikey: key ?? '',
  })
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://api.etherscan.io/v2/api?${qs}`)
    const body = (await res.json()) as {
      status: string
      message: string
      result: unknown
    }
    if (body.status === '1') return body.result
    if (String(body.result).includes('rate limit')) {
      await new Promise((r) => setTimeout(r, 1200))
      continue
    }
    throw new Error(`etherscan: ${body.message} ${JSON.stringify(body.result)}`)
  }
  throw new Error('etherscan: rate limited after retries')
}

async function blockTimestamp(chain: string, blockNumber: string | number) {
  const tag =
    typeof blockNumber === 'number'
      ? `0x${blockNumber.toString(16)}`
      : blockNumber
  const block = (await rpc(chain, 'eth_getBlockByNumber', [tag, false])) as {
    timestamp: string
  }
  return Number.parseInt(block.timestamp, 16)
}

/** binary-search the last block with timestamp <= target */
async function blockAtTime(chain: string, target: number): Promise<number> {
  const latest = (await rpc(chain, 'eth_getBlockByNumber', [
    'latest',
    false,
  ])) as { number: string; timestamp: string }
  let hi = Number.parseInt(latest.number, 16)
  if (Number.parseInt(latest.timestamp, 16) <= target) return hi
  let lo = 1
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const ts = await blockTimestamp(chain, mid)
    if (ts <= target) lo = mid
    else hi = mid - 1
  }
  return lo
}

async function upgradeTimestamps(
  chain: string,
  address: string,
  topic: string,
  toBlock: number,
): Promise<number[]> {
  const logs = (await rpc(chain, 'eth_getLogs', [
    {
      address,
      topics: [topic],
      fromBlock: '0x0',
      toBlock: `0x${toBlock.toString(16)}`,
    },
  ])) as { blockNumber: string }[]
  const blocks = [...new Set(logs.map((l) => l.blockNumber))]
  const timestamps: number[] = []
  for (const b of blocks) {
    timestamps.push(await blockTimestamp(chain, b))
  }
  return timestamps.sort((a, b) => a - b)
}

async function measure(incident: Incident): Promise<Result> {
  const incidentTs = incident.exploitTx
    ? await (async () => {
        const tx = (await rpc(incident.chain, 'eth_getTransactionByHash', [
          incident.exploitTx,
        ])) as { blockNumber: string }
        return blockTimestamp(incident.chain, tx.blockNumber)
      })()
    : Math.floor(Date.parse(`${incident.date}T12:00:00Z`) / 1000)

  const base: Result = {
    name: incident.name,
    chain: incident.chain,
    category: incident.category,
    lossUsd: incident.lossUsd,
    incidentTs,
    status: 'SCOPE_ONLY',
    notes: incident.notes,
  }
  if (
    incident.category !== 'code-bug' ||
    !incident.contract ||
    !(incident.chain in CHAIN_IDS)
  ) {
    return base
  }

  const code = (await rpc(incident.chain, 'eth_getCode', [
    incident.contract,
    'latest',
  ])) as string
  if (!code || code === '0x') return { ...base, status: 'NO_CODE' }

  const creation = (await etherscan(incident.chain, {
    module: 'contract',
    action: 'getcontractcreation',
    contractaddresses: incident.contract,
  })) as { txHash: string; blockNumber?: string }[]
  const creationTx = (await rpc(incident.chain, 'eth_getTransactionByHash', [
    creation[0]?.txHash,
  ])) as { blockNumber: string }
  const deployTs = await blockTimestamp(incident.chain, creationTx.blockNumber)
  if (deployTs > incidentTs)
    return { ...base, deployTs, status: 'DEPLOY_AFTER_INCIDENT' }

  const incidentBlock = await blockAtTime(incident.chain, incidentTs)
  const topic =
    EVENT_TOPICS[incident.upgradeEventOverride?.event ?? 'Upgraded(address)'] ??
    UPGRADED_TOPIC
  const upgrades = await upgradeTimestamps(
    incident.chain,
    incident.contract,
    topic,
    incidentBlock,
  )

  let lastChangeTs = deployTs
  let ageBasis = 'deployment (onchain)'
  const lastUpgrade = upgrades.filter((t) => t <= incidentTs).at(-1)
  if (lastUpgrade !== undefined && lastUpgrade > lastChangeTs) {
    lastChangeTs = lastUpgrade
    ageBasis = `last of ${upgrades.length} upgrade events (onchain)`
  }
  if (incident.knownLastChange) {
    const iso = incident.knownLastChange.includes('T')
      ? incident.knownLastChange
      : `${incident.knownLastChange}T12:00:00Z`
    const known = Math.floor(Date.parse(iso) / 1000)
    if (known > lastChangeTs) {
      lastChangeTs = known
      ageBasis = 'documented change (no standard event for this architecture)'
    }
  }

  return {
    ...base,
    status: 'OK',
    deployTs,
    upgradeCount: upgrades.length,
    lastChangeTs,
    ageBasis,
    ageDays: (incidentTs - lastChangeTs) / DAY,
  }
}

function fmtDays(days: number) {
  if (days < 1) return `${(days * 24).toFixed(1)}h`
  if (days < 60) return `${days.toFixed(1)}d`
  return `${(days / 30.44).toFixed(1)}mo`
}

async function main() {
  const dataPath = path.join(__dirname, 'ossification-incidents.data.json')
  const { incidents } = JSON.parse(readFileSync(dataPath, 'utf-8')) as {
    incidents: Incident[]
  }
  const results: Result[] = []
  for (const incident of incidents) {
    try {
      results.push(await measure(incident))
    } catch (e) {
      results.push({
        name: incident.name,
        chain: incident.chain,
        category: incident.category,
        lossUsd: incident.lossUsd,
        incidentTs: Math.floor(Date.parse(`${incident.date}T12:00:00Z`) / 1000),
        status: `ERROR: ${e instanceof Error ? e.message.slice(0, 120) : e}`,
        notes: incident.notes,
      })
    }
  }

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(results, null, 2))
    return
  }

  console.log(
    '\n=== code-bug incidents (age of exploited code at incident) ===',
  )
  const measured = results
    .filter((r) => r.status === 'OK')
    .sort((a, b) => (a.ageDays ?? 0) - (b.ageDays ?? 0))
  for (const r of measured) {
    console.log(
      `${r.name.padEnd(38)} ${r.chain.padEnd(10)} age ${fmtDays(r.ageDays ?? 0).padStart(8)}  loss $${(r.lossUsd / 1e6).toFixed(1).padStart(7)}M  basis: ${r.ageBasis}`,
    )
  }
  const problems = results.filter(
    (r) =>
      r.category === 'code-bug' &&
      r.status !== 'OK' &&
      r.status !== 'SCOPE_ONLY',
  )
  if (problems.length) {
    console.log('\n=== needs attention ===')
    for (const r of problems) console.log(`${r.name.padEnd(38)} ${r.status}`)
  }
  const codeNoAddress = results.filter(
    (r) => r.category === 'code-bug' && r.status === 'SCOPE_ONLY',
  )
  if (codeNoAddress.length) {
    console.log(
      `\ncode-bug without measurable EVM address (scope stats only): ${codeNoAddress.map((r) => r.name).join(', ')}`,
    )
  }

  console.log('\n=== scope: losses by category ===')
  const byCat = new Map<string, { n: number; loss: number }>()
  for (const r of results) {
    const c = byCat.get(r.category) ?? { n: 0, loss: 0 }
    c.n++
    c.loss += r.lossUsd
    byCat.set(r.category, c)
  }
  const totalLoss = results.reduce((a, r) => a + r.lossUsd, 0)
  for (const [cat, c] of [...byCat.entries()].sort(
    (a, b) => b[1].loss - a[1].loss,
  )) {
    console.log(
      `${cat.padEnd(20)} n=${String(c.n).padStart(2)}  $${(c.loss / 1e9).toFixed(2)}B  (${((100 * c.loss) / totalLoss).toFixed(0)}% of losses)`,
    )
  }

  const ages = measured.map((r) => (r.ageDays ?? 0) / 365)
  if (ages.length) {
    console.log(
      `\n=== code-age distribution at incident (n=${ages.length}) ===`,
    )
    const sorted = [...ages].sort((a, b) => a - b)
    const q = (p: number) => sorted[Math.floor(p * (sorted.length - 1))] ?? 0
    console.log(
      `median ${(q(0.5) * 12).toFixed(1)}mo  p25 ${(q(0.25) * 12).toFixed(1)}mo  p75 ${(q(0.75) * 12).toFixed(1)}mo`,
    )
    for (const cut of [1 / 12, 0.25, 0.5, 1, 2]) {
      const frac = ages.filter((a) => a <= cut).length / ages.length
      console.log(
        `<= ${(cut * 12).toFixed(0).padStart(2)}mo: ${(100 * frac).toFixed(0)}% of code-bug exploits`,
      )
    }
    const mean = ages.reduce((a, b) => a + b, 0) / ages.length
    console.log(`\nexploit-age mean: ${mean.toFixed(2)}y`)
    const lossTotal = measured.reduce((a, r) => a + r.lossUsd, 0)
    const lossYoung = measured
      .filter((r) => (r.ageDays ?? 0) <= 365)
      .reduce((a, r) => a + r.lossUsd, 0)
    console.log(
      `\nloss-weighted: ${((100 * lossYoung) / lossTotal).toFixed(0)}% of measured code-bug losses hit code <= 12mo old`,
    )
  }
  console.log(`\n(rpc calls: ${rpcCalls})`)
}

main()
