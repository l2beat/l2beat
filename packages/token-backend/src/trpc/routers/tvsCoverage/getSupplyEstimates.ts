import type { Database, TokenDatabase } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import {
  createPublicClient,
  erc20Abi,
  formatUnits,
  http,
  parseAbi,
  zeroAddress,
} from 'viem'
import type { CoinMarketData } from '../../../chains/clients/coingecko/types'
import { normalizeTokenAddress } from './model'

export const SUPPLY_ESTIMATE_LIMIT = 25

export interface SupplyEstimateRequest {
  chain: string
  address: string
}

export interface SupplyEstimate extends SupplyEstimateRequest {
  totalSupply?: string
  potentialTvsUsd?: number
  coingeckoCirculatingSupply?: number
  coingeckoUpdatedAt?: string
  vaultAsset?: VaultAsset
}

export interface VaultAsset {
  address: string
  symbol?: string
}

type ReadTotalSupply = (request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
}) => Promise<bigint | undefined>

type ReadVaultAsset = (request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
}) => Promise<VaultAsset | undefined>

type GetCoinsMarketData = (ids: string[]) => Promise<CoinMarketData[]>

interface SupplyEstimateDependencies {
  readTotalSupply?: ReadTotalSupply
  readVaultAsset?: ReadVaultAsset
  getCoinsMarketData?: GetCoinsMarketData
}

export async function getSupplyEstimates(
  db: Database,
  tokenDb: TokenDatabase,
  requests: SupplyEstimateRequest[],
  dependencies: SupplyEstimateDependencies = {},
): Promise<SupplyEstimate[]> {
  const readTotalSupply = dependencies.readTotalSupply ?? readCachedTotalSupply
  const readVaultAsset = dependencies.readVaultAsset ?? readCachedVaultAsset
  const getCoinsMarketData = dependencies.getCoinsMarketData
  const uniqueRequests = Array.from(
    new Map(
      requests.slice(0, SUPPLY_ESTIMATE_LIMIT).map((request) => {
        const normalized = {
          chain: request.chain,
          address: normalizeTokenAddress(request.address),
        }
        return [requestKey(normalized), normalized]
      }),
    ).values(),
  )

  const evmRequests = uniqueRequests.filter(
    (request): request is SupplyEstimateRequest & { address: `0x${string}` } =>
      /^0x[0-9a-f]{40}$/i.test(request.address),
  )
  const [tokens, chains] = await Promise.all([
    tokenDb.deployedToken.getByChainAndAddress(evmRequests),
    tokenDb.chain.getAll(),
  ])
  const tokensByKey = new Map(
    tokens.map((token) => [requestKey(token.deployedToken), token]),
  )
  const rpcUrlsByChain = new Map(
    chains.flatMap((chain) => {
      const rpc = chain.apis?.find((api) => api.type === 'rpc')
      return rpc ? [[chain.name, rpc.url] as const] : []
    }),
  )
  const priceRequests = evmRequests.flatMap((request, requestId) => {
    const token = tokensByKey.get(requestKey(request))
    const coingeckoId = token?.abstractToken?.coingeckoId
    return coingeckoId
      ? [{ requestId, coingeckoId, timestamp: UnixTime.now() }]
      : []
  })
  const coingeckoIds = Array.from(
    new Set(
      evmRequests.flatMap((request) => {
        const id = tokensByKey.get(requestKey(request))?.abstractToken
          ?.coingeckoId
        return id ? [id] : []
      }),
    ),
  )

  const [prices, supplies, vaultAssets, coinMarkets] = await Promise.all([
    db.interopRecentPrices.getClosestPricesAtOrBefore(
      priceRequests,
      UnixTime.DAY,
    ),
    mapConcurrent(evmRequests, 5, async (request) => {
      const token = tokensByKey.get(requestKey(request))
      const rpcUrl = rpcUrlsByChain.get(request.chain)
      if (!token || !rpcUrl) return undefined

      const raw = await readTotalSupply({ ...request, rpcUrl })
      if (raw === undefined) return undefined

      return formatUnits(raw, token.deployedToken.decimals)
    }),
    mapConcurrent(evmRequests, 10, async (request) => {
      const token = tokensByKey.get(requestKey(request))
      const rpcUrl = rpcUrlsByChain.get(request.chain)
      if (!token || !rpcUrl) return undefined

      return await readVaultAsset({ ...request, rpcUrl })
    }),
    getCoinsMarketData && coingeckoIds.length > 0
      ? getCoinsMarketData(coingeckoIds).catch(() => [])
      : Promise.resolve([]),
  ])
  const coinMarketsById = new Map(coinMarkets.map((coin) => [coin.id, coin]))

  const estimatesByKey = new Map<string, SupplyEstimate>()
  for (const [index, request] of evmRequests.entries()) {
    const token = tokensByKey.get(requestKey(request))
    const totalSupply = supplies[index]
    const priceUsd = prices.get(index)
    const coinMarket = token?.abstractToken?.coingeckoId
      ? coinMarketsById.get(token.abstractToken.coingeckoId)
      : undefined
    const supply = totalSupply === undefined ? undefined : Number(totalSupply)
    const potentialTvsUsd =
      supply !== undefined && Number.isFinite(supply) && priceUsd !== undefined
        ? supply * priceUsd
        : undefined

    estimatesByKey.set(requestKey(request), {
      ...request,
      totalSupply,
      potentialTvsUsd,
      coingeckoCirculatingSupply: coinMarket?.circulating_supply ?? undefined,
      coingeckoUpdatedAt: coinMarket?.last_updated ?? undefined,
      vaultAsset: vaultAssets[index],
    })
  }

  return uniqueRequests.map(
    (request) => estimatesByKey.get(requestKey(request)) ?? request,
  )
}

