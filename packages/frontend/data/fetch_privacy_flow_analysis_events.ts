import { createWriteStream } from 'node:fs'
import { rename } from 'node:fs/promises'
import { finished } from 'node:stream/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ProjectDiscovery } from '../../config/src/discovery/ProjectDiscovery'
import generatedTokens from '../../config/src/tokens/generated.json'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

const DATA_DIR = dirname(fileURLToPath(import.meta.url))
const TORNADO_OUTPUT = 'tornado_cash_privacy_flow.csv'
const RAILGUN_OUTPUT = 'railgun_privacy_flow.csv'
const PRIVACY_POOLS_OUTPUT = 'privacy_pools_privacy_flow.csv'

const TORNADO_WITHDRAWAL_TOPIC =
  '0xe9e508bad6d4c3227e881ca19068f099da81b5164dd6d62b2eaf1e8bc6c34931'
const RAILGUN_UNSHIELD_TOPIC =
  '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284'
const PRIVACY_POOLS_DEPOSITED_TOPIC =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const PRIVACY_POOLS_RAGEQUIT_TOPIC =
  '0xd2b3e868ae101106371f2bd93abc8d5a4de488b9fe47ed122c23625aa7172f13'
const PRIVACY_POOLS_WITHDRAWN_TOPIC =
  '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21'

const PRIVACY_POOLS_NATIVE_ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const RPC_TIMEOUT_MS = 30_000
const LOG_FILTER_BATCH_SIZE = 25
const CALL_BATCH_SIZE = 100
const EVENT_PROGRESS_INTERVAL = 50_000

const INCLUDE_HEADER = !process.argv.includes('--no-header')

const tornadoInterface = new utils.Interface([
  'function denomination() view returns (uint256)',
  'function token() view returns (address)',
  'event Withdrawal(address to, bytes32 nullifierHash, address indexed relayer, uint256 fee)',
])

