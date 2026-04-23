import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import {
  addressesEqual,
  buildImplementationToProxyMap,
  normalizeChainAddress,
  stripChainPrefix,
} from './addressUtils'
import { getContractTags } from './contractTags'
import type {
  ApiFundsDataResponse,
  ContractFundsData,
  FundsPositionItem,
  FundsPositionProtocol,
  FundsPositionToken,
  FundsTokenBalance,
} from './types'

const DEFISCAN_ENDPOINTS_URL =
  process.env.DEFISCAN_ENDPOINTS_URL || 'http://localhost:3001'

// Map discovery chain prefixes to DeBank chain IDs
// DeBank docs: https://docs.open.debank.com/en/reference/api-pro-reference/chain#get-supported-chain-list
const DISCOVERY_TO_DEBANK_CHAIN: Record<string, string> = {
  eth: 'eth',
  base: 'base',
  arb1: 'arb',
  oeth: 'op',
  polygon: 'matic',
  gnosis: 'xdai',
  avax: 'avax',
  linea: 'linea',
  blast: 'blast',
  scroll: 'scrl',
  zksync: 'era',
  // Add more as needed
}

/** Extract DeBank chain ID from a chain-prefixed address like "base:0x..." */
function getDebankChainId(chainPrefixedAddress: string): string {
  const prefix = chainPrefixedAddress.split(':')[0] || 'eth'
  return DISCOVERY_TO_DEBANK_CHAIN[prefix] || prefix
}

export interface TokenInfo {
  id: string
  chain: string
  name: string
  symbol: string
  decimals: number
  price: number
}

export async function fetchTokenInfo(
  chainId: string,
  tokenId: string,
): Promise<TokenInfo> {
  const params = new URLSearchParams({
    chain_id: chainId,
    id: tokenId.toLowerCase(),
  })
  const url = `${DEFISCAN_ENDPOINTS_URL}/token?${params}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Token API returned ${response.status}: ${response.statusText}`,
    )
  }

  return (await response.json()) as TokenInfo
}

export function getFundsData(
  paths: DiscoveryPaths,
  project: string,
): ApiFundsDataResponse {
  const fundsPath = getFundsDataPath(paths, project)

  let data: ApiFundsDataResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: {},
  }

  if (fs.existsSync(fundsPath)) {
    try {
      const fileContent = fs.readFileSync(fundsPath, 'utf8')
      data = JSON.parse(fileContent) as ApiFundsDataResponse
    } catch (error) {
      console.error('Error parsing funds data file:', error)
    }
  }

  // Enrich with implementation address entries (in-memory only, not persisted).
  // Implementation contracts execute via delegatecall in the proxy's context,
  // so they should inherit the proxy's funds for impact calculations.
  return enrichFundsWithImplementations(data, paths, project)
}

