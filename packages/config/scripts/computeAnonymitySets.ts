/**
 * Computes the "biggest 30-day anonymity set" metric used by the privacy
 * dashboard's summary table (see AnonymitySet in the frontend prototype's
 * `anonymitySet.ts`), from the raw privacy-flow CSV exports living in the
 * `l2beat-privacy-dashboard-prototype` repo.
 *
 * Algorithm (see conversation / spec for the full rationale):
 * - Tornado Cash: among the ETH-denominated pools, pick the bucket
 *   (denomination) with the most unique depositor addresses in the last
 *   30 days.
 * - Railgun: hardcode WETH as the dominant token, count unique addresses
 *   that deposited at least 0.1 WETH in the last 30 days.
 * - Privacy Pools: hardcode ETH as the dominant token, count unique
 *   addresses that deposited at least 0.1 ETH in the last 30 days.
 *
 * ASSUMPTIONS / SHORTCUTS (read before trusting the output):
 *
 * 1. Cross-repo path: input CSVs are read from a sibling checkout of
 *    `l2beat-privacy-dashboard-prototype`. Override with the
 *    PRIVACY_DASHBOARD_DATA_DIR env var if your checkout layout differs.
 *
 * 2. `PrivacyFlowTrxs_with_amounts.csv` is treated as the authoritative
 *    deposit-side source for Tornado Cash and Railgun. It has NO header
 *    row, so the column order below (id, protocol, bucket, block_num,
 *    tx_hash, sender, amount, token) is hardcoded and unverified beyond a
 *    handful of spot checks. It was prepared externally from a database
 *    export; this script does not validate its provenance or correctness.
 *
 * 3. Tornado Cash's on-chain `Deposit` event carries no address argument,
 *    so "sender" for tornado-cash rows is assumed to be `tx.from` of the
 *    depositing transaction. If the source database captured a different
 *    notion of "sender" (e.g. a router/relayer contract instead of the
 *    real depositor), the unique-address counts below would be wrong.
 *
 * 4. There is no timestamp column anywhere in the input data, only block
 *    numbers, so the 30-day cutoff block is resolved by binary-searching
 *    real chain data: it fetches block timestamps from a live Ethereum
 *    RPC endpoint (`ETHEREUM_RPC_URL`) until it finds the first block at
 *    or after `now - 30 days` (~25 sequential `eth_getBlockByNumber`
 *    calls). This requires network access; the script throws if
 *    `ETHEREUM_RPC_URL` is unset, and its accuracy depends on the RPC
 *    node's block timestamps and on `now` being close to the chain tip.
 *
 * 5. "Anonymity set" here means unique on-chain addresses, not unique
 *    real-world users - one person controlling many addresses inflates
 *    the count, and the zero address / any other decode artifacts are
 *    excluded on a best-effort basis (see ZERO_ADDRESS filtering) but not
 *    otherwise deduplicated by entity.
 *
 * 6. The dominant token per protocol (ETH for Tornado/Privacy Pools, WETH
 *    for Railgun) and the 0.1-unit deposit threshold for Railgun/Privacy
 *    Pools are hardcoded product decisions, not derived from the data.
 *    Tornado Cash's non-ETH buckets (DAI/USDT/WBTC/cDAI) are intentionally
 *    not scanned.
 */

import dotenv from 'dotenv'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

dotenv.config()

const DATA_DIR =
  process.env.PRIVACY_DASHBOARD_DATA_DIR ??
  join(
    __dirname,
    '../../../../l2beat-privacy-dashboard-prototype/packages/frontend/data',
  )

const TRXS_WITH_AMOUNTS_FILE = join(
  DATA_DIR,
  'PrivacyFlowTrxs_with_amounts.csv',
)
const PRIVACY_POOLS_FILE = join(DATA_DIR, 'privacy_pools_privacy_flow.csv')
const OUTPUT_FILE = 'scripts/anonymity_sets.json'

const WINDOW_DAYS = 30
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const POINT_ONE_ETHER_RAW = 1_000_000_000_000_000_00n // 1e17 = 0.1 ETH/WETH (18 decimals)

interface TrxRow {
  protocol: string
  bucket: string
  blockNum: number
  sender: string
  amountRaw: bigint
  token: string
}

interface PrivacyPoolsRow {
  action: string
  bucket: string
  address: string
  amountRaw: bigint
  token: string
  blockNumber: number
}

function getEthereumRpcUrl(): string {
  const rpcUrl = process.env.ETHEREUM_RPC_URL
  if (!rpcUrl) {
    throw new Error('ETHEREUM_RPC_URL not found in environment/.env file')
  }
  return rpcUrl
}

// Binary search for the first block whose timestamp is >= targetTimestampSeconds,
// fetching real timestamps from the RPC node instead of assuming a fixed block time.
async function findCutoffBlock(
  provider: providers.JsonRpcProvider,
  targetTimestampSeconds: number,
  latestBlockNumber: number,
): Promise<number> {
  let low = 0
  let high = latestBlockNumber

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    const block = await provider.getBlock(mid)
    if (block.timestamp < targetTimestampSeconds) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}

