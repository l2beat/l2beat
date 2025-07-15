/**
 * Socket Plug Crawler
 *
 * Scans Socket Finance plugs on Ethereum to discover tokens, vaults, and TVLs.
 * Generates configuration snippets for project discovery and suggests new tokens.
 */
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import { type BigNumber, ethers } from 'ethers' // Use specific imports if possible
import fetch from 'node-fetch'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery' // Adjust path if needed

// Load environment variables
dotenv.config()

// ===== Configuration =====
interface ScriptConfig {
  concurrency: {
    rpc: number
    coinGecko: number
  }
  paths: {
    outputDir: string
    resultFile: string
    copypastaFile: string
    tokensConfigFile: string
  }
  pricing: {
    currency: string
    batchSize: number
  }
  logging: {
    verbose: boolean
  }
  newTokens: {
    minUsdValueThreshold: number
  }
}

const CONFIG: ScriptConfig = {
  concurrency: {
    rpc: 5, // Max concurrent RPC calls
    coinGecko: 2, // Max concurrent CoinGecko API calls
  },
  paths: {
    outputDir: 'outfiles',
    resultFile: 'socket-crawl-result.json',
    copypastaFile: 'socket-crawl-copypasta.txt',
    tokensConfigFile: '../../../config/src/tokens/tokens.jsonc', // Relative path to tokens config
  },
  pricing: {
    currency: 'usd',
    batchSize: 100, // CoinGecko API batch size limit
  },
  logging: {
    verbose: false, // Set to true for detailed logs
  },
  newTokens: {
    minUsdValueThreshold: 1000, // Minimum USD value to suggest a new token
  },
}

// ===== Environment Variables =====
interface EnvironmentVariables {
  rpcUrl: string | undefined
  coinGeckoApiKey: string | undefined
  etherscanApiKey: string | undefined // Keep if needed elsewhere
}

const ENV: EnvironmentVariables = {
  rpcUrl: process.env.ETHEREUM_RPC_URL,
  coinGeckoApiKey: process.env.COINGECKO_API_KEY,
  etherscanApiKey: process.env.ETHERSCAN_API_KEY,
}

// Validate required environment variables
if (!ENV.rpcUrl) {
  // Use console.error for errors that halt execution
  console.error('❌ Missing required environment variable: ETHEREUM_RPC_URL')
  process.exit(1) // Exit if critical env var is missing
}

if (!ENV.coinGeckoApiKey) {
  console.warn(
    '⚠️  Warning: COINGECKO_API_KEY not found in .env. USD price data will not be fetched.',
  )
}

// ===== Types =====
interface Erc20Info {
  name: string | null
  symbol: string | null
  decimals: number | null
}

interface TokenInfo extends Erc20Info {
  address: string // Assuming address is always present if TokenInfo is created
  tvl: number // Default to 0 if calculation fails
  tvlRaw?: string // Raw balance string
  usdPrice?: number | null // Can be null if price not found
  usdValue: number // Default to 0 if price not found or TVL is 0
  isConfigured: boolean // Always boolean
}

interface Result {
  plugAddress: string
  hubOrBridgeAddress: string | null
  siblingChainSlug: number | 'unknown'
  token: TokenInfo | null // Token info might be null if not found
  owner: string | null
  ownerName?: string // Derived from OWNER_NAMES map
  tags?: string[] // Array of tags like 'multiplug', 'multiproject'
}

// Type for the structure returned by CoinGecko API
interface CoinGeckoPriceResponse {
  // Index signature: Key is lowercase contract address
  [contractAddressLowercase: string]:
    | {
        // Index signature: Key is lowercase currency symbol
        [currencyLowercase: string]: number
      }
    | undefined // An address might not have data
}

// Type for the relevant part of tokens.jsonc after parsing
interface TokenConfigEntry {
  address?: string // Address might be missing or invalid in the file
  // Include other potential fields if needed for validation (symbol, coingeckoId, etc.)
}
interface TokensConfig {
  ethereum?: TokenConfigEntry[] // ethereum array might be missing
  // Add other chains if needed in the future: e.g., optimism?: TokenConfigEntry[]
}

// Type guard to check if the parsed JSON conforms to TokensConfig
function isTokensConfig(obj: unknown): obj is TokensConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }
  const potentialConfig = obj as TokensConfig
  if (
    potentialConfig.ethereum !== undefined &&
    !Array.isArray(potentialConfig.ethereum)
  ) {
    return false // If ethereum exists, it must be an array
  }
  if (potentialConfig.ethereum) {
    // Optionally, add more detailed checks for array elements
    return potentialConfig.ethereum.every(
      (entry) => typeof entry === 'object' && entry !== null, // && typeof entry.address === 'string'), // Be lenient about missing address here
    )
  }
  return true // It's valid if ethereum array is missing or undefined
}

// Type for potential new token data used internally
interface PotentialNewToken {
  symbol: string // Use fallback if null
  address: string // Original casing address
  usdValue: number // Keep for potential future sorting/filtering
}

