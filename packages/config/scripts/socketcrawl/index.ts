/**
 * Socket Plug Crawler
 *
 * Scans Socket Finance plugs on Ethereum to discover tokens, vaults, and TVLs.
 * Generates configuration snippets for project discovery.
 */
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { type BigNumber, ethers } from 'ethers'
import fetch from 'node-fetch'
import pLimit from 'p-limit'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'

// Load environment variables
dotenv.config()

// ===== Configuration =====
const CONFIG = {
  concurrency: {
    rpc: 5, // Max concurrent RPC calls
    coinGecko: 2, // Max concurrent CoinGecko API calls
  },
  paths: {
    outputDir: 'scripts/socketcrawl/outfiles',
    resultFile: 'socket-crawl-result.json',
    copypastaFile: 'socket-crawl-copypasta.txt',
  },
  pricing: {
    currency: 'usd',
    batchSize: 100, // CoinGecko API batch size limit
  },
  logging: {
    verbose: false, // Set to true for detailed logs
  },
}

// ===== Environment Variables =====
const ENV = {
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  coinGeckoApiKey: process.env.COINGECKO_API_KEY,
  etherscanApiKey: process.env.ETHEREUM_ETHERSCAN_API_KEY,
}

// Validate required environment variables
if (!ENV.rpcUrl) {
  throw new Error('Missing required environment variable: ETHEREUM_RPC_URL')
}

if (!ENV.coinGeckoApiKey) {
  console.warn(
    'Warning: COINGECKO_API_KEY not found in .env. USD price data will not be fetched.',
  )
}

// ===== Types =====
interface Erc20Info {
  name: string | null
  symbol: string | null
  decimals: number | null
}

interface TokenInfo extends Erc20Info {
  address: string
  tvl: number
  tvlRaw?: string
  usdPrice?: number | null
  usdValue?: number
}

interface Result {
  plugAddress: string
  hubOrBridgeAddress: string | null
  siblingChainSlug: number | 'unknown'
  token: TokenInfo | null
  owner: string | null
  ownerName?: string
  tags?: string[]
}

interface CoinGeckoPriceResponse {
  [contractAddressLowercase: string]: {
    [currencyLowercase: string]: number
  }
}

// ===== Constants =====
const ABIS = {
  PLUG: [
    'function hub__() view returns (address)',
    'function bridge__() view returns (address)',
    'function siblingChainSlug() view returns (uint32)',
    'function owner() view returns (address)',
  ],
  HUB_BRIDGE: [
    'function token__() view returns (address)',
    'function token() view returns (address)',
  ],
  ERC20: [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address account) view returns (uint256)',
  ],
}

// Chain slug to name mapping
const CHAIN_NAMES: Record<string, string> = {
  '1': 'Ethereum',
  '5': 'Goerli',
  '10': 'Optimism',
  '56': 'BNB Chain',
  '89': 'Viction testnet',
  '137': 'Polygon',
  '420': 'Optimism Goerli',
  '647': 'Stavanger testnet',
  '901': 'Lyra testnet',
  '919': 'Mode testnet',
  '957': 'Derive',
  '1024': 'Parallel',
  '1729': 'Reya Cronos Testnet',
  '2999': 'Aevo',
  '4665': 'Hook',
  '5000': 'Mantle',
  '7887': 'Kinto',
  '8453': 'Base',
  '8008': 'Polynomial',
  '34443': 'Mode',
  '42161': 'Arbitrum',
  '80001': 'Polygon Mumbai testnet',
  '81457': 'Blast',
  '421613': 'Arbitrum Goerli',
  '421614': 'Arbitrum Sepolia',
  '777777': 'Zora',
  '11155111': 'Sepolia',
  '11155112': 'Aevo testnet',
  '11155420': 'Optimism Sepolia',
  '46658378': 'Hook testnet',
  '686669576': 'SX Network Testnet',
  '28122024': 'Ancient8 testnet2',
  '1324967486': 'Reya',
  '1399904803': 'XAI Testnet',
}