export function saveFundsData(
  paths: DiscoveryPaths,
  project: string,
  data: ApiFundsDataResponse,
): void {
  const fundsPath = getFundsDataPath(paths, project)

  // Ensure directory exists
  const dir = path.dirname(fundsPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const updatedData = {
    ...data,
    lastModified: new Date().toISOString(),
  }

  fs.writeFileSync(fundsPath, JSON.stringify(updatedData, null, 2))
}

function getFundsDataPath(paths: DiscoveryPaths, project: string): string {
  return path.join(paths.discovery, project, 'funds-data.json')
}

/**
 * Add funds entries for implementation addresses that point to their proxy's funds.
 * This ensures that impact calculations for functions on implementation contracts
 * correctly reflect the proxy's funds (since they share context via delegatecall).
 */
function enrichFundsWithImplementations(
  data: ApiFundsDataResponse,
  paths: DiscoveryPaths,
  project: string,
): ApiFundsDataResponse {
  const discoveredPath = path.join(paths.discovery, project, 'discovered.json')
  if (!fs.existsSync(discoveredPath)) return data

  let discovered: any
  try {
    discovered = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'))
  } catch {
    return data
  }

  const implToProxy = buildImplementationToProxyMap(discovered)
  if (implToProxy.size === 0) return data

  // Build normalized lookup for existing funds entries
  const normalizedFunds = new Map<string, ContractFundsData>()
  for (const [addr, funds] of Object.entries(data.contracts)) {
    normalizedFunds.set(normalizeChainAddress(addr), funds)
  }

  const enrichedContracts = { ...data.contracts }
  let added = 0

  for (const [implAddr, proxyAddr] of implToProxy) {
    // Skip if implementation already has its own entry
    if (normalizedFunds.has(implAddr)) continue

    // Find the proxy's funds data
    const proxyFunds = normalizedFunds.get(proxyAddr)
    if (!proxyFunds) continue

    // Add an entry for the implementation address referencing the proxy's funds
    enrichedContracts[implAddr] = { ...proxyFunds, proxyAddress: proxyAddr }
    added++
  }

  if (added === 0) return data

  return { ...data, contracts: enrichedContracts }
}

export function getContractsToFetch(
  paths: DiscoveryPaths,
  project: string,
): {
  address: string
  fetchBalances: boolean
  fetchPositions: boolean
  isToken: boolean
  fetchAggregate: boolean
  aggregateHandler?: string
}[] {
  const tags = getContractTags(paths, project)

  return tags.tags
    .filter(
      (tag) =>
        tag.fetchBalances ||
        tag.fetchPositions ||
        tag.isToken ||
        tag.fetchAggregate,
    )
    .map((tag) => ({
      address: tag.contractAddress,
      fetchBalances: tag.fetchBalances ?? false,
      fetchPositions: tag.fetchPositions ?? false,
      isToken: tag.isToken ?? false,
      fetchAggregate: tag.fetchAggregate ?? false,
      aggregateHandler: tag.aggregateHandler,
    }))
}

interface FetchOptions {
  fetchBalances?: boolean
  fetchPositions?: boolean
  isToken?: boolean
  fetchAggregate?: boolean
  aggregateHandler?: string
  discoveredData?: any
  forceRefresh?: boolean
}

export interface FetchResult {
  data: ContractFundsData
  balancesCached: boolean
  positionsCached: boolean
  tokenFetched: boolean
  aggregateFetched: boolean
}

export async function fetchFundsForContract(
  contractAddress: string,
  options: FetchOptions,
): Promise<FetchResult> {
  const result: ContractFundsData = {
    lastFetched: new Date().toISOString(),
  }

  let balancesCached = false
  let positionsCached = false
  let tokenFetched = false
  let aggregateFetched = false

  // Normalize address - extract chain and remove prefix for API calls
  const cleanAddress = stripChainPrefix(contractAddress)
  const debankChain = getDebankChainId(contractAddress)
  const forceRefreshParam = options.forceRefresh ? '&force_refresh=true' : ''

  try {
    if (options.fetchBalances) {
      const balancesUrl = `${DEFISCAN_ENDPOINTS_URL}/balances?contract_address=${cleanAddress}&chain_id=${debankChain}${forceRefreshParam}`
      const balancesResponse = await fetch(balancesUrl)

      if (!balancesResponse.ok) {
        throw new Error(
          `Balances API returned ${balancesResponse.status}: ${balancesResponse.statusText}`,
        )
      }

      const balancesData = (await balancesResponse.json()) as {
        contract_address: string
        balances: Array<{
          asset_address: string
          balance: string
          decimals: number
          symbol: string
          name: string
          usd_value: number
        }>
        total_usd_value: number
        timestamp: string
        source: string
        cached: boolean
      }

      balancesCached = balancesData.cached

      result.balances = {
        tokens: balancesData.balances.map(
          (b): FundsTokenBalance => ({
            assetAddress: b.asset_address,
            symbol: b.symbol,
            name: b.name,
            balance: b.balance,
            decimals: b.decimals,
            usdValue: b.usd_value,
          }),
        ),
        totalUsdValue: balancesData.total_usd_value,
        timestamp: balancesData.timestamp,
        source: balancesData.source,
      }
    }

    if (options.fetchPositions) {
      const positionsUrl = `${DEFISCAN_ENDPOINTS_URL}/positions?address=${cleanAddress}&chain_id=${debankChain}${forceRefreshParam}`
      const positionsResponse = await fetch(positionsUrl)

      // Get cached status and source from headers
      positionsCached = positionsResponse.headers.get('X-Cached') === 'true'
      const positionsSource =
        positionsResponse.headers.get('X-Source') ?? 'debank'

      if (!positionsResponse.ok) {
        throw new Error(
          `Positions API returned ${positionsResponse.status}: ${positionsResponse.statusText}`,
        )
      }

      const positionsData = (await positionsResponse.json()) as Array<{
        id: string
        chain: string
        name: string
        logo_url?: string
        portfolio_item_list: Array<{
          name?: string
          stats: {
            asset_usd_value: number
            debt_usd_value: number
            net_usd_value: number
          }
          asset_token_list: Array<{
            symbol: string
            name: string
            amount: number
            price: number
          }>
        }>
      }>

      const protocols: FundsPositionProtocol[] = positionsData.map((p) => {
        const items: FundsPositionItem[] = p.portfolio_item_list.map(
          (item) => ({
            name: item.name,
            stats: {
              assetUsdValue: item.stats.asset_usd_value,
              debtUsdValue: item.stats.debt_usd_value,
              netUsdValue: item.stats.net_usd_value,
            },
            tokens: item.asset_token_list.map(
              (t): FundsPositionToken => ({
                symbol: t.symbol,
                name: t.name,
                amount: t.amount,
                price: t.price,
              }),
            ),
          }),
        )

        const protocolTotalUsd = items.reduce(
          (sum, item) => sum + item.stats.netUsdValue,
          0,
        )

        return {
          id: p.id,
          name: p.name,
          chain: p.chain,
          logoUrl: p.logo_url,
          items,
          totalUsdValue: protocolTotalUsd,
        }
      })

      const totalPositionsUsd = protocols.reduce(
        (sum, p) => sum + p.totalUsdValue,
        0,
      )

      result.positions = {
        protocols,
        totalUsdValue: totalPositionsUsd,
        timestamp: new Date().toISOString(),
        source: positionsSource,
      }
    }

    if (options.isToken) {
      const tokenData = await fetchTokenInfo(debankChain, cleanAddress)

      // Look up totalSupply and decimals from discovered.json
      let totalSupply: string | undefined
      let decimals: number | undefined

      if (options.discoveredData?.entries) {
        const contract = options.discoveredData.entries.find(
          (c: any) => c.address && addressesEqual(c.address, contractAddress),
        )
        if (contract?.values) {
          if (contract.values.totalSupply != null)
            totalSupply = String(contract.values.totalSupply)
          if (contract.values.decimals != null)
            decimals = Number(contract.values.decimals)
        }
      }

      let tokenValue = 0
      if (totalSupply !== undefined && decimals !== undefined) {
        // Safe BigInt computation for large totalSupply values
        const raw = BigInt(totalSupply)
        const divisor = BigInt(10) ** BigInt(decimals)
        // Convert to float: integer part + fractional remainder
        const integerPart = Number(raw / divisor)
        const remainder = Number(raw % divisor) / Number(divisor)
        tokenValue = (integerPart + remainder) * tokenData.price
      }

      result.tokenInfo = {
        symbol: tokenData.symbol,
        name: tokenData.name,
        decimals: tokenData.decimals,
        price: tokenData.price,
        totalSupply: totalSupply ?? '0',
        tokenValue,
        timestamp: new Date().toISOString(),
        source: 'debank',
      }
      tokenFetched = true
    }

    if (options.fetchAggregate) {
      if (!options.aggregateHandler) {
        console.warn(
          `Contract ${contractAddress} has fetchAggregate=true but no aggregateHandler specified — skipping aggregate fetch`,
        )
      } else {
        try {
          const aggregateUrl = `${DEFISCAN_ENDPOINTS_URL}/aggregate?contract_address=${cleanAddress}&chain_id=${debankChain}&handler=${options.aggregateHandler}${forceRefreshParam}`
          const aggregateResponse = await fetch(aggregateUrl)

          if (aggregateResponse.ok) {
            const aggregateData = (await aggregateResponse.json()) as {
              total_usd_value?: number
              contract_count?: number
              breakdown?: Array<{
                address: string
                name?: string
                usd_value: number
              }>
              source?: string
            }

            result.aggregate = {
              totalUsdValue: aggregateData.total_usd_value ?? 0,
              contractCount: aggregateData.contract_count ?? 0,
              handlerName: options.aggregateHandler,
              breakdown: aggregateData.breakdown?.map((b) => ({
                address: b.address,
                name: b.name,
                usdValue: b.usd_value,
              })),
              timestamp: new Date().toISOString(),
              source: aggregateData.source ?? options.aggregateHandler,
            }
            aggregateFetched = true
          } else {
            console.warn(
              `Aggregate API returned ${aggregateResponse.status} for ${contractAddress} (handler: ${options.aggregateHandler})`,
            )
          }
        } catch (aggregateError) {
          console.warn(
            `Aggregate fetch failed for ${contractAddress}:`,
            aggregateError,
          )
        }
      }
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error fetching funds for ${contractAddress}:`, error)
  }

  return {
    data: result,
    balancesCached,
    positionsCached,
    tokenFetched,
    aggregateFetched,
  }
}

export async function fetchAllFundsForProject(
  paths: DiscoveryPaths,
  project: string,
  onProgress?: (message: string) => void,
  forceRefresh = false,
): Promise<ApiFundsDataResponse> {
  const contractsToFetch = getContractsToFetch(paths, project)
  const existingData = getFundsData(paths, project)

  if (contractsToFetch.length === 0) {
    onProgress?.('No contracts marked for funds fetching')
    return existingData
  }

  onProgress?.(
    `Found ${contractsToFetch.length} contracts to fetch funds for${forceRefresh ? ' (force refresh)' : ''}`,
  )

  // Load discovered data once for token totalSupply lookups
  const hasTokenContracts = contractsToFetch.some((c) => c.isToken)
  let discoveredData: any = undefined
  if (hasTokenContracts) {
    const discoveredPath = path.join(
      paths.discovery,
      project,
      'discovered.json',
    )
    if (fs.existsSync(discoveredPath)) {
      try {
        discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'))
      } catch (error) {
        console.error('Error loading discovered.json for token data:', error)
      }
    }
  }

  const contracts = { ...existingData.contracts }
  let fetchedFromApi = 0
  let returnedFromCache = 0

  for (let i = 0; i < contractsToFetch.length; i++) {
    const contract = contractsToFetch[i]

    onProgress?.(
      `[${i + 1}/${contractsToFetch.length}] Requesting ${contract.address}${contract.isToken ? ' (token)' : ''}${contract.fetchAggregate ? ' (aggregate)' : ''}...`,
    )

    const fetchResult = await fetchFundsForContract(contract.address, {
      fetchBalances: contract.fetchBalances,
      fetchPositions: contract.fetchPositions,
      isToken: contract.isToken,
      fetchAggregate: contract.fetchAggregate,
      aggregateHandler: contract.aggregateHandler,
      discoveredData,
      forceRefresh,
    })

    // Only update if we got valid data, preserve existing data on error
    if (!fetchResult.data.error) {
      contracts[contract.address] = fetchResult.data
    } else {
      // Preserve existing data but update the error field and timestamp
      const existingData = contracts[contract.address]
      if (
        existingData &&
        (existingData.balances ||
          existingData.positions ||
          existingData.tokenInfo ||
          existingData.aggregate)
      ) {
        contracts[contract.address] = {
          ...existingData,
          lastFetched: fetchResult.data.lastFetched,
          error: fetchResult.data.error,
        }
      } else {
        contracts[contract.address] = fetchResult.data
      }
    }

    // Determine cache status for logging
    const balancesStatus = contract.fetchBalances
      ? fetchResult.balancesCached
        ? 'CACHED'
        : 'FETCHED'
      : 'N/A'
    const positionsStatus = contract.fetchPositions
      ? fetchResult.positionsCached
        ? 'CACHED'
        : 'FETCHED'
      : 'N/A'

    // Count based on whether any data was actually fetched from API
    const anyFetched =
      (contract.fetchBalances && !fetchResult.balancesCached) ||
      (contract.fetchPositions && !fetchResult.positionsCached)
    if (anyFetched) {
      fetchedFromApi++
    } else {
      returnedFromCache++
    }

    if (fetchResult.data.error) {
      onProgress?.(`  ERROR: ${fetchResult.data.error}`)
    } else {
      const parts: string[] = []
      if (contract.fetchBalances) {
        const val = fetchResult.data.balances?.totalUsdValue ?? 0
        parts.push(`Balances: ${balancesStatus} ($${val.toLocaleString()})`)
      }
      if (contract.fetchPositions) {
        const val = fetchResult.data.positions?.totalUsdValue ?? 0
        parts.push(`Positions: ${positionsStatus} ($${val.toLocaleString()})`)
      }
      if (contract.isToken && fetchResult.data.tokenInfo) {
        const val = fetchResult.data.tokenInfo.tokenValue ?? 0
        parts.push(
          `Token: $${val.toLocaleString()} (${fetchResult.data.tokenInfo.symbol} @ $${fetchResult.data.tokenInfo.price})`,
        )
      }
      if (contract.fetchAggregate) {
        if (fetchResult.data.aggregate) {
          const agg = fetchResult.data.aggregate
          parts.push(
            `Aggregate: $${agg.totalUsdValue.toLocaleString()} (${agg.contractCount} contracts, ${agg.source})`,
          )
        } else {
          parts.push('Aggregate: FAILED (no data returned)')
        }
      }
      onProgress?.(`  ${parts.join(', ')}`)
    }
  }

  onProgress?.(
    `Summary: ${fetchedFromApi} fetched from API, ${returnedFromCache} returned from cache`,
  )

  const result: ApiFundsDataResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts,
  }

  saveFundsData(paths, project, result)
  onProgress?.('Funds data saved successfully')

  return result
}

export async function fetchFundsForSingleContract(
  paths: DiscoveryPaths,
  project: string,
  contractAddress: string,
  onProgress?: (message: string) => void,
  forceRefresh = false,
): Promise<ApiFundsDataResponse> {
  const tags = getContractTags(paths, project)
  const tag = tags.tags.find((t) =>
    addressesEqual(t.contractAddress, contractAddress),
  )

  if (
    !tag ||
    (!tag.fetchBalances &&
      !tag.fetchPositions &&
      !tag.isToken &&
      !tag.fetchAggregate)
  ) {
    onProgress?.(`Contract ${contractAddress} is not marked for funds fetching`)
    return getFundsData(paths, project)
  }

  // Load discovered data for token totalSupply lookups
  let discoveredData: any = undefined
  if (tag.isToken) {
    const discoveredPath = path.join(
      paths.discovery,
      project,
      'discovered.json',
    )
    if (fs.existsSync(discoveredPath)) {
      try {
        discoveredData = JSON.parse(fs.readFileSync(discoveredPath, 'utf8'))
      } catch (error) {
        console.error('Error loading discovered.json for token data:', error)
      }
    }
  }

  onProgress?.(
    `Requesting ${contractAddress}${tag.isToken ? ' (token)' : ''}${tag.fetchAggregate ? ' (aggregate)' : ''}${forceRefresh ? ' (force refresh)' : ''}...`,
  )

  const fetchResult = await fetchFundsForContract(contractAddress, {
    fetchBalances: tag.fetchBalances,
    fetchPositions: tag.fetchPositions,
    isToken: tag.isToken,
    fetchAggregate: tag.fetchAggregate,
    aggregateHandler: tag.aggregateHandler,
    discoveredData,
    forceRefresh,
  })

  const existingData = getFundsData(paths, project)
  const existingContractData = existingData.contracts[contractAddress]

  // Only update if we got valid data, preserve existing data on error
  let newContractData: ContractFundsData
  if (!fetchResult.data.error) {
    newContractData = fetchResult.data
  } else if (
    existingContractData &&
    (existingContractData.balances ||
      existingContractData.positions ||
      existingContractData.tokenInfo ||
      existingContractData.aggregate)
  ) {
    // Preserve existing data but update the error field and timestamp
    newContractData = {
      ...existingContractData,
      lastFetched: fetchResult.data.lastFetched,
      error: fetchResult.data.error,
    }
  } else {
    newContractData = fetchResult.data
  }

  const contracts = {
    ...existingData.contracts,
    [contractAddress]: newContractData,
  }

  const result: ApiFundsDataResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts,
  }

  saveFundsData(paths, project, result)

  if (fetchResult.data.error) {
    onProgress?.(`ERROR: ${fetchResult.data.error}`)
  } else {
    const parts: string[] = []
    if (tag.fetchBalances) {
      const status = fetchResult.balancesCached ? 'CACHED' : 'FETCHED'
      const val = fetchResult.data.balances?.totalUsdValue ?? 0
      parts.push(`Balances: ${status} ($${val.toLocaleString()})`)
    }
    if (tag.fetchPositions) {
      const status = fetchResult.positionsCached ? 'CACHED' : 'FETCHED'
      const val = fetchResult.data.positions?.totalUsdValue ?? 0
      parts.push(`Positions: ${status} ($${val.toLocaleString()})`)
    }
    if (tag.isToken && fetchResult.data.tokenInfo) {
      const val = fetchResult.data.tokenInfo.tokenValue ?? 0
      parts.push(
        `Token: $${val.toLocaleString()} (${fetchResult.data.tokenInfo.symbol} @ $${fetchResult.data.tokenInfo.price})`,
      )
    }
    if (tag.fetchAggregate) {
      if (fetchResult.data.aggregate) {
        const agg = fetchResult.data.aggregate
        parts.push(
          `Aggregate: $${agg.totalUsdValue.toLocaleString()} (${agg.contractCount} contracts, ${agg.source})`,
        )
      } else {
        parts.push('Aggregate: FAILED (no data returned)')
      }
    }
    onProgress?.(parts.join(', '))
  }

  onProgress?.('Funds data saved successfully')

  return result
}