// Custom concurrency limiter to replace p-limit
class ConcurrencyLimiter {
  private running = 0
  private queue: Array<() => void> = []

  constructor(private readonly limit: number) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    // Wait if at limit
    if (this.running >= this.limit) {
      await new Promise<void>((resolve) => {
        this.queue.push(resolve)
      })
    }

    // Execute function with proper cleanup
    this.running++
    try {
      return await fn()
    } finally {
      this.running--
      // Allow next queued function to run
      if (this.queue.length > 0) {
        const next = this.queue.shift()
        if (next) next()
      }
    }
  }
}

// ===== Constants =====
// Explicitly type ABIs if possible, otherwise use string[] or ethers.utils.Fragment[]
const ABIS: Record<string, ReadonlyArray<string>> = {
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

// Mapping types
type ChainNameMap = Record<string, string> // Key is slug (string), value is name
type OwnerNameMap = Record<string, string> // Key is address (string), value is name

// Chain slug to name mapping
const CHAIN_NAMES: Readonly<ChainNameMap> = {
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
  // Add more as needed
}

// Owner address to name mapping
const OWNER_NAMES: Readonly<OwnerNameMap> = {
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
  // Add more as needed
}

// ===== Logging Functions =====
// Using console directly is fine, but wrappers allow future modification (e.g., writing to file)
function logInfo(message: string): void {
  console.log(message)
}

function logWarn(message: string): void {
  console.warn(`⚠️  ${message}`)
}

function logError(message: string, error?: unknown): void {
  // Prefer instanceof Error for better details
  const errorDetail =
    error instanceof Error ? error.message : String(error ?? '')
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
 * Loads configured Ethereum token addresses from tokens.jsonc
 */
function loadConfiguredTokens(filePath: string): Set<string> {
  logInfo(`Loading configured tokens from ${filePath}...`)
  try {
    if (!fs.existsSync(filePath)) {
      logWarn(`Token configuration file not found at ${filePath}.`)
      return new Set()
    }

    // Read raw content, remove comments (simple // and /* */ removal)
    let fileContent = fs.readFileSync(filePath, 'utf-8')
    fileContent = fileContent.replace(/\/\/.*$/gm, '') // Remove single-line comments
    fileContent = fileContent.replace(/\/\*[\s\S]*?\*\//gm, '') // Remove multi-line comments
    fileContent = fileContent.replace(/,\s*([}\]])/g, '$1') // Remove trailing commas tolerated by JSONC

    const parsedJson: unknown = JSON.parse(fileContent)

    // Use type guard to validate structure
    if (!isTokensConfig(parsedJson)) {
      logWarn(
        `Invalid structure in ${filePath}. Expected an object with an optional "ethereum" array.`,
      )
      return new Set()
    }

    const config = parsedJson // Now typed as TokensConfig

    const ethereumTokens = config.ethereum
    if (!ethereumTokens || ethereumTokens.length === 0) {
      logWarn(
        `No "ethereum" array found or it's empty in ${filePath}. No tokens will be marked as configured.`,
      )
      return new Set()
    }

    const configuredAddresses = new Set<string>()
    for (const token of ethereumTokens) {
      if (token.address && ethers.utils.isAddress(token.address)) {
        configuredAddresses.add(token.address.toLowerCase())
      } else if (token.address) {
        logDebug(
          `Invalid address format found in tokens file: ${token.address}`,
        )
      }
    }

    logSuccess(
      `Loaded ${configuredAddresses.size} configured Ethereum token addresses.`,
    )
    return configuredAddresses
  } catch (error: unknown) {
    logError(`Failed to load or parse ${filePath}`, error)
    logWarn(
      'Proceeding without configured token data. All discovered tokens will be marked as isConfigured=false.',
    )
    return new Set() // Return empty set on error
  }
}

/**
 * Makes a contract call with proper error handling. Returns null on failure.
 */
async function safeContractCall<T = unknown>(
  contract: ethers.Contract,
  functionName: string,
  args: unknown[] = [],
  logContext?: string,
): Promise<T | null> {
  // Check if the function exists on the contract instance (basic check)
  if (typeof contract[functionName] !== 'function') {
    logDebug(
      `Function ${functionName} does not exist on contract ${contract.address}`,
    )
    return null
  }

  try {
    // biome-ignore lint/suspicious/noExplicitAny: Contract interaction is inherently dynamic
    const result = await (contract as any)[functionName](...args)
    // Basic check if result is not undefined or null, though type T is the main goal
    return (result as T) ?? null // Return null if result is undefined/null
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    // Avoid logging expected reverts like non-existent functions or view call reverts
    // This condition might need refinement based on common benign reverts
    if (
      !errorMessage.includes('call revert exception') &&
      !errorMessage.includes('missing revert data')
    ) {
      const context = logContext ? ` (${logContext})` : ''
      logDebug(
        `Failed to call ${functionName} on ${contract.address}${context}: ${errorMessage.slice(0, 100)}...`, // Log snippet
      )
    }
    return null
  }
}

/**
 * Gets basic ERC20 token information (name, symbol, decimals)
 */
async function getERC20TokenInfo(
  tokenAddress: string,
  rpcProvider: ethers.providers.Provider,
): Promise<Erc20Info> {
  if (!ethers.utils.isAddress(tokenAddress)) {
    logWarn(`Invalid token address format: ${tokenAddress}`)
    return { name: null, symbol: null, decimals: null }
  }

  logDebug(`Workspaceing ERC20 info for token ${tokenAddress}`)
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ABIS.ERC20,
    rpcProvider,
  )

  // Perform calls sequentially or batched if provider supports it
  // Using Promise.allSettled allows partial results if one call fails
  const [nameResult, symbolResult, decimalsResult] = await Promise.allSettled([
    safeContractCall<string>(tokenContract, 'name'),
    safeContractCall<string>(tokenContract, 'symbol'),
    safeContractCall<number>(tokenContract, 'decimals'), // Decimals returns uint8, number is safe here
  ])

  // Process results, defaulting to null if failed
  const name = nameResult.status === 'fulfilled' ? nameResult.value : null
  const symbol = symbolResult.status === 'fulfilled' ? symbolResult.value : null
  const decimals =
    decimalsResult.status === 'fulfilled' ? decimalsResult.value : null

  if (name === null && symbol === null && decimals === null) {
    logDebug(`Could not retrieve any ERC20 info for ${tokenAddress}.`)
  } else {
    logDebug(
      `Workspaceed for ${tokenAddress}: Symbol=${symbol ?? 'N/A'}, Decimals=${decimals ?? 'N/A'}`,
    )
  }

  return { name, symbol, decimals }
}