// Owner address to name mapping
const OWNER_NAMES: Record<string, string> = {
  '0x246d38588b16Dd877c558b245e6D5a711C649fCF': 'LyraMultisig',
  '0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82': 'KintoMultisig',
  '0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c': 'KintoEOA',
  '0x3B88D6a4CCBD93c22c211C7f6e3ea8b1D30f81BF': 'HookOwnerEOA',
  '0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34': 'socketadmin.eth EOA',
  '0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13': 'LooksRareMultisig',
  '0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332': 'PolynomialEOA',
  '0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836': 'Socket EOA',
  '0xeeF6520437A6545b4F325F6675C4CD49812d457b': 'Socket EOA 2',
  '0x7B5Ba9Df17Bc58F504B6Cf0D87d2f05B79a36cfF': 'Socket EOA 3',
}

// ===== Logging Functions =====
function logInfo(message: string): void {
  console.log(message)
}

function logWarn(message: string): void {
  console.warn(`⚠️  ${message}`)
}

function logError(message: string, error?: unknown): void {
  const errorDetail =
    error instanceof Error ? error.message : error ? String(error) : ''

  console.error(`❌ ${message}${errorDetail ? `: ${errorDetail}` : ''}`)
}

function logDebug(message: string): void {
  if (CONFIG.logging.verbose) {
    console.log(`🔍 ${message}`)
  }
}

function logSuccess(message: string): void {
  console.log(`✅ ${message}`)
}

// ===== Utilities =====
/**
 * Makes a contract call with proper error handling
 */
async function safeContractCall<T = unknown>(
  contract: ethers.Contract,
  functionName: string,
  args: unknown[] = [],
  logContext?: string,
): Promise<T | null> {
  try {
    const result = await contract[functionName](...args)
    return result as T
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (!errorMessage.includes('call revert exception')) {
      const context = logContext ? ` (${logContext})` : ''
      logDebug(
        `Failed to call ${functionName} on ${contract.address}${context}: ${errorMessage}`,
      )
    }
    return null
  }
}

/**
 * Gets basic ERC20 token information (name, symbol, decimals)
 */
async function getERC20TokenInfo(tokenAddress: string): Promise<Erc20Info> {
  if (!ethers.utils.isAddress(tokenAddress)) {
    logWarn(`Invalid token address format: ${tokenAddress}`)
    return { name: null, symbol: null, decimals: null }
  }

  logDebug(`Fetching ERC20 info for token ${tokenAddress}`)
  const tokenContract = new ethers.Contract(tokenAddress, ABIS.ERC20, provider)

  const [nameResult, symbolResult, decimalsResult] = await Promise.allSettled([
    safeContractCall<string>(tokenContract, 'name'),
    safeContractCall<string>(tokenContract, 'symbol'),
    safeContractCall<number>(tokenContract, 'decimals'),
  ])

  const name = nameResult.status === 'fulfilled' ? nameResult.value : null
  const symbol = symbolResult.status === 'fulfilled' ? symbolResult.value : null
  const decimals =
    decimalsResult.status === 'fulfilled' ? decimalsResult.value : null

  if (name === null || symbol === null || decimals === null) {
    logDebug(
      `Incomplete ERC20 info for ${tokenAddress}. Name: ${name}, Symbol: ${symbol}, Decimals: ${decimals}`,
    )
  } else {
    logDebug(`Fetched: ${symbol} (${name}), Decimals: ${decimals}`)
  }

  return { name, symbol, decimals }
}

/**
 * Gets token balance (TVL) for a specific account
 */