const railgunInterface = new utils.Interface([
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

const privacyPoolsInterface = new utils.Interface([
  'function ASSET() view returns (address)',
  'event Deposited(address indexed _depositor, uint256 _commitment, uint256 _label, uint256 _value, uint256 _precommitmentHash)',
  'event Ragequit(address indexed _ragequitter, uint256 _commitment, uint256 _label, uint256 _value)',
  'event Withdrawn(address indexed _processooor, uint256 _value, uint256 _spentNullifier, uint256 _newCommitment)',
])

const erc20MetadataInterface = new utils.Interface([
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
])

const erc20Bytes32SymbolInterface = new utils.Interface([
  'function symbol() view returns (bytes32)',
])

type RpcResponseItem = {
  id?: unknown
  result?: unknown
  error?: {
    code?: unknown
    message?: unknown
    data?: unknown
  }
}

type RpcRequest = {
  jsonrpc: '2.0'
  id: number
  method: string
  params: unknown[]
}

type RpcLog = {
  address: string
  data: string
  topics: string[]
  blockNumber: string
  transactionHash: string
  logIndex: string
}

type LogFilter = {
  addresses: string[]
  topics: (string | string[] | null)[]
  fromBlock: number
  toBlock: number
}

type CallSpec = {
  address: string
  data: string
  allowFailure?: boolean
}

type TokenMetadata = {
  address: string
  coingeckoId: string
  decimals: number
  symbol: string
}

type OutputRow = {
  protocol: 'tornado-cash' | 'railgun' | 'privacy-pools'
  action: 'deposit' | 'withdrawal'
  bucket: string
  address: string
  amountRaw: string
  token: string
  tokenAddress: string
  blockNumber: number
  txHash: string
  logIndex: number
  contractAddress: string
}

type TornadoPoolMetadata = {
  address: string
  sinceBlock: number
  denomination: bigint
  token: TokenMetadata
}

type PrivacyPoolMetadata = {
  address: string
  sinceBlock: number
  token: TokenMetadata
}

const HEADER = [
  'protocol',
  'action',
  'bucket',
  'address',
  'amount_raw',
  'token',
  'token_address',
  'block_number',
  'tx_hash',
  'log_index',
  'contract_address',
]

const FALLBACK_TOKEN_METADATA: Record<string, TokenMetadata> = {
  '0xdc035d45d973e3ec169d2276ddab16f1e407384f': {
    address: '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
    coingeckoId: 'usds',
    decimals: 18,
    symbol: 'USDS',
  },
  '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d': {
    address: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    coingeckoId: 'usd1',
    decimals: 18,
    symbol: 'USD1',
  },
  '0xcacd6fd266af91b8aed52accc382b4e165586e29': {
    address: '0xcacd6fd266af91b8aed52accc382b4e165586e29',
    coingeckoId: 'frax-price-index',
    decimals: 18,
    symbol: 'frxUSD',
  },
  '0xdcee70654261af21c44c093c300ed3bb97b78192': {
    address: '0xdcee70654261af21c44c093c300ed3bb97b78192',
    coingeckoId: 'wrapped-oeth',
    decimals: 18,
    symbol: 'WOETH',
  },
  '0x085780639cc2cacd35e474e71f4d000e2405d8f6': {
    address: '0x085780639cc2cacd35e474e71f4d000e2405d8f6',
    coingeckoId: 'fxusd',
    decimals: 18,
    symbol: 'fxUSD',
  },
  '0x6440f144b7e50d6a8439336510312d2f54beb01d': {
    address: '0x6440f144b7e50d6a8439336510312d2f54beb01d',
    coingeckoId: 'bold',
    decimals: 18,
    symbol: 'BOLD',
  },
  '0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4': {
    address: '0x85f17cf997934a597031b2e18a9ab6ebd4b9f6a4',
    coingeckoId: 'near',
    decimals: 24,
    symbol: 'NEAR',
  },
  '0xe76c6c83bc8d0c0c2cc3c6d1e7c6f21673a7a33d': {
    address: '0xe76c6c83bc8d0c0c2cc3c6d1e7c6f21673a7a33d',
    coingeckoId: 'rail',
    decimals: 18,
    symbol: 'RAIL',
  },
  '0x6f40d4a6237c257fff2db00fa0510deeecd303eb': {
    address: '0x6f40d4a6237c257fff2db00fa0510deeecd303eb',
    coingeckoId: 'fluid',
    decimals: 18,
    symbol: 'FLUID',
  },
}

const tokenMetadataByAddress = new Map<string, TokenMetadata>()
for (const token of generatedTokens.tokens) {
  if (token.chainId !== 1) continue
  if (typeof token.address !== 'string') continue
  tokenMetadataByAddress.set(token.address.toLowerCase(), {
    address: token.address.toLowerCase(),
    coingeckoId: token.coingeckoId,
    decimals: token.decimals,
    symbol: token.symbol,
  })
}

function logInfo(scope: string, message: string) {
  console.error(`[${scope}] ${message}`)
}

function logEventProgress(protocol: string, processed: number) {
  if (processed > 0 && processed % EVENT_PROGRESS_INTERVAL === 0) {
    logInfo(protocol, `Processed ${processed.toLocaleString()} events so far.`)
  }
}

function showHelp() {
  console.log(`Usage: tsx data/fetch_privacy_flow_analysis_events.ts [--no-header]

Environment:
  ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY
  ETHEREUM_RPC_URL_FOR_DISCOVERY
  ETHEREUM_RPC_URL
`)
}

function getRpcUrl(): string {
  const url =
    process.env.ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY ??
    process.env.ETHEREUM_RPC_URL_FOR_DISCOVERY ??
    process.env.ETHEREUM_RPC_URL

  if (!url) {
    throw new Error(
      'Missing Ethereum RPC URL. Set ETHEREUM_EVENT_RPC_URL_FOR_DISCOVERY, ETHEREUM_RPC_URL_FOR_DISCOVERY, or ETHEREUM_RPC_URL.',
    )
  }

  return url
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size))
  }
  return result
}

function normalizeAddress(address: string): string {
  return address.toLowerCase()
}

function hexToNumber(value: string): number {
  return Number(BigInt(value))
}

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

