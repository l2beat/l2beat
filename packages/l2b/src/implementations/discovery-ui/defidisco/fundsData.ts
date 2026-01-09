import type { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
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

export function getFundsData(
  paths: DiscoveryPaths,
  project: string,
): ApiFundsDataResponse {
  const fundsPath = getFundsDataPath(paths, project)

  if (fs.existsSync(fundsPath)) {
    try {
      const fileContent = fs.readFileSync(fundsPath, 'utf8')
      const data = JSON.parse(fileContent) as ApiFundsDataResponse
      return data
    } catch (error) {
      console.error('Error parsing funds data file:', error)
    }
  }

  return {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts: {},
  }
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

export function getContractsToFetch(
  paths: DiscoveryPaths,
  project: string,
): { address: string; fetchBalances: boolean; fetchPositions: boolean }[] {
  const tags = getContractTags(paths, project)

  return tags.tags
    .filter((tag) => tag.fetchBalances || tag.fetchPositions)
    .map((tag) => ({
      address: tag.contractAddress,
      fetchBalances: tag.fetchBalances ?? false,
      fetchPositions: tag.fetchPositions ?? false,
    }))
}

interface FetchOptions {
  fetchBalances?: boolean
  fetchPositions?: boolean
  forceRefresh?: boolean
}

export interface FetchResult {
  data: ContractFundsData
  balancesCached: boolean
  positionsCached: boolean
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

  // Normalize address - remove eth: prefix for API calls
  const cleanAddress = contractAddress.replace(/^eth:/i, '')
  const forceRefreshParam = options.forceRefresh ? '&force_refresh=true' : ''

  try {
    if (options.fetchBalances) {
      const balancesUrl = `${DEFISCAN_ENDPOINTS_URL}/balances?contract_address=${cleanAddress}&chain_id=eth${forceRefreshParam}`
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
      const positionsUrl = `${DEFISCAN_ENDPOINTS_URL}/positions?address=${cleanAddress}&chain_id=eth${forceRefreshParam}`
      const positionsResponse = await fetch(positionsUrl)

      // Get cached status from header
      positionsCached = positionsResponse.headers.get('X-Cached') === 'true'

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
        source: 'debank',
      }
    }
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error fetching funds for ${contractAddress}:`, error)
  }

  return { data: result, balancesCached, positionsCached }
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

  const contracts = { ...existingData.contracts }
  let fetchedFromApi = 0
  let returnedFromCache = 0

  for (let i = 0; i < contractsToFetch.length; i++) {
    const contract = contractsToFetch[i]

    onProgress?.(
      `[${i + 1}/${contractsToFetch.length}] Requesting ${contract.address}...`,
    )

    const fetchResult = await fetchFundsForContract(contract.address, {
      fetchBalances: contract.fetchBalances,
      fetchPositions: contract.fetchPositions,
      forceRefresh,
    })

    // Only update if we got valid data, preserve existing data on error
    if (!fetchResult.data.error) {
      contracts[contract.address] = fetchResult.data
    } else {
      // Preserve existing data but update the error field and timestamp
      const existingData = contracts[contract.address]
      if (existingData && (existingData.balances || existingData.positions)) {
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
      const balanceValue = fetchResult.data.balances?.totalUsdValue ?? 0
      const positionsValue = fetchResult.data.positions?.totalUsdValue ?? 0
      onProgress?.(
        `  Balances: ${balancesStatus} ($${balanceValue.toLocaleString()}), Positions: ${positionsStatus} ($${positionsValue.toLocaleString()})`,
      )
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
  const tag = tags.tags.find(
    (t) => t.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
  )

  if (!tag || (!tag.fetchBalances && !tag.fetchPositions)) {
    onProgress?.(`Contract ${contractAddress} is not marked for funds fetching`)
    return getFundsData(paths, project)
  }

  onProgress?.(
    `Requesting ${contractAddress}${forceRefresh ? ' (force refresh)' : ''}...`,
  )

  const fetchResult = await fetchFundsForContract(contractAddress, {
    fetchBalances: tag.fetchBalances,
    fetchPositions: tag.fetchPositions,
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
    (existingContractData.balances || existingContractData.positions)
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

  // Log cache status
  const balancesStatus = tag.fetchBalances
    ? fetchResult.balancesCached
      ? 'CACHED'
      : 'FETCHED'
    : 'N/A'
  const positionsStatus = tag.fetchPositions
    ? fetchResult.positionsCached
      ? 'CACHED'
      : 'FETCHED'
    : 'N/A'

  if (fetchResult.data.error) {
    onProgress?.(`ERROR: ${fetchResult.data.error}`)
  } else {
    const balanceValue = fetchResult.data.balances?.totalUsdValue ?? 0
    const positionsValue = fetchResult.data.positions?.totalUsdValue ?? 0
    onProgress?.(
      `Balances: ${balancesStatus} ($${balanceValue.toLocaleString()}), Positions: ${positionsStatus} ($${positionsValue.toLocaleString()})`,
    )
  }

  onProgress?.('Funds data saved successfully')

  return result
}