async function getTokenTVL(
  tokenAddress: string,
  decimals: number | null,
  account: string,
): Promise<{ tvl: number; tvlRaw: string | undefined }> {
  if (decimals === null) {
    logDebug(`Cannot fetch TVL for ${tokenAddress} without decimals`)
    return { tvl: 0, tvlRaw: undefined }
  }

  if (
    !ethers.utils.isAddress(tokenAddress) ||
    !ethers.utils.isAddress(account)
  ) {
    logWarn(
      `Invalid address for TVL check. Token: ${tokenAddress}, Account: ${account}`,
    )
    return { tvl: 0, tvlRaw: undefined }
  }

  const tokenContract = new ethers.Contract(tokenAddress, ABIS.ERC20, provider)
  const balanceRaw = await safeContractCall<BigNumber>(
    tokenContract,
    'balanceOf',
    [account],
    `Token: ${tokenAddress}, Holder: ${account}`,
  )

  if (balanceRaw === null || balanceRaw.isZero()) {
    return { tvl: 0, tvlRaw: balanceRaw?.toString() }
  }

  try {
    const tvl = parseFloat(ethers.utils.formatUnits(balanceRaw, decimals))
    logDebug(`Balance for ${tokenAddress} at ${account}: ${tvl}`)
    return { tvl, tvlRaw: balanceRaw.toString() }
  } catch (error) {
    logError(
      `Error formatting balance for ${tokenAddress} at ${account}`,
      error,
    )
    return { tvl: 0, tvlRaw: balanceRaw.toString() }
  }
}

/**
 * Fetches token prices from CoinGecko API in batches
 */
async function fetchTokenPrices(
  tokensToFetch: Map<string, Set<string>>,
): Promise<Map<string, number>> {
  if (!ENV.coinGeckoApiKey) {
    logInfo('Skipping price fetch as CoinGecko API key is not configured')
    return new Map()
  }

  const priceMap = new Map<string, number>()
  const fetchPromises: Promise<void>[] = []
  const totalPlatforms = tokensToFetch.size

  logInfo(
    `Fetching USD prices from CoinGecko for ${totalPlatforms} platforms...`,
  )

  for (const [platformId, addressesSet] of tokensToFetch.entries()) {
    if (addressesSet.size === 0) continue
    logDebug(`Platform: ${platformId}, Tokens: ${addressesSet.size}`)

    const addresses = Array.from(addressesSet)
    const batchCount = Math.ceil(addresses.length / CONFIG.pricing.batchSize)

    for (let i = 0; i < addresses.length; i += CONFIG.pricing.batchSize) {
      const batch = addresses.slice(i, i + CONFIG.pricing.batchSize)
      const contractAddressesParam = batch.join(',')
      const url = `https://pro-api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contractAddressesParam}&vs_currencies=${CONFIG.pricing.currency}`

      const fetchJob = cgLimit(async () => {
        const batchIndex = Math.floor(i / CONFIG.pricing.batchSize) + 1
        logDebug(`Fetching batch ${batchIndex}/${batchCount} for ${platformId}`)

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': ENV.coinGeckoApiKey, // Removed non-null assertion
            },
          })

          if (!response.ok) {
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_) {
              /* ignore */
            }

            logError(
              `CoinGecko API error for ${platformId} (batch ${batchIndex}/${batchCount})`,
              `${response.status} ${response.statusText}. ${errorBody.slice(0, 100)}`,
            )
            return
          }

          const data = (await response.json()) as CoinGeckoPriceResponse

          for (const [contractAddress, priceData] of Object.entries(data)) {
            if (
              priceData &&
              typeof priceData[CONFIG.pricing.currency] === 'number'
            ) {
              const price = priceData[CONFIG.pricing.currency]
              priceMap.set(
                `${platformId}-${contractAddress.toLowerCase()}`,
                price,
              )
            }
          }
        } catch (error) {
          logError(
            `Failed to fetch CoinGecko data for ${platformId} (batch ${batchIndex})`,
            error,
          )
        }
      })

      fetchPromises.push(fetchJob)
    }
  }

  await Promise.all(fetchPromises)
  logSuccess(`Found prices for ${priceMap.size} tokens`)
  return priceMap
}

/**
 * Analyzes a plug contract and extracts relevant information
 */
