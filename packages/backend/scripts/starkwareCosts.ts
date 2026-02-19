/**
 * script to fetch starkware api data about proof and batch costs
 *
 * earliest usable api data is from ~ 2024-03-01
 *
 * just use plain `pnpm starkware-costs` to get an idea
 * or `pnpm starkware-costs 2026-02-09 2024-02-15` for a random week
 * or `pnpm starkware-costs -ls -c starknet` to list all tx targets for starknet in the last day
 *
 * ARGUMENTS:
 * [start date] - Start date of the period (YYYY-MM-DD or DD-MM-YYYY). Defaults to yesterday. [optional]
 * [end date]   - End date of the period (YYYY-MM-DD or DD-MM-YYYY). Defaults to today. [optional]
 *
 * FLAGS:
 * --list-customer-ids, -ls - List all customer ids for the period and exit.
 * --tx-target, -t          - List transaction.to addresses and counts for a single customer in this period.
 * --help, -h               - show help
 *
 * OPTIONS:
 * --customer-id, -c <str> - Customer id used in --tx-target mode. Alias is also accepted (e.g. starknet, paradex). [optional]
 */

import { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const customCustomerIds = {
  starknet: 'gcp-starknet-production_starknet-mainnet',
  paradex: 'gcp-paradigm-otc-prod_potc-production',
  edgex: 'edgex-production_edgex-production',
  sorare: 'sorare-production_sorare-prodcution',
  myria: 'gcp-myria-prod_myria-production',
  immutable: 'immutable-production_immutable-production',
} as const satisfies Record<string, string>

const SHARP_BI_BASE_URL =
  'http://sharp-bi.provingservice.io/sharp_bi/aggregations'
const SHARP_VERIFIER_ADDRESS = '0x47312450b3ac8b5b8e247a6bb6d523e7605bdb60'
const ETH_GET_TX_BY_HASH_BATCH_SIZE = 200
const ETH_RPC_MAX_429_RETRIES = 8
const ETH_RPC_RETRY_BASE_DELAY_MS = 1_000
const ETH_RPC_RETRY_MAX_DELAY_MS = 30_000
const ETH_RPC_RETRY_JITTER_RATIO = 0.25

const customNameByCustomerId: Record<string, string> = Object.fromEntries(
  Object.entries(customCustomerIds).map(([customName, customerId]) => [
    customerId,
    customName,
  ]),
)

type CostResponse = {
  proof_cost_eth: number
  onchain_data_cost_eth: number
}

type PackageResponse = {
  train_id: number
  tx_hash: string
}

type TransactionByHashRpcResult = {
  result?: {
    to: string | null
  } | null
}

type CustomerSummary = {
  customerId: string
  displayCustomer: string
  proofCostEth: number
  onchainDataCostEth: number
}

const args = {
  startDate: positional({
    type: optional(string),
    displayName: 'start date',
    description:
      'Start date of the period (YYYY-MM-DD or DD-MM-YYYY). Defaults to yesterday.',
  }),
  endDate: positional({
    type: optional(string),
    displayName: 'end date',
    description:
      'End date of the period (YYYY-MM-DD or DD-MM-YYYY). Defaults to today.',
  }),
  listCustomerIds: flag({
    type: boolean,
    long: 'list-customer-ids',
    short: 'ls',
    description: 'List all customer ids for the period and exit.',
  }),
  txTarget: flag({
    type: boolean,
    long: 'tx-target',
    short: 't',
    description:
      'List transaction.to addresses and counts for a single customer in this period.',
  }),
  customerId: option({
    type: optional(string),
    long: 'customer-id',
    short: 'c',
    description:
      'Customer id used in --tx-target mode. Alias is also accepted (e.g. starknet, paradex).',
  }),
}

const cmd = command({
  name: 'starkware-costs',
  args,
  handler: async (args) => {
    const [startDate, endDate] = getDateRange(args.startDate, args.endDate)
    const http = new HttpClient()

    console.log(`Using period: ${startDate}..${endDate}`)

    if (args.txTarget) {
      if (!args.customerId) {
        throw new Error(
          '`--customer-id` is required when `--tx-target` is set.',
        )
      }
      await runTxTargetMode(http, startDate, endDate, args.customerId)
      return
    }

    if (args.customerId) {
      console.log('Ignoring --customer-id because --tx-target is not enabled.')
    }

    const customerIds = await fetchCustomerIds(http, startDate, endDate)

    if (customerIds.length === 0) {
      console.log('No customer ids found for this period.')
      return
    }

    if (args.listCustomerIds) {
      const rows = customerIds.map((customerId) => ({
        customer: getDisplayCustomerName(customerId),
        customerId,
      }))
      console.table(rows, ['customer', 'customerId'])
      return
    }

    console.log(`Fetching /cost for ${customerIds.length} customer ids...`)
    const summaries = await Promise.all(
      customerIds.map((customerId) =>
        fetchCustomerSummary(http, startDate, endDate, customerId),
      ),
    )

    const totals = summaries.reduce(
      (acc, row) => ({
        proofCostEth: acc.proofCostEth + row.proofCostEth,
        onchainDataCostEth: acc.onchainDataCostEth + row.onchainDataCostEth,
      }),
      {
        proofCostEth: 0,
        onchainDataCostEth: 0,
      },
    )

    const table = summaries
      .sort((a, b) => b.onchainDataCostEth - a.onchainDataCostEth)
      .map((row) => ({
        customer: row.displayCustomer,
        customerId: row.customerId,
        proofCostEth: formatEth(row.proofCostEth),
        proofCostFrac: formatPercent(
          safeFraction(row.proofCostEth, totals.proofCostEth),
        ),
        onchainDataCostEth: formatEth(row.onchainDataCostEth),
        onchainDataCostFrac: formatPercent(
          safeFraction(row.onchainDataCostEth, totals.onchainDataCostEth),
        ),
      }))

    console.log(`total_proof_cost_eth=${totals.proofCostEth.toFixed(18)}`)
    console.log(
      `total_onchain_data_cost_eth=${totals.onchainDataCostEth.toFixed(18)}`,
    )
    console.table(table, [
      'customer',
      'customerId',
      'proofCostEth',
      'proofCostFrac',
      'onchainDataCostEth',
      'onchainDataCostFrac',
    ])
  },
})

run(cmd, process.argv.slice(2))

async function runTxTargetMode(
  http: HttpClient,
  startDate: string,
  endDate: string,
  customerIdInput: string,
) {
  const customerId = resolveCustomerId(customerIdInput)
  const displayCustomer = getDisplayCustomerName(customerId)

  console.log(`tx-target mode for ${displayCustomer} (${customerId})`)

  const trains = await fetchTrains(http, startDate, endDate, customerId)
  console.log(`trains_count=${trains.length}`)
  if (trains.length === 0) {
    console.log('No trains found for this customer in the selected period.')
    return
  }

  const packages = await fetchPackages(http, startDate, endDate)
  const txHashes = getUniqueTxHashesForTrains(trains, packages)
  console.log(`tx_hashes_count=${txHashes.length}`)
  if (txHashes.length === 0) {
    console.log('No tx_hashes found for this customer in the selected period.')
    return
  }

  const ethereumRpcUrl = getEthereumRpcUrl()
  console.log('Resolving transaction.to addresses from Ethereum RPC...')
  const { toCounts, rpcResultCount } = await getToAddressCounts(
    http,
    ethereumRpcUrl,
    txHashes,
  )

  const totalToCount = [...toCounts.values()].reduce(
    (sum, count) => sum + count,
    0,
  )
  const sharpCount = toCounts.get(SHARP_VERIFIER_ADDRESS) ?? 0

  console.log(`rpc_results_count=${rpcResultCount}`)
  console.log(`tx_to_count=${totalToCount}`)
  console.log(`sharp_address=${SHARP_VERIFIER_ADDRESS}`)
  console.log(`sharp_to_count=${sharpCount}`)
  console.log(
    `sharp_to_frac=${formatPercent(safeFraction(sharpCount, totalToCount))}`,
  )
  console.log('-----------------------------')
  console.log(
    'There are usually 4 targets (by number of tx): 0 MemoryPageFactRegistry, 1 FriStatementContract, 2 MerkleStatementContract, 3 SHARPVerifier CallProxy',
  )
  console.log('of which only the MemoryPageFactRegistry are batchSubmissions')

  const rows = [...toCounts.entries()]
    .map(([address, count]) => ({
      address,
      count,
      fraction: formatPercent(safeFraction(count, totalToCount)),
      sharp: address === SHARP_VERIFIER_ADDRESS ? '<< SHARP' : '',
    }))
    .sort((a, b) => b.count - a.count || a.address.localeCompare(b.address))

  console.table(rows, ['address', 'count', 'fraction', 'sharp'])
}

async function fetchCustomerSummary(
  http: HttpClient,
  startDate: string,
  endDate: string,
  customerId: string,
): Promise<CustomerSummary> {
  const cost = await fetchCost(http, startDate, endDate, customerId)

  return {
    customerId,
    displayCustomer: getDisplayCustomerName(customerId),
    proofCostEth: cost.proof_cost_eth,
    onchainDataCostEth: cost.onchain_data_cost_eth,
  }
}

async function fetchCustomerIds(
  http: HttpClient,
  startDate: string,
  endDate: string,
): Promise<string[]> {
  const ids = await fetchAggregation<string[]>(http, 'customer_ids', {
    day_start: startDate,
    day_end: endDate,
  })
  return [...ids].sort((a, b) => a.localeCompare(b))
}

function fetchCost(
  http: HttpClient,
  startDate: string,
  endDate: string,
  customerId: string,
): Promise<CostResponse> {
  return fetchAggregation<CostResponse>(http, 'cost', {
    day_start: startDate,
    day_end: endDate,
    customer_id: customerId,
  })
}

function fetchTrains(
  http: HttpClient,
  startDate: string,
  endDate: string,
  customerId: string,
): Promise<number[]> {
  return fetchAggregation<number[]>(http, 'trains', {
    day_start: startDate,
    day_end: endDate,
    customer_id: customerId,
  })
}

function fetchPackages(
  http: HttpClient,
  startDate: string,
  endDate: string,
): Promise<PackageResponse[]> {
  return fetchAggregation<PackageResponse[]>(http, 'packages', {
    day_start: startDate,
    day_end: endDate,
  })
}

async function fetchAggregation<T>(
  http: HttpClient,
  path: string,
  params: Record<string, string>,
): Promise<T> {
  const query = new URLSearchParams(params)
  const url = `${SHARP_BI_BASE_URL}/${path}?${query.toString()}`
  return (await http.fetch(url, {
    timeout: 30_000,
  })) as T
}

async function getToAddressCounts(
  http: HttpClient,
  ethereumRpcUrl: string,
  txHashes: string[],
) {
  let rpcResultCount = 0
  const toCounts = new Map<string, number>()

  for (let i = 0; i < txHashes.length; i += ETH_GET_TX_BY_HASH_BATCH_SIZE) {
    const txHashBatch = txHashes.slice(i, i + ETH_GET_TX_BY_HASH_BATCH_SIZE)
    const requestBody = txHashBatch.map((txHash, index) => ({
      jsonrpc: '2.0',
      id: i + index,
      method: 'eth_getTransactionByHash',
      params: [txHash],
    }))
    const response = await fetchRpcBatchWith429Backoff(
      http,
      ethereumRpcUrl,
      requestBody,
    )

    for (const item of response) {
      if (!item.result) {
        continue
      }
      rpcResultCount += 1
      const to = item.result.to?.toLowerCase()
      if (!to) {
        continue
      }
      toCounts.set(to, (toCounts.get(to) ?? 0) + 1)
    }
  }

  return {
    toCounts,
    rpcResultCount,
  }
}

async function fetchRpcBatchWith429Backoff(
  http: HttpClient,
  ethereumRpcUrl: string,
  requestBody: unknown[],
): Promise<TransactionByHashRpcResult[]> {
  const body = JSON.stringify(requestBody)
  let retries = 0

  while (true) {
    const res = await http.fetchRaw(ethereumRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      timeout: 120_000,
    })

    if (res.ok) {
      return (await res.json()) as TransactionByHashRpcResult[]
    }

    if (res.status !== 429 || retries >= ETH_RPC_MAX_429_RETRIES) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }

    retries += 1

    const retryAfterMs = parseRetryAfterMs(res.headers.get('retry-after'))
    const exponentialMs = Math.min(
      ETH_RPC_RETRY_MAX_DELAY_MS,
      ETH_RPC_RETRY_BASE_DELAY_MS * 2 ** (retries - 1),
    )
    const baseDelayMs = retryAfterMs ?? exponentialMs
    const jitterMs = Math.floor(
      baseDelayMs * ETH_RPC_RETRY_JITTER_RATIO * Math.random(),
    )
    const delayMs = baseDelayMs + jitterMs

    console.log(
      `Ethereum RPC rate-limited (429). Retrying in ${delayMs}ms (attempt ${retries}/${ETH_RPC_MAX_429_RETRIES}).`,
    )
    await sleep(delayMs)
  }
}