interface CachedSupply {
  value: bigint | undefined
  expiresAt: number
}

const supplyCache = new Map<string, CachedSupply>()
const inFlightSupplies = new Map<string, Promise<bigint | undefined>>()

interface CachedVaultAsset {
  value: VaultAsset | undefined
  expiresAt: number
}

const vaultAssetCache = new Map<string, CachedVaultAsset>()
const inFlightVaultAssets = new Map<string, Promise<VaultAsset | undefined>>()

async function readCachedTotalSupply(request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
}): Promise<bigint | undefined> {
  const key = requestKey(request)
  const cached = supplyCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.value

  const inFlight = inFlightSupplies.get(key)
  if (inFlight) return await inFlight

  const promise = readTotalSupply(request)
  inFlightSupplies.set(key, promise)

  try {
    const value = await promise
    supplyCache.set(key, {
      value,
      expiresAt: Date.now() + (value === undefined ? 30_000 : 5 * 60_000),
    })
    return value
  } finally {
    inFlightSupplies.delete(key)
  }
}

async function readTotalSupply(request: {
  address: `0x${string}`
  rpcUrl: string
}): Promise<bigint | undefined> {
  try {
    const client = createPublicClient({
      transport: http(request.rpcUrl, {
        retryCount: 0,
        timeout: 5_000,
      }),
    })
    return await client.readContract({
      address: request.address,
      abi: erc20Abi,
      functionName: 'totalSupply',
    })
  } catch {
    return undefined
  }
}

async function readCachedVaultAsset(request: {
  chain: string
  address: `0x${string}`
  rpcUrl: string
}): Promise<VaultAsset | undefined> {
  const key = requestKey(request)
  const cached = vaultAssetCache.get(key)
  if (cached && cached.expiresAt > Date.now()) return cached.value

  const inFlight = inFlightVaultAssets.get(key)
  if (inFlight) return await inFlight

  const promise = readVaultAsset(request)
  inFlightVaultAssets.set(key, promise)

  try {
    const value = await promise
    vaultAssetCache.set(key, {
      value,
      expiresAt: Date.now() + (value === undefined ? 30_000 : 5 * 60_000),
    })
    return value
  } finally {
    inFlightVaultAssets.delete(key)
  }
}

const erc4626ProbeAbi = parseAbi([
  'function asset() view returns (address)',
  'function totalAssets() view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
])

async function readVaultAsset(request: {
  address: `0x${string}`
  rpcUrl: string
}): Promise<VaultAsset | undefined> {
  try {
    const client = createPublicClient({
      transport: http(request.rpcUrl, {
        retryCount: 0,
        timeout: 2_500,
      }),
    })
    const asset = await client.readContract({
      address: request.address,
      abi: erc4626ProbeAbi,
      functionName: 'asset',
    })
    if (asset === zeroAddress) return undefined

    await Promise.all([
      client.readContract({
        address: request.address,
        abi: erc4626ProbeAbi,
        functionName: 'totalAssets',
      }),
      client.readContract({
        address: request.address,
        abi: erc4626ProbeAbi,
        functionName: 'convertToAssets',
        args: [1n],
      }),
    ])

    let symbol: string | undefined
    try {
      symbol = await client.readContract({
        address: asset,
        abi: erc20Abi,
        functionName: 'symbol',
      })
    } catch {
      // The asset address remains useful when metadata is unavailable.
    }

    return {
      address: normalizeTokenAddress(asset),
      symbol: symbol || undefined,
    }
  } catch {
    return undefined
  }
}

async function mapConcurrent<T, R>(
  values: T[],
  concurrency: number,
  fn: (value: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(values.length)
  let next = 0

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (next < values.length) {
        const index = next++
        results[index] = await fn(values[index])
      }
    }),
  )

  return results
}

function requestKey(request: SupplyEstimateRequest): string {
  return `${request.chain}:${normalizeTokenAddress(request.address)}`
}