function isLimitExceededError(error: unknown): boolean {
  if (!isObject(error)) return false
  const message = typeof error.message === 'string' ? error.message : ''
  return (
    message.includes('Log response size exceeded') ||
    message.includes('query returned more than') ||
    message.includes('eth_getLogs is limited to') ||
    message.includes('block range is too wide') ||
    message.includes('please limit the query')
  )
}

function getTokenMetadata(address: string): TokenMetadata {
  const normalized = normalizeAddress(address)
  if (normalized === PRIVACY_POOLS_NATIVE_ETH) {
    return {
      address: '',
      coingeckoId: 'ethereum',
      decimals: 18,
      symbol: 'ETH',
    }
  }

  const token = tokenMetadataByAddress.get(normalized)
  if (token) {
    return token
  }

  const fallback = FALLBACK_TOKEN_METADATA[normalized]
  if (fallback) {
    return fallback
  }

  throw new Error(`Missing token metadata for ${address}`)
}

function slugifyTokenSymbol(symbol: string): string {
  return symbol.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function decodeSymbolResult(result: string | undefined): string | undefined {
  if (!result) return undefined

  try {
    const [symbol] = erc20MetadataInterface.decodeFunctionResult('symbol', result)
    if (typeof symbol === 'string' && symbol.trim() !== '') {
      return symbol.trim()
    }
  } catch {
    // ignore
  }

  try {
    const [symbolBytes] = erc20Bytes32SymbolInterface.decodeFunctionResult(
      'symbol',
      result,
    )
    if (typeof symbolBytes === 'string') {
      return utils.parseBytes32String(symbolBytes).trim()
    }
  } catch {
    // ignore
  }

  return undefined
}

function decodeDecimalsResult(result: string | undefined): number | undefined {
  if (!result) return undefined

  try {
    const [decimals] = erc20MetadataInterface.decodeFunctionResult(
      'decimals',
      result,
    )
    return Number(decimals)
  } catch {
    return undefined
  }
}

async function resolveTokenMetadata(
  address: string,
  rpcUrl: string,
): Promise<TokenMetadata> {
  const normalized = normalizeAddress(address)

  try {
    return getTokenMetadata(normalized)
  } catch {
    const [symbolResult, decimalsResult] = await rpcCalls(rpcUrl, [
      {
        address: normalized,
        data: erc20MetadataInterface.encodeFunctionData('symbol'),
        allowFailure: true,
      },
      {
        address: normalized,
        data: erc20MetadataInterface.encodeFunctionData('decimals'),
        allowFailure: true,
      },
    ])

    const symbol = decodeSymbolResult(symbolResult)
    const decimals = decodeDecimalsResult(decimalsResult)

    if (!symbol || decimals === undefined || !Number.isFinite(decimals)) {
      throw new Error(`Missing token metadata for ${address}`)
    }

    const discovered: TokenMetadata = {
      address: normalized,
      coingeckoId: slugifyTokenSymbol(symbol),
      decimals,
      symbol,
    }

    tokenMetadataByAddress.set(normalized, discovered)
    logInfo(
      'token',
      `Using onchain fallback metadata for ${normalized}: ${symbol} (${discovered.coingeckoId})`,
    )
    return discovered
  }
}

async function sendBatchRpc(
  rpcUrl: string,
  requests: RpcRequest[],
): Promise<Map<number, RpcResponseItem>> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requests),
    signal: AbortSignal.timeout(RPC_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown JSON parse error'
    throw new Error(`Invalid JSON response: ${message}`)
  }

  if (!Array.isArray(payload)) {
    throw new Error('Expected an array JSON-RPC batch response.')
  }

  const responses = new Map<number, RpcResponseItem>()
  for (const item of payload) {
    if (!isObject(item)) {
      throw new Error(`Invalid batch item: ${JSON.stringify(item)}`)
    }
    const id = item.id
    if (typeof id !== 'number') {
      throw new Error(`Batch item missing numeric id: ${JSON.stringify(item)}`)
    }
    responses.set(id, item as RpcResponseItem)
  }

  return responses
}

