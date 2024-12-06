import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { Logger, RateLimiter, getEnv } from '@l2beat/backend-tools'
import { layer2s, tokenList } from '@l2beat/config'
import {
  BlockIndexerClient,
  CoingeckoClient,
  HttpClient,
  HttpClient2,
  RetryHandler,
} from '@l2beat/shared'
import { providers, utils } from 'ethers'
import { chunk } from 'lodash'
import { RateLimitedProvider } from '../../src/peripherals/rpcclient/RateLimitedProvider'

const OUTPUT_PATH = path.resolve(__dirname, './discovered.json')
const PROCESSED_ESCROWS_PATH = path.resolve(
  __dirname,
  './processedEscrows.json',
)

interface DiscoveredTokens {
  found: {
    address: string
    escrows: string[]
    coingeckoId?: string
    symbol?: string
    marketCap?: number
  }[]
}

interface ProcessedEscrows {
  processed: Record<string, number>
}

function loadExistingTokens(): DiscoveredTokens {
  if (existsSync(OUTPUT_PATH)) {
    const data = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    return {
      found: data.found ?? [],
    }
  }
  return { found: [] }
}

function loadProcessedEscrows(): ProcessedEscrows {
  if (existsSync(PROCESSED_ESCROWS_PATH)) {
    const data = JSON.parse(readFileSync(PROCESSED_ESCROWS_PATH, 'utf-8'))
    return {
      processed: data.processed ?? {},
    }
  }
  return { processed: {} }
}

async function main() {
  const provider = getProvider()
  const coingeckoClient = getCoingeckoClient()
  const etherscanClient = getEtherscanClient()
  const escrows = layer2s
    .map((layer2) => layer2.config.escrows)
    .flat()
    .filter((e) => e.chain === 'ethereum')

  const coingeckoTokens = await coingeckoClient.getCoinList({
    includePlatform: true,
  })
  const coingeckoTokensMap = new Map(
    coingeckoTokens
      .filter((t) => t.platforms.ethereum)
      .map((t) => [
        t.platforms.ethereum?.toLowerCase(),
        {
          id: t.id,
          symbol: t.symbol,
        },
      ]),
  )

  const transferTopic = utils.id('Transfer(address,address,uint256)')
  const latestBlock = await provider.getBlockNumber()
  const existingTokens = loadExistingTokens()
  const processedEscrows = loadProcessedEscrows()
  const tokenListAddresses = new Set(
    tokenList.map((t) => t.address?.toLowerCase()),
  )
  const allFoundTokens = new Map<
    string,
    { escrows: Set<string>; coingeckoId?: string; symbol?: string }
  >()
  existingTokens.found.forEach((token) => {
    allFoundTokens.set(token.address, {
      escrows: new Set(token.escrows),
      coingeckoId: token.coingeckoId,
      symbol: token.symbol,
    })
  })

  for (const escrow of escrows) {
    console.log(
      `Checking logs for escrow: ${escrow.address} - ${escrows.findIndex((e) => e.address === escrow.address) + 1}/${escrows.length}`,
    )

    const lastProcessedBlock =
      processedEscrows.processed?.[escrow.address] ??
      (await etherscanClient.getBlockNumberAtOrBefore(escrow.sinceTimestamp))
    const toTopic = utils.hexZeroPad(escrow.address, 32)

    const allLogs = await getAllLogs(
      provider,
      [transferTopic, null, toTopic],
      lastProcessedBlock,
      latestBlock,
    )

    console.log(
      `Processed blocks ${lastProcessedBlock}-${latestBlock}, found ${allLogs.length} logs for escrow ${escrow.address}`,
    )

    const tokensFromLogs = new Set(allLogs.map((l) => l.address.toLowerCase()))
    for (const tokenFromLog of tokensFromLogs) {
      if (
        coingeckoTokensMap.has(tokenFromLog) &&
        !tokenListAddresses.has(tokenFromLog)
      ) {
        if (!allFoundTokens.has(tokenFromLog)) {
          const tokenInfo = coingeckoTokensMap.get(tokenFromLog)
          allFoundTokens.set(tokenFromLog, {
            escrows: new Set(),
            coingeckoId: tokenInfo?.id,
            symbol: tokenInfo?.symbol,
          })
        }
        allFoundTokens.get(tokenFromLog)?.escrows.add(escrow.address)
      }
    }

    existingTokens.found = Array.from(allFoundTokens.entries()).map(
      ([address, data]) => ({
        address,
        escrows: Array.from(data.escrows),
        coingeckoId: data.coingeckoId,
        symbol: data.symbol,
      }),
    )
    processedEscrows.processed[escrow.address] = latestBlock

    writeFileSync(OUTPUT_PATH, JSON.stringify(existingTokens, null, 2) + '\n')
    writeFileSync(
      PROCESSED_ESCROWS_PATH,
      JSON.stringify(processedEscrows, null, 2) + '\n',
    )

    console.log('Tokens not found in tokenList:', allFoundTokens.size)
  }

  const chunks = chunk(Array.from(allFoundTokens.keys()), 150)

  const tokenMarketCaps = new Map<string, number>()
  for (const chunk of chunks) {
    const chunkData = (await coingeckoClient.query(
      '/simple/token_price/ethereum',
      {
        vs_currencies: 'usd',
        include_market_cap: 'true',
        contract_addresses: chunk.join(','),
      },
    )) as Record<string, { usd_market_cap: number }>

    for (const [address, data] of Object.entries(chunkData)) {
      tokenMarketCaps.set(address, data.usd_market_cap)
    }
  }

  const sortedTokens = Array.from(allFoundTokens.entries())
    .map(([address, data]) => ({
      symbol: data.symbol,
      coingeckoId: data.coingeckoId,
      marketCap: tokenMarketCaps.get(address),
      address,
      escrows: Array.from(data.escrows),
    }))
    .sort((a, b) => {
      const mcapA = a.marketCap ?? 0
      const mcapB = b.marketCap ?? 0
      return mcapB - mcapA
    })

  writeFileSync(
    OUTPUT_PATH,
    JSON.stringify({ found: sortedTokens }, null, 2) + '\n',
  )
}