async function explorePlugContract(address: string): Promise<Result | null> {
  if (!ethers.utils.isAddress(address)) {
    logWarn(`Invalid plug address: ${address}`)
    return null
  }

  logDebug(`Exploring plug contract at ${address}`)
  const plugContract = new ethers.Contract(address, ABIS.PLUG, provider)

  const [hub, bridge, siblingChainSlugRaw, owner] = await Promise.all([
    safeContractCall<string>(plugContract, 'hub__'),
    safeContractCall<string>(plugContract, 'bridge__'),
    safeContractCall<number>(plugContract, 'siblingChainSlug'),
    safeContractCall<string>(plugContract, 'owner'),
  ])

  const hubOrBridgeAddress = hub ?? bridge
  const siblingChainSlug = siblingChainSlugRaw ?? 'unknown'
  const ownerAddress = owner ?? null
  const ownerName = ownerAddress ? OWNER_NAMES[ownerAddress] : undefined

  let tokenInfo: TokenInfo | null = null

  if (hubOrBridgeAddress && ethers.utils.isAddress(hubOrBridgeAddress)) {
    const hubOrBridgeContract = new ethers.Contract(
      hubOrBridgeAddress,
      ABIS.HUB_BRIDGE,
      provider,
    )

    const tokenAddress =
      (await safeContractCall<string>(hubOrBridgeContract, 'token__')) ??
      (await safeContractCall<string>(hubOrBridgeContract, 'token'))

    if (tokenAddress && ethers.utils.isAddress(tokenAddress)) {
      logDebug(
        `Found token: ${tokenAddress} via Hub/Bridge ${hubOrBridgeAddress}`,
      )
      const erc20Info = await getERC20TokenInfo(tokenAddress)

      if (erc20Info.decimals !== null) {
        const { tvl, tvlRaw } = await getTokenTVL(
          tokenAddress,
          erc20Info.decimals,
          hubOrBridgeAddress,
        )

        tokenInfo = {
          address: tokenAddress,
          ...erc20Info,
          tvl,
          tvlRaw,
        }
      } else {
        tokenInfo = {
          address: tokenAddress,
          ...erc20Info,
          tvl: 0,
        }
        logDebug(
          `Could not calculate TVL for ${tokenAddress} (missing decimals)`,
        )
      }
    }
  }

  return {
    plugAddress: address,
    hubOrBridgeAddress,
    siblingChainSlug,
    token: tokenInfo,
    owner: ownerAddress,
    ownerName,
  }
}

/**
 * Generates configuration snippets for project discovery
 */