async function rpcCalls(
  rpcUrl: string,
  callSpecs: CallSpec[],
): Promise<(string | undefined)[]> {
  const batches = chunk(callSpecs, CALL_BATCH_SIZE)
  const outputs: (string | undefined)[] = []

  for (const batch of batches) {
    const requests: RpcRequest[] = batch.map((call, index) => ({
      jsonrpc: '2.0',
      id: index + 1,
      method: 'eth_call',
      params: [{ to: call.address, data: call.data }, 'latest'],
    }))

    const responses = await sendBatchRpc(rpcUrl, requests)
    for (const request of requests) {
      const item = responses.get(request.id)
      if (!item) {
        throw new Error(`Missing eth_call response for request ${request.id}`)
      }

      const spec = batch[request.id - 1]
      if (!spec) {
        throw new Error(`Missing call spec for request ${request.id}`)
      }

      if (item.error) {
        if (spec.allowFailure) {
          outputs.push(undefined)
          continue
        }
        throw new Error(
          `eth_call failed for ${spec.address}: ${JSON.stringify(item.error)}`,
        )
      }

      if (typeof item.result !== 'string') {
        if (spec.allowFailure) {
          outputs.push(undefined)
          continue
        }
        throw new Error(`eth_call returned invalid result for ${spec.address}`)
      }

      outputs.push(item.result)
    }
  }

  return outputs
}

async function fetchLogsForFilters(
  rpcUrl: string,
  filters: LogFilter[],
): Promise<RpcLog[][]> {
  if (filters.length === 0) return []

  const requests: RpcRequest[] = filters.map((filter, index) => ({
    jsonrpc: '2.0',
    id: index + 1,
    method: 'eth_getLogs',
    params: [
      {
        address:
          filter.addresses.length === 1 ? filter.addresses[0] : filter.addresses,
        topics: filter.topics,
        fromBlock: numberToHex(filter.fromBlock),
        toBlock: numberToHex(filter.toBlock),
      },
    ],
  }))

  let responses: Map<number, RpcResponseItem>
  try {
    responses = await sendBatchRpc(rpcUrl, requests)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (filters.length > 1) {
      const midpoint = Math.floor(filters.length / 2)
      const [left, right] = await Promise.all([
        fetchLogsForFilters(rpcUrl, filters.slice(0, midpoint)),
        fetchLogsForFilters(rpcUrl, filters.slice(midpoint)),
      ])
      return [...left, ...right]
    }

    const filter = filters[0]
    if (filter && filter.fromBlock < filter.toBlock) {
      const midpoint = Math.floor((filter.fromBlock + filter.toBlock) / 2)
      const [left, right] = await Promise.all([
        fetchLogsForFilters(rpcUrl, [
          { ...filter, fromBlock: filter.fromBlock, toBlock: midpoint },
        ]),
        fetchLogsForFilters(rpcUrl, [
          { ...filter, fromBlock: midpoint + 1, toBlock: filter.toBlock },
        ]),
      ])
      return [left[0]!.concat(right[0]!)]
    }

    throw new Error(`eth_getLogs failed: ${message}`)
  }

  const outputs: RpcLog[][] = []

  for (const request of requests) {
    const item = responses.get(request.id)
    const filter = filters[request.id - 1]

    if (!item || !filter) {
      throw new Error(`Missing eth_getLogs response for request ${request.id}`)
    }

    if (item.error) {
      if (isLimitExceededError(item.error) && filter.fromBlock < filter.toBlock) {
        const midpoint = Math.floor((filter.fromBlock + filter.toBlock) / 2)
        const [left, right] = await Promise.all([
          fetchLogsForFilters(rpcUrl, [
            { ...filter, fromBlock: filter.fromBlock, toBlock: midpoint },
          ]),
          fetchLogsForFilters(rpcUrl, [
            { ...filter, fromBlock: midpoint + 1, toBlock: filter.toBlock },
          ]),
        ])
        outputs.push(left[0]!.concat(right[0]!))
        continue
      }

      throw new Error(
        `eth_getLogs failed: ${JSON.stringify(item.error)} for blocks ${filter.fromBlock}-${filter.toBlock}`,
      )
    }

    if (!Array.isArray(item.result)) {
      throw new Error('eth_getLogs returned a non-array result')
    }

    outputs.push(item.result as RpcLog[])
  }

  return outputs
}