/**
 * Gets token balance (TVL) for a specific account. Returns 0 TVL if decimals are unknown or balance fails.
 */
async function getTokenTVL(
  tokenAddress: string,
  decimals: number | null,
  account: string,
  rpcProvider: ethers.providers.Provider,
): Promise<{ tvl: number; tvlRaw: string | undefined }> {
  if (decimals === null) {
    logDebug(`Cannot fetch TVL for ${tokenAddress} without decimals.`)
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

  const tokenContract = new ethers.Contract(
    tokenAddress,
    ABIS.ERC20,
    rpcProvider,
  )
  const balanceRawBigNum = await safeContractCall<BigNumber>(
    tokenContract,
    'balanceOf',
    [account],
    `Token: ${tokenAddress}, Holder: ${account}`,
  )

  const balanceRawString = balanceRawBigNum?.toString() // Get string representation or undefined

  if (balanceRawBigNum === null || balanceRawBigNum.isZero()) {
    return { tvl: 0, tvlRaw: balanceRawString }
  }

  try {
    const tvlString = ethers.utils.formatUnits(balanceRawBigNum, decimals)
    const tvl = Number.parseFloat(tvlString)

    if (Number.isNaN(tvl)) {
      logWarn(
        `Parsed TVL is NaN for ${tokenAddress} at ${account}. Raw: ${balanceRawString}`,
      )
      return { tvl: 0, tvlRaw: balanceRawString }
    }

    logDebug(`Balance for ${tokenAddress} at ${account}: ${tvl}`)
    return { tvl, tvlRaw: balanceRawString }
  } catch (error: unknown) {
    logError(
      `Error formatting balance for ${tokenAddress} at ${account}`,
      error,
    )
    return { tvl: 0, tvlRaw: balanceRawString }
  }
}

/**
 * Fetches token prices from CoinGecko API in batches.
 */
async function fetchTokenPrices(
  tokensToFetch: ReadonlyMap<string, ReadonlySet<string>>, // Use Readonly types
  apiKey: string, // Pass API key explicitly
  concurrencyLimiter: ConcurrencyLimiter, // Pass ConcurrencyLimiter instance
): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>()
  const fetchPromises: Promise<void>[] = []
  const totalTokens = Array.from(tokensToFetch.values()).reduce(
    (sum, set) => sum + set.size,
    0,
  )

  if (totalTokens === 0) {
    logInfo('No tokens found to fetch prices for.')
    return priceMap
  }

  logInfo(
    `Workspaceing USD prices from CoinGecko for ${totalTokens} unique token(s) across ${tokensToFetch.size} platform(s)...`,
  )

  for (const [platformId, addressesSet] of tokensToFetch.entries()) {
    if (addressesSet.size === 0) {
      continue
    }
    logDebug(`Platform: ${platformId}, Tokens: ${addressesSet.size}`)

    const addresses = Array.from(addressesSet) // Create mutable array for slicing
    const batchCount = Math.ceil(addresses.length / CONFIG.pricing.batchSize)

    for (let i = 0; i < addresses.length; i += CONFIG.pricing.batchSize) {
      const batch = addresses.slice(i, i + CONFIG.pricing.batchSize)
      const contractAddressesParam = batch.join(',')
      const url = `https://pro-api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${contractAddressesParam}&vs_currencies=${CONFIG.pricing.currency}`

      const fetchJob = concurrencyLimiter.add(async () => {
        const batchIndex = Math.floor(i / CONFIG.pricing.batchSize) + 1
        logDebug(
          `Workspaceing batch ${batchIndex}/${batchCount} for ${platformId} (${batch.length} tokens)`,
        )

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-cg-pro-api-key': apiKey, // Use passed API key
            },
          })

          if (!response.ok) {
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch {
              // Ignore error reading body if response failed badly
            }
            logError(
              `CoinGecko API error for ${platformId} (batch ${batchIndex}/${batchCount})`,
              `${response.status} ${response.statusText}. ${errorBody.slice(0, 100)}`,
            )
            return // Skip this batch on error
          }

          // Parse JSON safely
          const data: unknown = await response.json()

          // Validate the structure (basic check)
          if (typeof data !== 'object' || data === null) {
            logError(
              `Invalid JSON structure received from CoinGecko for ${platformId} (batch ${batchIndex})`,
            )
            return
          }

          // Type assertion after check - assumes CoinGecko format is reliable
          const priceData = data as CoinGeckoPriceResponse

          for (const [contractAddress, entry] of Object.entries(priceData)) {
            // Check if entry and price exist and are numbers
            const price = entry?.[CONFIG.pricing.currency]
            if (typeof price === 'number') {
              // Always store lowercase address in the map key
              priceMap.set(
                `${platformId}-${contractAddress.toLowerCase()}`,
                price,
              )
            }
          }
        } catch (error: unknown) {
          logError(
            `Failed to fetch or process CoinGecko data for ${platformId} (batch ${batchIndex})`,
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
 * Analyzes a plug contract and extracts relevant information.
 */
async function explorePlugContract(
  address: string,
  configuredTokens: ReadonlySet<string>, // Use ReadonlySet
  rpcProvider: ethers.providers.Provider,
): Promise<Result | null> {
  if (!ethers.utils.isAddress(address)) {
    logWarn(`Invalid plug address: ${address}`)
    return null
  }

  logDebug(`Exploring plug contract at ${address}`)
  const plugContract = new ethers.Contract(address, ABIS.PLUG, rpcProvider)

  const [hub, bridge, siblingChainSlugRaw, owner] = await Promise.all([
    safeContractCall<string>(plugContract, 'hub__'),
    safeContractCall<string>(plugContract, 'bridge__'),
    safeContractCall<number>(plugContract, 'siblingChainSlug'), // uint32 fits in number
    safeContractCall<string>(plugContract, 'owner'),
  ])

  const hubOrBridgeAddress = hub ?? bridge // Use nullish coalescing
  const siblingChainSlug = siblingChainSlugRaw ?? 'unknown'
  const ownerAddress = owner ?? null
  const ownerName = ownerAddress ? OWNER_NAMES[ownerAddress] : undefined // No assertion

  let tokenInfo: TokenInfo | null = null

  if (hubOrBridgeAddress && ethers.utils.isAddress(hubOrBridgeAddress)) {
    const hubOrBridgeContract = new ethers.Contract(
      hubOrBridgeAddress,
      ABIS.HUB_BRIDGE,
      rpcProvider,
    )

    // Prefer token__() but fall back to token()
    const tokenAddress =
      (await safeContractCall<string>(hubOrBridgeContract, 'token__')) ??
      (await safeContractCall<string>(hubOrBridgeContract, 'token'))

    if (tokenAddress && ethers.utils.isAddress(tokenAddress)) {
      logDebug(
        `Found token: ${tokenAddress} via Hub/Bridge ${hubOrBridgeAddress}`,
      )
      const erc20Info = await getERC20TokenInfo(tokenAddress, rpcProvider)
      // Check configuration status using lowercase address
      const isConfigured = configuredTokens.has(tokenAddress.toLowerCase())

      let tvl = 0
      let tvlRaw: string | undefined

      // Only fetch TVL if decimals are known
      if (erc20Info.decimals !== null) {
        const tvlResult = await getTokenTVL(
          tokenAddress,
          erc20Info.decimals,
          hubOrBridgeAddress, // TVL is held by the hub/bridge
          rpcProvider,
        )
        tvl = tvlResult.tvl
        tvlRaw = tvlResult.tvlRaw
      } else {
        logDebug(
          `Could not calculate TVL for ${tokenAddress} (missing decimals)`,
        )
      }

      // Construct TokenInfo - usdValue/usdPrice will be added later
      tokenInfo = {
        address: tokenAddress,
        name: erc20Info.name,
        symbol: erc20Info.symbol,
        decimals: erc20Info.decimals,
        tvl,
        tvlRaw,
        isConfigured,
        usdValue: 0, // Initialize usdValue
        usdPrice: null, // Initialize usdPrice
      }
    } else {
      logDebug(`No valid token found for Hub/Bridge ${hubOrBridgeAddress}`)
    }
  } else {
    logDebug(`No Hub or Bridge address found for Plug ${address}`)
  }

  return {
    plugAddress: address,
    hubOrBridgeAddress,
    siblingChainSlug,
    token: tokenInfo, // token can be null here
    owner: ownerAddress,
    ownerName,
  }
}

/**
 * Generates configuration snippets for project discovery and potential new tokens.
 */
function generateCopyPasta(
  sortedGroupedResults: Readonly<Record<string, ReadonlyArray<Result>>>, // Use Readonly
): string[] {
  logInfo('Generating config snippets...')

  // --- Part 1: Generate snippets for existing, configured tokens ---
  const copypastaSections: { [key: string]: string[] } = {
    initialAddresses: [],
    names: [],
    ignoreMethods: [],
    escrows: [],
  }
  const addedHubsPerProject = new Map<string, Set<string>>()
  const projectOrder = Object.keys(sortedGroupedResults) // Keys are already sorted

  for (const slug of projectOrder) {
    const resultsForSlug = sortedGroupedResults[slug] ?? [] // Handle potential undefined slug
    const slugName = CHAIN_NAMES[slug] ?? `UnknownChain(${slug})` // Default name
    const projectInitialAddresses: string[] = []
    const projectNames: string[] = []
    const projectIgnoreMethods: string[] = []
    const projectEscrows: string[] = []
    let projectCommentAdded = false

    // Ensure set exists for the slug
    if (!addedHubsPerProject.has(slugName)) {
      addedHubsPerProject.set(slugName, new Set<string>())
    }
    // Safely get the set
    const currentProjectAddedHubs =
      addedHubsPerProject.get(slugName) ?? new Set<string>()

    // Results within the slug group are already sorted deterministically
    for (const result of resultsForSlug) {
      const hubAddr = result.hubOrBridgeAddress
      // Include if token exists, is configured, and hub address exists
      if (hubAddr && result.token?.isConfigured) {
        // Check TVL threshold if desired (currently > 0)
        if ((result.token.tvl ?? 0) <= 0) {
          continue
        }

        // Skip tokens with unknown symbols/tickers
        if (
          !result.token.symbol ||
          result.token.symbol.startsWith('UNKNOWN_')
        ) {
          logDebug(
            `Skipping token with unknown symbol: ${result.token.address}`,
          )
          continue
        }

        // Check for duplicates safely
        if (currentProjectAddedHubs.has(hubAddr)) {
          logDebug(
            `Skipping duplicate hub ${hubAddr} for ${slugName} in copypasta (configured section)`,
          )
          continue
        }

        if (!projectCommentAdded) {
          const projectHeader = `\n    // --- ${slugName} ---`
          projectInitialAddresses.push(projectHeader)
          projectNames.push(projectHeader)
          projectIgnoreMethods.push(projectHeader)
          projectEscrows.push(projectHeader)
          projectCommentAdded = true
        }

        // Use nullish coalescing for safety
        const tokenSymbol =
          result.token.symbol ?? `UNKNOWN_${result.token.address.slice(0, 6)}`
        const tokenName = result.token.name ?? 'Unknown Token'
        const vaultName = `${tokenSymbol} Vault (${slugName})`
        const ownerNameStr =
          result.ownerName ??
          (result.owner
            ? `Unknown Owner (${result.owner.slice(0, 6)}...)`
            : 'Unknown Owner')

        projectInitialAddresses.push(`    "${hubAddr}",`)
        projectNames.push(`    "${hubAddr}": "${vaultName}",`)

        // MODIFIED: Use hub address as key with vault name in comment
        projectIgnoreMethods.push(
          `    "${hubAddr}": {\n      // ${vaultName}\n      "ignoreMethods": ["token", "token__", "hook__"]\n    },`,
        )

        projectEscrows.push(
          `    discovery.getEscrowDetails({ // ${vaultName}
      address: EthereumAddress('${hubAddr}'),
      name: '${vaultName}',
      description: 'Socket Vault holding ${tokenName} (${tokenSymbol}) associated with ${slugName}. Owned by ${ownerNameStr}.',
      tokens: ['${tokenSymbol}'],
    }),`,
        )
        currentProjectAddedHubs.add(hubAddr)
      }
    }

    // Only add if content exists beyond the header
    if (projectInitialAddresses.length > 1) {
      copypastaSections.initialAddresses.push(...projectInitialAddresses)
      copypastaSections.names.push(...projectNames)
      copypastaSections.ignoreMethods.push(...projectIgnoreMethods)
      copypastaSections.escrows.push(...projectEscrows)
    }
  }

  // --- Part 2: Collect and format potential new tokens ---
  logInfo(
    `Identifying potential new tokens with USD value > $${CONFIG.newTokens.minUsdValueThreshold}...`,
  )
  const potentialNewTokensMap = new Map<string, PotentialNewToken>() // Key: lowercase address

  for (const slug of projectOrder) {
    const resultsForSlug = sortedGroupedResults[slug] ?? []
    for (const result of resultsForSlug) {
      // Check token exists, is *not* configured, and meets threshold
      if (
        result.token &&
        !result.token.isConfigured &&
        result.token.usdValue > CONFIG.newTokens.minUsdValueThreshold
      ) {
        const lowerCaseAddress = result.token.address.toLowerCase()
        // Add only if not already present
        if (!potentialNewTokensMap.has(lowerCaseAddress)) {
          potentialNewTokensMap.set(lowerCaseAddress, {
            // Use fallback symbol if needed
            symbol:
              result.token.symbol ??
              `UNKNOWN_${result.token.address.slice(0, 6)}`,
            address: result.token.address, // Keep original casing for output
            usdValue: result.token.usdValue, // Already defaulted to 0 if null
          })
        }
      }
    }
  }

  // Convert map to array and sort alphabetically by symbol (case-insensitive)
  const sortedNewTokens = Array.from(potentialNewTokensMap.values()).sort(
    (a, b) =>
      a.symbol.localeCompare(b.symbol, undefined, { sensitivity: 'base' }),
  )

  // Format the new token snippets
  const newTokensSnippets: string[] = []
  if (sortedNewTokens.length > 0) {
    logSuccess(
      `Found ${sortedNewTokens.length} potential new tokens to suggest.`,
    )
    newTokensSnippets.push(
      `\n\n// === tokens.jsonc additions (Potential New Tokens > $${CONFIG.newTokens.minUsdValueThreshold} TVL) ===`,
      `// Add these to the "ethereum" array in your tokens.jsonc file:`,
    )
    for (let i = 0; i < sortedNewTokens.length; i++) {
      const token = sortedNewTokens[i]
      // Use JSON.stringify for proper escaping if symbols contain special chars
      const snippet = `  {
    "symbol": ${JSON.stringify(token.symbol)},
    "address": "${token.address}"
  }`
      // Add comma except for the last item
      newTokensSnippets.push(
        snippet + (i < sortedNewTokens.length - 1 ? ',' : ''),
      )
    }
  } else {
    logInfo('No potential new tokens met the criteria.')
  }

  // --- Part 3: Assemble final output ---
  // Helper to clean trailing commas robustly
  function cleanTrailingCommas(lines: string[]): string[] {
    const cleaned: string[] = []
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i]
      const trimmedLine = currentLine?.trim() // Handle potential undefined lines

      if (!trimmedLine || trimmedLine.startsWith('//')) {
        cleaned.push(currentLine)
        continue // Skip comments/empty lines
      }

      // Find the next meaningful line (non-comment, non-empty)
      let nextMeaningfulLineTrimmed = ''
      for (let j = i + 1; j < lines.length; j++) {
        const nextLineTrimmed = lines[j]?.trim()
        if (nextLineTrimmed && !nextLineTrimmed.startsWith('//')) {
          nextMeaningfulLineTrimmed = nextLineTrimmed
          break
        }
      }

      // Check if the current line ends with a comma AND
      // the next meaningful line STARTS with a closing character
      if (
        trimmedLine.endsWith(',') &&
        /^[\]}]/.test(nextMeaningfulLineTrimmed)
      ) {
        // Check if the next line is ONLY the closing char or closing char + comma
        if ([']', '}', '],', '},'].includes(nextMeaningfulLineTrimmed)) {
          cleaned.push(currentLine.replace(/,\s*$/, '')) // Remove trailing comma
          continue
        }
      }

      cleaned.push(currentLine) // Keep line as is
    }
    return cleaned
  }

  // Combine sections
  const outputLines = [
    '// === config.jsonc additions ===',
    `\n"initialAddresses": [`,
    ...copypastaSections.initialAddresses,
    '],',
    `\n"names": {`,
    ...copypastaSections.names,
    '},',
    `\n"ignoreMethods": {`,
    ...copypastaSections.ignoreMethods,
    '},',
    '\n\n// === socket.ts additions (inside escrows:) ===',
    '\nescrows: [',
    ...copypastaSections.escrows,
    '],',
  ]

  // Apply comma cleaning only to the sections that need it
  const cleanedStandardSections = cleanTrailingCommas(outputLines)

  // Return combined cleaned standard sections and the new token suggestions
  return [...cleanedStandardSections, ...newTokensSnippets]
}