// `PrivacyFlowTrxs_with_amounts.csv` has no header row - see assumption #2.
function parseTrxsWithAmounts(path: string): TrxRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean)
  const rows: TrxRow[] = []
  for (const line of lines) {
    const [, protocol, bucket, blockNum, , sender, amount, token] =
      line.split(',')
    if (!protocol || !bucket || !blockNum || !sender || !amount || !token) {
      continue
    }
    rows.push({
      protocol,
      bucket,
      blockNum: Number(blockNum),
      sender: sender.toLowerCase(),
      amountRaw: BigInt(amount),
      token,
    })
  }
  return rows
}

function parsePrivacyPoolsCsv(path: string): PrivacyPoolsRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean)
  const [, ...dataLines] = lines // first line is a header
  const rows: PrivacyPoolsRow[] = []
  for (const line of dataLines) {
    const [, action, bucket, address, amountRaw, token, , blockNumber] =
      line.split(',')
    if (!action || !bucket || !address || !amountRaw || !blockNumber) {
      continue
    }
    rows.push({
      action,
      bucket,
      address: address.toLowerCase(),
      amountRaw: BigInt(amountRaw),
      token,
      blockNumber: Number(blockNumber),
    })
  }
  return rows
}

function computeTornadoCash(rows: TrxRow[], cutoffBlock: number) {
  const candidateBuckets = new Map<string, Set<string>>()

  for (const row of rows) {
    if (row.protocol !== 'tornado-cash') continue
    if (!row.bucket.startsWith('tornado-ETH-')) continue
    if (row.blockNum < cutoffBlock) continue
    if (row.sender === ZERO_ADDRESS) continue

    const set = candidateBuckets.get(row.bucket) ?? new Set<string>()
    set.add(row.sender)
    candidateBuckets.set(row.bucket, set)
  }

  const candidateCounts: Record<string, number> = {}
  let winningBucket: string | null = null
  let winningSize = -1
  for (const [bucket, addresses] of candidateBuckets) {
    candidateCounts[bucket] = addresses.size
    if (addresses.size > winningSize) {
      winningSize = addresses.size
      winningBucket = bucket
    }
  }

  return {
    bucket: winningBucket,
    setSize: winningBucket ? winningSize : 0,
    candidateBuckets: candidateCounts,
  }
}

function computeRailgun(rows: TrxRow[], cutoffBlock: number) {
  const addresses = new Set<string>()

  for (const row of rows) {
    if (row.protocol !== 'railgun') continue
    if (row.bucket !== 'railgun-WETH') continue
    if (row.blockNum < cutoffBlock) continue
    if (row.sender === ZERO_ADDRESS) continue
    if (row.amountRaw < POINT_ONE_ETHER_RAW) continue

    addresses.add(row.sender)
  }

  return {
    bucket: 'railgun-WETH',
    thresholdRaw: POINT_ONE_ETHER_RAW.toString(),
    setSize: addresses.size,
  }
}

function computePrivacyPools(rows: PrivacyPoolsRow[], cutoffBlock: number) {
  const addressesByBucket = new Map<string, Set<string>>()
  const allAddresses = new Set<string>()

  for (const row of rows) {
    if (row.action !== 'deposit') continue
    if (row.token !== 'ethereum') continue
    if (row.blockNumber < cutoffBlock) continue
    if (row.address === ZERO_ADDRESS) continue
    if (row.amountRaw < POINT_ONE_ETHER_RAW) continue

    allAddresses.add(row.address)
    const set = addressesByBucket.get(row.bucket) ?? new Set<string>()
    set.add(row.address)
    addressesByBucket.set(row.bucket, set)
  }

  const buckets: Record<string, number> = {}
  for (const [bucket, addresses] of addressesByBucket) {
    buckets[bucket] = addresses.size
  }

  return {
    token: 'ethereum',
    thresholdRaw: POINT_ONE_ETHER_RAW.toString(),
    setSize: allAddresses.size,
    buckets,
  }
}

async function main() {
  const now = new Date()
  const targetTimestampSeconds =
    Math.floor(now.getTime() / 1000) - WINDOW_DAYS * 24 * 60 * 60

  const provider = new providers.JsonRpcProvider(getEthereumRpcUrl())
  const latestBlockNumber = await provider.getBlockNumber()
  const cutoffBlock = await findCutoffBlock(
    provider,
    targetTimestampSeconds,
    latestBlockNumber,
  )
  const cutoffBlockData = await provider.getBlock(cutoffBlock)

  const trxRows = parseTrxsWithAmounts(TRXS_WITH_AMOUNTS_FILE)
  const privacyPoolsRows = parsePrivacyPoolsCsv(PRIVACY_POOLS_FILE)

  const result = {
    generatedAt: now.toISOString(),
    windowDays: WINDOW_DAYS,
    cutoffBlock,
    cutoffDate: new Date(cutoffBlockData.timestamp * 1000).toISOString(),
    'tornado-cash': computeTornadoCash(trxRows, cutoffBlock),
    railgun: computeRailgun(trxRows, cutoffBlock),
    'privacy-pools': computePrivacyPools(privacyPoolsRows, cutoffBlock),
    diagnostics: {
      trxsWithAmountsRows: trxRows.length,
      privacyPoolsRows: privacyPoolsRows.length,
    },
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2))

  console.log(JSON.stringify(result, null, 2))
  console.log(`\nWrote ${OUTPUT_FILE}`)
}

main().catch((e: unknown) => {
  console.error(e)
})