function formatUnits(value: bigint, decimals: number): string {
  return utils.formatUnits(value, decimals).replace(/\.?0+$/, '')
}

function getTornadoPools() {
  const discovery = new ProjectDiscovery('tornado-cash')
  return discovery
    .getContractValue<string[]>('InstanceRegistry', 'getAllInstanceAddresses')
    .map((address) => {
      const contract = discovery.getContract(address)
      return {
        address: ChainSpecificAddress.address(contract.address).toString(),
        sinceBlock: contract.sinceBlock ?? 0,
      }
    })
}

async function loadTornadoPoolMetadata(
  rpcUrl: string,
): Promise<Map<string, TornadoPoolMetadata>> {
  const pools = getTornadoPools()
  const denominationCall = tornadoInterface.encodeFunctionData('denomination')
  const tokenCall = tornadoInterface.encodeFunctionData('token')

  const callSpecs: CallSpec[] = []
  for (const pool of pools) {
    callSpecs.push({ address: pool.address, data: denominationCall })
    callSpecs.push({ address: pool.address, data: tokenCall, allowFailure: true })
  }

  const results = await rpcCalls(rpcUrl, callSpecs)
  const metadata = new Map<string, TornadoPoolMetadata>()

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i]
    if (!pool) continue

    const denominationResult = results[i * 2]
    const tokenResult = results[i * 2 + 1]

    if (!denominationResult) {
      throw new Error(`Missing denomination() result for Tornado pool ${pool.address}`)
    }

    const [denomination] = tornadoInterface.decodeFunctionResult(
      'denomination',
      denominationResult,
    )

    let tokenMetadata: TokenMetadata
    if (tokenResult) {
      try {
        const [tokenAddress] = tornadoInterface.decodeFunctionResult(
          'token',
          tokenResult,
        )
        tokenMetadata = await resolveTokenMetadata(tokenAddress, rpcUrl)
      } catch {
        tokenMetadata = await resolveTokenMetadata(PRIVACY_POOLS_NATIVE_ETH, rpcUrl)
      }
    } else {
      tokenMetadata = await resolveTokenMetadata(PRIVACY_POOLS_NATIVE_ETH, rpcUrl)
    }

    metadata.set(normalizeAddress(pool.address), {
      address: normalizeAddress(pool.address),
      sinceBlock: pool.sinceBlock,
      denomination: BigInt(denomination.toString()),
      token: tokenMetadata,
    })
  }

  return metadata
}

async function collectTornadoRows(
  rpcUrl: string,
  latestBlock: number,
): Promise<OutputRow[]> {
  const metadata = await loadTornadoPoolMetadata(rpcUrl)
  const filters = chunk([...metadata.values()], LOG_FILTER_BATCH_SIZE).map(
    (pools) => ({
      addresses: pools.map((pool) => pool.address),
      topics: [TORNADO_WITHDRAWAL_TOPIC],
      fromBlock: Math.min(...pools.map((pool) => pool.sinceBlock)),
      toBlock: latestBlock,
    }),
  )

  const results = await fetchLogsForFilters(rpcUrl, filters)
  const rows: OutputRow[] = []
  let processed = 0

  for (const logs of results) {
    for (const log of logs) {
      processed += 1
      logEventProgress('tornado-cash', processed)

      const pool = metadata.get(normalizeAddress(log.address))
      if (!pool) {
        throw new Error(`Missing metadata for Tornado pool ${log.address}`)
      }

      const parsed = tornadoInterface.parseLog(log)
      const bucket = `tornado-${pool.token.symbol}-${formatUnits(
        pool.denomination,
        pool.token.decimals,
      )}`

      rows.push({
        protocol: 'tornado-cash',
        action: 'withdrawal',
        bucket,
        address: normalizeAddress(parsed.args.to),
        amountRaw: pool.denomination.toString(),
        token: pool.token.coingeckoId,
        tokenAddress: pool.token.address,
        blockNumber: hexToNumber(log.blockNumber),
        txHash: log.transactionHash.toLowerCase(),
        logIndex: hexToNumber(log.logIndex),
        contractAddress: normalizeAddress(log.address),
      })
    }
  }

  return rows
}