main().then(() => {
  console.log('done')
})

function getProvider() {
  const env = getEnv()
  const rateLimitedProvider = new RateLimitedProvider(
    new providers.JsonRpcProvider(
      env.string(['DISCOVER_TOKENS_ETHEREUM_RPC_URL', 'ETHEREUM_RPC_URL']),
    ),
    4000,
  )
  return rateLimitedProvider
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient2()
  const rateLimiter = RateLimiter.COINGECKO(coingeckoApiKey)
  const coingeckoClient = new CoingeckoClient({
    http,
    rateLimiter,
    apiKey: coingeckoApiKey,
    retryHandler: RetryHandler.SCRIPT,
    logger: Logger.WARN,
  })
  return coingeckoClient
}

function getEtherscanClient() {
  const env = getEnv()
  return new BlockIndexerClient(
    new HttpClient(),
    new RateLimiter({ callsPerMinute: 120 }),
    {
      type: 'etherscan',
      chain: 'ethereum',
      url: 'https://api.etherscan.io/api',
      apiKey: env.string('ETHEREUM_ETHERSCAN_API_KEY'),
    },
  )
}

async function getAllLogs(
  provider: RateLimitedProvider,
  topics: (string | null)[],
  fromBlock: number,
  toBlock: number,
): Promise<providers.Log[]> {
  if (fromBlock === toBlock) {
    return await provider.getLogs({
      topics,
      fromBlock,
      toBlock,
    })
  }
  try {
    return await provider.getLogs({
      topics,
      fromBlock,
      toBlock,
    })
  } catch (e) {
    if (
      e instanceof Error &&
      (e.message.includes('Log response size exceeded') ||
        e.message.includes('query exceeds max block range 100000'))
    ) {
      const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
      const [a, b] = await Promise.all([
        getAllLogs(provider, topics, fromBlock, midPoint),
        getAllLogs(provider, topics, midPoint + 1, toBlock),
      ])
      return a.concat(b)
    } else {
      throw e
    }
  }
}
