import { existsSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { Logger, RateLimiter, getEnv } from '@l2beat/backend-tools'
import { layer2s, tokenList } from '@l2beat/config'
import { CoingeckoClient, HttpClient2, RetryHandler } from '@l2beat/shared'
import { providers, utils } from 'ethers'
import { difference } from 'lodash'
import { RateLimitedProvider } from '../../src/peripherals/rpcclient/RateLimitedProvider'

const BLOCK_RANGE = 20_000

const OUTPUT_PATH = path.resolve(__dirname, './discovered.json')

interface DiscoveredData {
  found: string[]
  processed: Record<string, number>
}

function getBlockRanges(
  fromBlock: number,
  toBlock: number,
): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  let currentFromBlock = fromBlock

  while (currentFromBlock < toBlock) {
    const currentToBlock = Math.min(currentFromBlock + BLOCK_RANGE, toBlock)
    ranges.push([currentFromBlock, currentToBlock])
    currentFromBlock = currentToBlock + 1
  }

  return ranges
}

function loadExistingData(): DiscoveredData {
  if (existsSync(OUTPUT_PATH)) {
    const data = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    return {
      found: data.found ?? [],
      processed: data.processed ?? {},
    }
  }
  return { found: [], processed: {} }
}

async function main() {
  const provider = getProvider()
  const coingeckoClient = getCoingeckoClient()
  const escrows = layer2s
    .map((layer2) => layer2.config.escrows)
    .flat()
    .filter((e) => e.chain === 'ethereum')

  const coingeckoTokens = await coingeckoClient.getCoinList({
    includePlatform: true,
  })
  const coingeckoTokensMap = new Set(
    coingeckoTokens.map((t) => t.platforms.ethereum).filter((p) => p !== null),
  )
  console.log(Array.from(coingeckoTokensMap), 'tokens found on coingecko')

  const transferTopic = utils.id('Transfer(address,address,uint256)')
  const latestBlock = await provider.getBlockNumber()
  const existingData = loadExistingData()
  const allFoundTokens = new Set(existingData.found)

  for (const escrow of escrows) {
    console.log(
      `Checking logs for escrow: ${escrow.address} - ${escrows.findIndex((e) => e.address === escrow.address) + 1}/${escrows.length}`,
    )

    const lastProcessedBlock = existingData.processed?.[escrow.address] ?? 0
    const blockRanges = getBlockRanges(lastProcessedBlock, latestBlock)
    if (blockRanges.length === 0) {
      console.log(
        `Escrow ${escrow.address} already processed up to ${lastProcessedBlock}`,
      )
      continue
    }

    const toTopic = utils.hexZeroPad(escrow.address, 32)

    const logPromises = blockRanges.map(async ([fromBlock, toBlock]) => {
      const logs = await provider.getLogs({
        topics: [transferTopic, null, toTopic],
        fromBlock,
        toBlock,
      })
      console.log(
        `Processed blocks ${fromBlock}-${toBlock}, found ${logs.length} logs for escrow ${escrow.address}`,
      )
      return logs
    })

    const logsArrays = await Promise.all(logPromises)
    const allLogs = logsArrays.flat()

    console.log('Total logs found:', allLogs.length)
    const tokensFromLogs = new Set(allLogs.map((l) => l.address))
    for (const tokenFromLog of tokensFromLogs) {
      if (coingeckoTokensMap.has(tokenFromLog)) {
        allFoundTokens.add(tokenFromLog)
      }
    }

    const notFoundTokensAddresses = difference(
      Array.from(allFoundTokens),
      tokenList.map((t) => t.address),
    )

    existingData.found = Array.from(allFoundTokens)
    existingData.processed[escrow.address] = latestBlock

    const outputJson = JSON.stringify(existingData, null, 2)
    writeFileSync(OUTPUT_PATH, outputJson + '\n')

    console.log(
      'Tokens not found in tokenList:',
      notFoundTokensAddresses.length,
    )
  }
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
    5000,
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