function generateCopyPasta(groupedResults: {
  [key: string]: Result[]
}): string[] {
  logInfo('Generating config snippets...')

  const copypastaSections: { [key: string]: string[] } = {
    initialAddresses: [],
    names: [],
    ignoreMethods: [],
    escrows: [],
  }

  const addedHubsPerProject = new Map<string, Set<string>>()
  const projectOrder = Object.keys(groupedResults)

  for (const slug of projectOrder) {
    const resultsForSlug = groupedResults[slug]
    const slugName = CHAIN_NAMES[slug] || `UnknownChain(${slug})`
    const projectInitialAddresses: string[] = []
    const projectNames: string[] = []
    const projectIgnoreMethods: string[] = []
    const projectEscrows: string[] = []
    let projectCommentAdded = false

    if (!addedHubsPerProject.has(slugName)) {
      addedHubsPerProject.set(slugName, new Set<string>())
    }

    // Get the set safely without using non-null assertion
    const currentProjectAddedHubs =
      addedHubsPerProject.get(slugName) || new Set<string>()

    resultsForSlug.forEach((result) => {
      if (result.hubOrBridgeAddress && result.token && result.token.tvl > 0) {
        if (currentProjectAddedHubs.has(result.hubOrBridgeAddress)) {
          return
        }

        if (!projectCommentAdded) {
          const projectHeader = `\n    // --- ${slugName} ---`
          projectInitialAddresses.push(projectHeader)
          projectNames.push(projectHeader)
          projectIgnoreMethods.push(projectHeader)
          projectEscrows.push(projectHeader)
          projectCommentAdded = true
        }

        const hubAddr = result.hubOrBridgeAddress
        const tokenSymbol =
          result.token.symbol ?? result.token.address.slice(0, 6)
        const tokenName = result.token.name ?? 'Unknown Token'
        const vaultName = `${tokenSymbol} Vault (${slugName})`
        const ownerNameStr =
          result.ownerName ??
          (result.owner
            ? `Unknown Owner (${result.owner.slice(0, 6)}...)`
            : 'Unknown Owner')

        projectInitialAddresses.push(`    "${hubAddr}",`)
        projectNames.push(`    "${hubAddr}": "${vaultName}",`)
        projectIgnoreMethods.push(
          `    "${vaultName}": ${JSON.stringify({ ignoreMethods: ['token', 'token__', 'hook__'] })},`,
        )
        projectEscrows.push(
          `    discovery.getEscrowDetails({
      address: EthereumAddress('${hubAddr}'),
      name: '${vaultName}',
      description: 'Socket Vault holding ${tokenName} (${tokenSymbol}) associated with ${slugName}. Owned by ${ownerNameStr}.',
      tokens: ['${tokenSymbol}'],
    }),`,
        )

        currentProjectAddedHubs.add(hubAddr)
      }
    })

    if (projectInitialAddresses.length > 1) {
      copypastaSections.initialAddresses.push(...projectInitialAddresses)
      copypastaSections.names.push(...projectNames)
      copypastaSections.ignoreMethods.push(...projectIgnoreMethods)
      copypastaSections.escrows.push(...projectEscrows)
    }
  }

  // Clean up any trailing commas before closing brackets/braces
  function cleanTrailingCommas(lines: string[]): string[] {
    return lines.map((line, index, arr) => {
      const nextLine = arr[index + 1]?.trim()

      // Remove trailing commas before closing brackets/braces
      if (
        line.trim().endsWith(',') &&
        (nextLine === '],' || nextLine === '},' || nextLine === '],') &&
        !line.trim().startsWith('// ---')
      ) {
        return line.replace(/,\s*$/, '')
      }

      return line
    })
  }

  // Assemble the final output
  const outputLines = [
    `// === config.jsonc additions ===`,
    `\n"initialAddresses": [`,
    ...copypastaSections.initialAddresses,
    `],`,

    `\n"names": {`,
    ...copypastaSections.names,
    `},`,

    `\n"ignoreMethods": {`,
    ...copypastaSections.ignoreMethods,
    `},`,

    `\n\n// === socket.ts additions (inside escrows:) ===`,
    `\nescrows: [`,
    ...copypastaSections.escrows,
    `],`,
  ]

  return cleanTrailingCommas(outputLines)
}

// ===== Initialize Providers and Limits =====
const provider = new ethers.providers.JsonRpcProvider(ENV.rpcUrl)
const limit = pLimit(CONFIG.concurrency.rpc)
const cgLimit = pLimit(CONFIG.concurrency.coinGecko)

