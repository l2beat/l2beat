import { DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import type {
  ApiFundsDataResponse,
  ContractFundsData,
  FundsTokenBalance,
  FundsPositionProtocol,
  FundsPositionItem,
  FundsPositionToken,
} from './types'
import { getContractTags } from './contractTags'

const DEFISCAN_ENDPOINTS_URL = process.env.DEFISCAN_ENDPOINTS_URL || 'http://localhost:3001'

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
    .filter(tag => tag.fetchBalances || tag.fetchPositions)
    .map(tag => ({
      address: tag.contractAddress,
      fetchBalances: tag.fetchBalances ?? false,
      fetchPositions: tag.fetchPositions ?? false,
    }))
}

interface FetchOptions {
  fetchBalances?: boolean
  fetchPositions?: boolean
}

export async function fetchFundsForContract(
  contractAddress: string,
  options: FetchOptions,
): Promise<ContractFundsData> {
  const result: ContractFundsData = {
    lastFetched: new Date().toISOString(),
  }

  // Normalize address - remove eth: prefix for API calls
  const cleanAddress = contractAddress.replace(/^eth:/i, '')

  try {
    if (options.fetchBalances) {
      const balancesUrl = `${DEFISCAN_ENDPOINTS_URL}/balances?contract_address=${cleanAddress}&chain_id=eth`
      const balancesResponse = await fetch(balancesUrl)

      if (!balancesResponse.ok) {
        throw new Error(`Balances API returned ${balancesResponse.status}: ${balancesResponse.statusText}`)
      }

      const balancesData = await balancesResponse.json() as {
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
      }

      result.balances = {
        tokens: balancesData.balances.map((b): FundsTokenBalance => ({
          assetAddress: b.asset_address,
          symbol: b.symbol,
          name: b.name,
          balance: b.balance,
          decimals: b.decimals,
          usdValue: b.usd_value,
        })),
        totalUsdValue: balancesData.total_usd_value,
        timestamp: balancesData.timestamp,
        source: balancesData.source,
      }
    }

    if (options.fetchPositions) {
      const positionsUrl = `${DEFISCAN_ENDPOINTS_URL}/positions?address=${cleanAddress}&chain_id=eth`
      const positionsResponse = await fetch(positionsUrl)

      if (!positionsResponse.ok) {
        throw new Error(`Positions API returned ${positionsResponse.status}: ${positionsResponse.statusText}`)
      }

      const positionsData = await positionsResponse.json() as Array<{
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
        const items: FundsPositionItem[] = p.portfolio_item_list.map((item) => ({
          name: item.name,
          stats: {
            assetUsdValue: item.stats.asset_usd_value,
            debtUsdValue: item.stats.debt_usd_value,
            netUsdValue: item.stats.net_usd_value,
          },
          tokens: item.asset_token_list.map((t): FundsPositionToken => ({
            symbol: t.symbol,
            name: t.name,
            amount: t.amount,
            price: t.price,
          })),
        }))

        const protocolTotalUsd = items.reduce((sum, item) => sum + item.stats.netUsdValue, 0)

        return {
          id: p.id,
          name: p.name,
          chain: p.chain,
          logoUrl: p.logo_url,
          items,
          totalUsdValue: protocolTotalUsd,
        }
      })

      const totalPositionsUsd = protocols.reduce((sum, p) => sum + p.totalUsdValue, 0)

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

  return result
}

export async function fetchAllFundsForProject(
  paths: DiscoveryPaths,
  project: string,
  onProgress?: (message: string) => void,
): Promise<ApiFundsDataResponse> {
  const contractsToFetch = getContractsToFetch(paths, project)
  const existingData = getFundsData(paths, project)

  if (contractsToFetch.length === 0) {
    onProgress?.('No contracts marked for funds fetching')
    return existingData
  }

  onProgress?.(`Found ${contractsToFetch.length} contracts to fetch funds for`)

  const contracts = { ...existingData.contracts }

  for (let i = 0; i < contractsToFetch.length; i++) {
    const contract = contractsToFetch[i]
    onProgress?.(`[${i + 1}/${contractsToFetch.length}] Fetching funds for ${contract.address}...`)

    const fundsData = await fetchFundsForContract(contract.address, {
      fetchBalances: contract.fetchBalances,
      fetchPositions: contract.fetchPositions,
    })

    contracts[contract.address] = fundsData

    if (fundsData.error) {
      onProgress?.(`  Error: ${fundsData.error}`)
    } else {
      const balanceValue = fundsData.balances?.totalUsdValue ?? 0
      const positionsValue = fundsData.positions?.totalUsdValue ?? 0
      onProgress?.(`  Balances: $${balanceValue.toLocaleString()}, Positions: $${positionsValue.toLocaleString()}`)
    }
  }

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
): Promise<ApiFundsDataResponse> {
  const tags = getContractTags(paths, project)
  const tag = tags.tags.find(t =>
    t.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  )

  if (!tag || (!tag.fetchBalances && !tag.fetchPositions)) {
    onProgress?.(`Contract ${contractAddress} is not marked for funds fetching`)
    return getFundsData(paths, project)
  }

  onProgress?.(`Fetching funds for ${contractAddress}...`)

  const fundsData = await fetchFundsForContract(contractAddress, {
    fetchBalances: tag.fetchBalances,
    fetchPositions: tag.fetchPositions,
  })

  const existingData = getFundsData(paths, project)
  const contracts = {
    ...existingData.contracts,
    [contractAddress]: fundsData,
  }

  const result: ApiFundsDataResponse = {
    version: '1.0',
    lastModified: new Date().toISOString(),
    contracts,
  }

  saveFundsData(paths, project, result)

  if (fundsData.error) {
    onProgress?.(`Error: ${fundsData.error}`)
  } else {
    const balanceValue = fundsData.balances?.totalUsdValue ?? 0
    const positionsValue = fundsData.positions?.totalUsdValue ?? 0
    onProgress?.(`Balances: $${balanceValue.toLocaleString()}, Positions: $${positionsValue.toLocaleString()}`)
  }

  onProgress?.('Funds data saved successfully')

  return result
}