function parseRetryAfterMs(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }

  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1_000
  }

  const retryAt = Date.parse(value)
  if (Number.isNaN(retryAt)) {
    return undefined
  }

  return Math.max(0, retryAt - Date.now())
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getUniqueTxHashesForTrains(
  trains: number[],
  packages: PackageResponse[],
): string[] {
  const trainsSet = new Set(trains)
  const txHashes = new Set<string>()

  for (const pkg of packages) {
    if (!trainsSet.has(pkg.train_id)) {
      continue
    }
    txHashes.add(pkg.tx_hash.toLowerCase())
  }

  return [...txHashes]
}

function getEthereumRpcUrl(): string {
  const candidatePaths = [
    resolve(process.cwd(), 'packages/config/.env'),
    resolve(process.cwd(), '../config/.env'),
    resolve(__dirname, '../../config/.env'),
  ]

  for (const envPath of candidatePaths) {
    if (!existsSync(envPath)) {
      continue
    }
    const file = readFileSync(envPath, 'utf8')
    const line = file
      .split(/\r?\n/)
      .find((line) => line.startsWith('ETHEREUM_RPC_URL='))
    if (!line) {
      continue
    }
    const value = line.slice('ETHEREUM_RPC_URL='.length).trim()
    if (value.length > 0) {
      return value
    }
  }

  if (process.env.ETHEREUM_RPC_URL) {
    return process.env.ETHEREUM_RPC_URL
  }

  throw new Error(
    'ETHEREUM_RPC_URL is not set and was not found in packages/config/.env',
  )
}