// ===== Main Function =====
async function main(): Promise<void> {
  logInfo('Starting Socket plug exploration...')

  // Create output directory if it doesn't exist
  fs.mkdirSync(CONFIG.paths.outputDir, { recursive: true })
  const resultFilePath = path.join(
    CONFIG.paths.outputDir,
    CONFIG.paths.resultFile,
  )
  const copypastaFilePath = path.join(
    CONFIG.paths.outputDir,
    CONFIG.paths.copypastaFile,
  )

  // Get plug addresses from project discovery
  let plugs: string[] = []
  try {
    const discovery = new ProjectDiscovery('socket')
    const discoveredPlugs = discovery.getContractValue<string[]>(
      'Socket',
      'plugs',
    )

    if (
      !Array.isArray(discoveredPlugs) ||
      !discoveredPlugs.every((p) => typeof p === 'string')
    ) {
      throw new Error("Discovered 'plugs' is not an array of strings")
    }

    plugs = discoveredPlugs
    logInfo(`Found ${plugs.length} plugs via ProjectDiscovery`)
  } catch (error) {
    logError(`Failed to get plugs from ProjectDiscovery`, error)
    logError("Please ensure 'socket' project discovery is configured correctly")
    process.exit(1)
  }

  // Process all plug contracts concurrently (with rate limiting)
  logInfo('Exploring plug contracts...')
  const settledResults = await Promise.allSettled(
    plugs.map((address) => limit(() => explorePlugContract(address))),
  )

  // Filter successful results
  const successfulResults: Result[] = []
  settledResults.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value !== null) {
      successfulResults.push(result.value)
    } else if (result.status === 'rejected') {
      logError(`Exploration failed for plug ${plugs[index]}`, result.reason)
    }
  })

  logSuccess(
    `Processed ${successfulResults.length} out of ${plugs.length} plugs`,
  )

  // Collect tokens for price fetching (Ethereum platform only)
  const tokensForPriceFetch = new Map<string, Set<string>>()
  if (ENV.coinGeckoApiKey) {
    successfulResults.forEach((result) => {
      if (result.token?.address) {
        const platformId = 'ethereum'
        if (!tokensForPriceFetch.has(platformId)) {
          tokensForPriceFetch.set(platformId, new Set<string>())
        }
        tokensForPriceFetch.get(platformId)?.add(result.token.address)
      }
    })
  }

  // Fetch prices and update results with USD values
  const priceData = await fetchTokenPrices(tokensForPriceFetch)

  if (priceData.size > 0) {
    logInfo('Updating results with price data...')
    successfulResults.forEach((result) => {
      if (result.token?.address) {
        const priceKey = `ethereum-${result.token.address.toLowerCase()}`
        const price = priceData.get(priceKey)

        if (price !== undefined) {
          result.token.usdPrice = price
          result.token.usdValue = result.token.tvl * price
        } else {
          result.token.usdPrice = null
          result.token.usdValue = 0
        }
      } else if (result.token) {
        result.token.usdValue = 0
      }
    })
  } else {
    logInfo('No price data available, setting all USD values to 0')
    successfulResults.forEach((result) => {
      if (result.token) {
        result.token.usdValue = 0
      }
    })
  }

  // Group results by chain and sort by USD value
  logInfo('Grouping and sorting results...')
  const groupedResults = successfulResults.reduce<{ [key: string]: Result[] }>(
    (acc, result) => {
      const slugKey = result.siblingChainSlug.toString()
      if (!acc[slugKey]) acc[slugKey] = []
      acc[slugKey].push(result)
      return acc
    },
    {},
  )

  // Sort within each group by USD TVL (descending)
  Object.keys(groupedResults).forEach((key) => {
    groupedResults[key].sort(
      (a, b) => (b.token?.usdValue ?? 0) - (a.token?.usdValue ?? 0),
    )
  })

  // Add tags for multiplug/multiproject contracts
  const hubUsage = new Map<
    string,
    { count: number; slugs: Set<number | 'unknown'> }
  >()
  successfulResults.forEach((result) => {
    if (result.hubOrBridgeAddress) {
      const addr = result.hubOrBridgeAddress
      if (!hubUsage.has(addr)) {
        hubUsage.set(addr, { count: 0, slugs: new Set() })
      }
      // Access the map value safely
      const entry = hubUsage.get(addr) || { count: 0, slugs: new Set() }
      entry.count++
      entry.slugs.add(result.siblingChainSlug)
    }
  })

  successfulResults.forEach((result) => {
    if (result.hubOrBridgeAddress) {
      const entry = hubUsage.get(result.hubOrBridgeAddress)
      if (entry) {
        result.tags = result.tags || []
        if (entry.count > 1) result.tags.push('multiplug')
        if (entry.slugs.size > 1) result.tags.push('multiproject')
      }
    }
  })

  // Write detailed JSON output
  logInfo(`Writing detailed results to ${resultFilePath}`)
  try {
    fs.writeFileSync(resultFilePath, JSON.stringify(groupedResults, null, 2))
    logSuccess('Results file created successfully')
  } catch (error) {
    logError(`Error writing results file`, error)
  }

  // Generate and write config snippets
  const copypastaLines = generateCopyPasta(groupedResults)

  try {
    fs.writeFileSync(copypastaFilePath, copypastaLines.join('\n'))
    logSuccess(`Configuration snippets written to ${copypastaFilePath}`)
  } catch (error) {
    logError(`Error writing configuration snippets`, error)
  }

  // Clean up
  provider.removeAllListeners()
  logSuccess('Script completed successfully')
}

// ===== Script Execution =====
main().catch((error) => {
  logError('Unhandled error in main execution', error)
  process.exit(1)
})