async function collectRailgunRows(
  rpcUrl: string,
  latestBlock: number,
): Promise<OutputRow[]> {
  const discovery = new ProjectDiscovery('railgun')
  const railgunCore = discovery.getContract('RailgunCore')
  const filter: LogFilter = {
    addresses: [normalizeAddress(ChainSpecificAddress.address(railgunCore.address))],
    topics: [RAILGUN_UNSHIELD_TOPIC],
    fromBlock: railgunCore.sinceBlock ?? 0,
    toBlock: latestBlock,
  }
  const [logs] = await fetchLogsForFilters(rpcUrl, [filter])
  const rows: OutputRow[] = []
  let processed = 0

  for (const log of logs) {
    processed += 1
    logEventProgress('railgun', processed)

    const parsed = railgunInterface.parseLog(log)
    const tokenType = Number(parsed.args.token.tokenType)
    if (tokenType !== 0) {
      continue
    }

    const tokenAddress = normalizeAddress(parsed.args.token.tokenAddress)
    const token = await resolveTokenMetadata(tokenAddress, rpcUrl)
    rows.push({
      protocol: 'railgun',
      action: 'withdrawal',
      bucket: `railgun-${token.symbol}`,
      address: normalizeAddress(parsed.args.to),
      amountRaw: parsed.args.amount.toString(),
      token: token.coingeckoId,
      tokenAddress: token.address,
      blockNumber: hexToNumber(log.blockNumber),
      txHash: log.transactionHash.toLowerCase(),
      logIndex: hexToNumber(log.logIndex),
      contractAddress: normalizeAddress(log.address),
    })
  }

  return rows
}

function getPrivacyPools() {
  const discovery = new ProjectDiscovery('privacy-pools')
  const pools = discovery.getContractValue<
    Record<string, { _pool: string; _scope: string }[]>
  >('Entrypoint', 'pools')

  return Object.keys(pools).map((address) => {
    const contract = discovery.getContract(address)
    return {
      address: ChainSpecificAddress.address(contract.address).toString(),
      sinceBlock: contract.sinceBlock ?? 0,
    }
  })
}

async function loadPrivacyPoolMetadata(
  rpcUrl: string,
): Promise<Map<string, PrivacyPoolMetadata>> {
  const pools = getPrivacyPools()
  const assetCall = privacyPoolsInterface.encodeFunctionData('ASSET')
  const results = await rpcCalls(
    rpcUrl,
    pools.map((pool) => ({ address: pool.address, data: assetCall })),
  )

  const metadata = new Map<string, PrivacyPoolMetadata>()

  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i]
    const result = results[i]
    if (!pool || !result) {
      throw new Error(`Missing ASSET() result for Privacy Pool at index ${i}`)
    }

    const [assetAddress] = privacyPoolsInterface.decodeFunctionResult(
      'ASSET',
      result,
    )

    metadata.set(normalizeAddress(pool.address), {
      address: normalizeAddress(pool.address),
      sinceBlock: pool.sinceBlock,
      token: await resolveTokenMetadata(assetAddress, rpcUrl),
    })
  }

  return metadata
}