function resolveCustomerId(customerIdOrAlias: string): string {
  return (
    customCustomerIds[customerIdOrAlias as keyof typeof customCustomerIds] ??
    customerIdOrAlias
  )
}

function getDateRange(
  startDateInput: string | undefined,
  endDateInput: string | undefined,
): [string, string] {
  if (!startDateInput) {
    console.log('No start date provided, using default value (yesterday)')
  }
  if (!endDateInput) {
    console.log('No end date provided, using default value (today)')
  }

  const startDate = startDateInput
    ? normalizeDateInput(startDateInput)
    : UnixTime.toYYYYMMDD(
        UnixTime.toStartOf(UnixTime.now(), 'day') - 1 * UnixTime.DAY,
      )
  const endDate = endDateInput
    ? normalizeDateInput(endDateInput)
    : UnixTime.toYYYYMMDD(UnixTime.toStartOf(UnixTime.now(), 'day'))

  if (startDate > endDate) {
    throw new Error(
      `Start date must be <= end date, got ${startDate}..${endDate}`,
    )
  }

  return [startDate, endDate]
}

function normalizeDateInput(input: string): string {
  const trimmed = input.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    validateIsoDate(trimmed)
    return trimmed
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('-')
    const iso = `${year}-${month}-${day}`
    validateIsoDate(iso)
    return iso
  }

  throw new Error(
    `Invalid date "${input}". Expected YYYY-MM-DD or DD-MM-YYYY format.`,
  )
}

function validateIsoDate(date: string) {
  const parsed = new Date(`${date}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${date}`)
  }
  if (parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid date: ${date}`)
  }
}

function getDisplayCustomerName(customerId: string): string {
  return customNameByCustomerId[customerId] ?? customerId
}

function safeFraction(value: number, total: number): number {
  if (total === 0) {
    return 0
  }
  return value / total
}

function formatEth(value: number): string {
  return value.toFixed(6)
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(4)}%`
}