// ===== Initialize Providers and Limits =====
// Ensure RPC URL is defined due to check at the start
const provider = new ethers.providers.JsonRpcProvider(ENV.rpcUrl)
const rpcLimiter = new ConcurrencyLimiter(CONFIG.concurrency.rpc)
const cgLimiter = ENV.coinGeckoApiKey
  ? new ConcurrencyLimiter(CONFIG.concurrency.coinGecko)
  : null

// ===== Main Function =====
async function main(): Promise<void> {
  logInfo('Starting Socket plug exploration...')

  // --- 1. Load Configured Tokens ---
  const tokensConfigPath = path.resolve(
    __dirname,
    CONFIG.paths.tokensConfigFile,
  )
  const configuredEthereumTokens: ReadonlySet<string> =
    loadConfiguredTokens(tokensConfigPath)

  // Create output directory if it doesn't exist
  const outputDirPath = path.resolve(__dirname, CONFIG.paths.outputDir)
  // Use try-catch for fs operations
  try {
    fs.mkdirSync(outputDirPath, { recursive: true })
  } catch (error: unknown) {
    logError(`Failed to create output directory: ${outputDirPath}`, error)
    process.exit(1)
  }
  const resultFilePath = path.join(outputDirPath, CONFIG.paths.resultFile)
  const copypastaFilePath = path.join(outputDirPath, CONFIG.paths.copypastaFile)

  // --- 2. Get Plug Addresses ---
  let plugs: string[] = []
  try {
    // Assuming 'socket' discovery config exists and contains 'plugs'
    const discovery = new ProjectDiscovery('socket')
    // Type the expected return value
    const discoveredPlugsRaw = discovery.getContractValue<string[]>(
      'Socket', // Assuming 'Socket' is the contract name in discovery.json
      'plugs',
    )

    // Validate the discovered plugs structure
    if (
      !Array.isArray(discoveredPlugsRaw) ||
      !discoveredPlugsRaw.every(
        (p) => typeof p === 'string' && ethers.utils.isAddress(p),
      )
    ) {
      throw new Error(
        "Discovered 'plugs' is not an array of valid Ethereum addresses",
      )
    }
    plugs = discoveredPlugsRaw // Now typed as string[]
    logInfo(`Found ${plugs.length} valid plug addresses via ProjectDiscovery`)
  } catch (error: unknown) {
    logError('Failed to get plugs from ProjectDiscovery', error)
    logError(
      "Please ensure 'socket' project discovery is configured correctly.",
    )
    process.exit(1)
  }

  if (plugs.length === 0) {
    logWarn('No plug addresses found to explore. Exiting.')
    process.exit(0)
  }

  // --- 3. Explore Plugs Concurrently ---
  logInfo(`Exploring ${plugs.length} plug contracts...`)
  // Explicitly type the settled results array
  const explorePromises = plugs.map((address) =>
    rpcLimiter.add(() =>
      explorePlugContract(address, configuredEthereumTokens, provider),
    ),
  )
  const settledResults = await Promise.allSettled(explorePromises)

  // Filter successful results and log errors
  const successfulResults: Result[] = []
  for (const [index, result] of settledResults.entries()) {
    if (result.status === 'fulfilled') {
      if (result.value) {
        // Ensure value is not null
        successfulResults.push(result.value)
      }
      // Ignore null results (e.g., from invalid plug address)
    } else {
      // result.status === 'rejected'
      logError(`Exploration failed for plug ${plugs[index]}`, result.reason)
    }
  }

  logSuccess(
    `Successfully explored ${successfulResults.length} out of ${plugs.length} potential plugs`,
  )

  // --- 4. Fetch Token Prices ---
  let priceData = new Map<string, number>()
  // Check if API key and limit function exist
  if (ENV.coinGeckoApiKey && cgLimiter) {
    const tokensForPriceFetch = new Map<string, Set<string>>()
    for (const result of successfulResults) {
      if (result.token?.address) {
        const platformId = 'ethereum' // Hardcoded for now
        let platformSet = tokensForPriceFetch.get(platformId)
        if (!platformSet) {
          platformSet = new Set<string>()
          tokensForPriceFetch.set(platformId, platformSet)
        }
        // Use lowercase address for price fetching consistency
        platformSet.add(result.token.address.toLowerCase())
      }
    }
    // Explicitly pass API key and limit
    priceData = await fetchTokenPrices(
      tokensForPriceFetch,
      ENV.coinGeckoApiKey,
      cgLimiter,
    )
  } else {
    logInfo('Skipping price fetch (API key or limiter not available).')
  }

  // --- 5. Update Results with Prices and Calculate USD Value ---
  if (priceData.size > 0) {
    logInfo('Updating results with price data...')
    for (const result of successfulResults) {
      // Ensure token and address exist
      if (result.token?.address) {
        // Use lowercase address for lookup
        const priceKey = `ethereum-${result.token.address.toLowerCase()}`
        const price = priceData.get(priceKey) // price is number | undefined

        if (price !== undefined) {
          result.token.usdPrice = price
          // Calculate usdValue, defaulting tvl to 0 if null/undefined
          result.token.usdValue = (result.token.tvl ?? 0) * price
        } else {
          // Explicitly set to null/0 if price not found
          result.token.usdPrice = null
          result.token.usdValue = 0
        }
      }
      // No else needed, usdValue/usdPrice initialized to 0/null in explorePlugContract
    }
  } else {
    logInfo('No price data fetched, USD values remain initialized (likely 0).')
    // Values are already initialized to 0/null if no price data
  }

  // --- 6. Add Tags (Multiplug/Multiproject) ---
  // Define type for hub usage map value
  type HubUsageInfo = { count: number; slugs: Set<number | 'unknown'> }
  const hubUsage = new Map<string, HubUsageInfo>()

  for (const result of successfulResults) {
    if (result.hubOrBridgeAddress) {
      const addr = result.hubOrBridgeAddress
      let entry = hubUsage.get(addr)
      if (!entry) {
        entry = { count: 0, slugs: new Set() }
        hubUsage.set(addr, entry)
      }
      entry.count++
      entry.slugs.add(result.siblingChainSlug)
    }
  }

  for (const result of successfulResults) {
    if (result.hubOrBridgeAddress) {
      const entry = hubUsage.get(result.hubOrBridgeAddress)
      if (entry) {
        result.tags = result.tags ?? [] // Initialize tags array if needed
        if (entry.count > 1 && !result.tags.includes('multiplug')) {
          result.tags.push('multiplug')
        }
        if (entry.slugs.size > 1 && !result.tags.includes('multiproject')) {
          result.tags.push('multiproject')
        }
      }
    }
  }

  // --- 7. Group and Sort Results for Deterministic Output ---
  logInfo('Grouping and sorting results for deterministic output...')

  // Type the accumulator for reduce
  type GroupedResults = Record<string, Result[]>
  const groupedResultsUnsorted = successfulResults.reduce<GroupedResults>(
    (acc, result) => {
      const slugKey = String(result.siblingChainSlug) // Ensure key is string
      // Ensure array exists for the slug
      acc[slugKey] = acc[slugKey] ?? [] // Initialize if undefined
      acc[slugKey].push(result)
      return acc
    },
    {}, // Initial value is an empty object
  )

  // Sort keys (sibling slugs) deterministically (numerically, 'unknown' last)
  const sortedSlugs = Object.keys(groupedResultsUnsorted).sort((a, b) => {
    const isAUnknown = a === 'unknown'
    const isBUnknown = b === 'unknown'
    if (isAUnknown && isBUnknown) return 0
    if (isAUnknown) return 1 // 'unknown' comes after numbers
    if (isBUnknown) return -1
    return Number(a) - Number(b) // Sort numerically
  })

  // Create a new mutable object for sorting results
  const groupedResultsSorted: Record<string, Result[]> = {}

  // Process each slug and add sorted results
  for (const slug of sortedSlugs) {
    const results = groupedResultsUnsorted[slug] ?? [] // Default to empty array

    // Create a sorted copy of the results array
    groupedResultsSorted[slug] = [...results].sort((a, b) => {
      // Primary sort: USD Value (descending), default to 0
      const usdDiff = (b.token?.usdValue ?? 0) - (a.token?.usdValue ?? 0)
      if (usdDiff !== 0) {
        return usdDiff
      }

      // Secondary sort: Hub/Bridge Address (ascending) - ensures stable sort
      const addrA = a.hubOrBridgeAddress ?? '' // Default to empty string
      const addrB = b.hubOrBridgeAddress ?? ''
      const addrDiff = addrA.localeCompare(addrB)
      if (addrDiff !== 0) {
        return addrDiff
      }

      // Tertiary sort: Plug Address (ascending) - final tie-breaker
      return (a.plugAddress ?? '').localeCompare(b.plugAddress ?? '')
    })
  }

  // --- 8. Write Detailed JSON Output ---
  logInfo(`Writing detailed results to ${resultFilePath}`)
  try {
    // Use the deterministically sorted grouped results
    // Specify indentation (2 spaces) for consistency
    fs.writeFileSync(
      resultFilePath,
      JSON.stringify(groupedResultsSorted, null, 2),
    )
    logSuccess('Results file created successfully')
  } catch (error: unknown) {
    logError(`Error writing results file to ${resultFilePath}`, error)
  }

  // --- 9. Generate and Write Config Snippets (Copypasta) ---
  // Pass the deterministically sorted grouped results
  const copypastaLines = generateCopyPasta(groupedResultsSorted)

  logInfo(`Writing configuration snippets to ${copypastaFilePath}`)
  try {
    fs.writeFileSync(copypastaFilePath, copypastaLines.join('\n'))
    logSuccess(`Configuration snippets written to ${copypastaFilePath}`)
  } catch (error: unknown) {
    logError(
      `Error writing configuration snippets to ${copypastaFilePath}`,
      error,
    )
  }

  logSuccess('Script completed successfully')
}

// ===== Script Execution =====
main().catch((error: unknown) => {
  logError('Unhandled error in main execution', error)
  process.exit(1)
})