async function collectPrivacyPoolsRows(
  rpcUrl: string,
  latestBlock: number,
): Promise<OutputRow[]> {
  const metadata = await loadPrivacyPoolMetadata(rpcUrl)
  const filters = chunk([...metadata.values()], LOG_FILTER_BATCH_SIZE).map(
    (pools) => ({
      addresses: pools.map((pool) => pool.address),
      topics: [
        [
          PRIVACY_POOLS_DEPOSITED_TOPIC,
          PRIVACY_POOLS_RAGEQUIT_TOPIC,
          PRIVACY_POOLS_WITHDRAWN_TOPIC,
        ],
      ],
      fromBlock: Math.min(...pools.map((pool) => pool.sinceBlock)),
      toBlock: latestBlock,
    }),
  )

  const results = await fetchLogsForFilters(rpcUrl, filters)
  const rows: OutputRow[] = []
  let processed = 0

  for (const logs of results) {
    for (const log of logs) {
      processed += 1
      logEventProgress('privacy-pools', processed)

      const pool = metadata.get(normalizeAddress(log.address))
      if (!pool) {
        throw new Error(`Missing metadata for Privacy Pool ${log.address}`)
      }

      const parsed = privacyPoolsInterface.parseLog(log)
      const eventName = parsed.name
      const action = eventName === 'Deposited' ? 'deposit' : 'withdrawal'

      const address =
        eventName === 'Deposited'
          ? parsed.args._depositor
          : eventName === 'Ragequit'
            ? parsed.args._ragequitter
            : parsed.args._processooor

      rows.push({
        protocol: 'privacy-pools',
        action,
        bucket: `privacy-pools-${pool.token.symbol}-${pool.address}`,
        address: normalizeAddress(address),
        amountRaw: parsed.args._value.toString(),
        token: pool.token.coingeckoId,
        tokenAddress: pool.token.address,
        blockNumber: hexToNumber(log.blockNumber),
        txHash: log.transactionHash.toLowerCase(),
        logIndex: hexToNumber(log.logIndex),
        contractAddress: normalizeAddress(log.address),
      })
    }
  }

  return rows
}

async function getLatestBlockNumber(rpcUrl: string): Promise<number> {
  const responses = await sendBatchRpc(rpcUrl, [
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber',
      params: [],
    },
  ])

  const item = responses.get(1)
  if (!item || typeof item.result !== 'string') {
    throw new Error('Failed to fetch latest Ethereum block number')
  }
  return hexToNumber(item.result)
}

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

function toCsvLine(row: OutputRow): string {
  return [
    row.protocol,
    row.action,
    row.bucket,
    row.address,
    row.amountRaw,
    row.token,
    row.tokenAddress,
    String(row.blockNumber),
    row.txHash,
    String(row.logIndex),
    row.contractAddress,
  ]
    .map(csvEscape)
    .join(',')
}

async function writeCsv(fileName: string, rows: OutputRow[]) {
  const finalPath = join(DATA_DIR, fileName)
  const tempPath = `${finalPath}.tmp`
  const writer = createWriteStream(tempPath, { encoding: 'utf8' })

  if (INCLUDE_HEADER) {
    writer.write(`${HEADER.join(',')}\n`)
  }

  for (const row of rows) {
    writer.write(`${toCsvLine(row)}\n`)
  }

  writer.end()
  await finished(writer)
  await rename(tempPath, finalPath)
}

function compareRows(a: OutputRow, b: OutputRow): number {
  return (
    a.blockNumber - b.blockNumber ||
    a.txHash.localeCompare(b.txHash) ||
    a.logIndex - b.logIndex
  )
}

async function main() {
  if (process.argv.includes('--help')) {
    showHelp()
    return
  }

  const rpcUrl = getRpcUrl()
  logInfo('start', 'Fetching privacy flow analysis events.')
  const latestBlock = await getLatestBlockNumber(rpcUrl)

  const [tornadoRows, railgunRows, privacyPoolsRows] = await Promise.all([
    collectTornadoRows(rpcUrl, latestBlock),
    collectRailgunRows(rpcUrl, latestBlock),
    collectPrivacyPoolsRows(rpcUrl, latestBlock),
  ])

  tornadoRows.sort(compareRows)
  railgunRows.sort(compareRows)
  privacyPoolsRows.sort(compareRows)

  await Promise.all([
    writeCsv(TORNADO_OUTPUT, tornadoRows),
    writeCsv(RAILGUN_OUTPUT, railgunRows),
    writeCsv(PRIVACY_POOLS_OUTPUT, privacyPoolsRows),
  ])

  logInfo(
    'done',
    `Wrote ${tornadoRows.length} Tornado rows, ${railgunRows.length} Railgun rows, and ${privacyPoolsRows.length} Privacy Pools rows.`,
  )
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error)
  logInfo('fatal', message)
  process.exitCode = 1
})
