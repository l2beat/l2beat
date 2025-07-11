import { getEnv, Logger, RateLimiter } from '@l2beat/backend-tools'
import { type ChainConfig, ProjectService } from '@l2beat/config'
import { RateLimitedProvider } from '@l2beat/discovery'
import { BlockIndexerClient, CoingeckoClient, HttpClient } from '@l2beat/shared'
import { assert, ChainConverter } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { providers, utils } from 'ethers'
import { writeFileSync } from 'fs'
import chunk from 'lodash/chunk'
import groupBy from 'lodash/groupBy'
import { getLegacyConfig } from '../../src/modules/tvs/tools/legacyConfig/getLegacyConfig'
import {
  formatNumberWithCommas,
  getEscrowKey,
  loadExistingTokens,
  loadProcessedEscrows,
  OUTPUT_PATH,
  PROCESSED_ESCROWS_PATH,
} from './utils'

const MIN_MARKET_CAP = 10_000_000
const MIN_MISSING_VALUE = 10_000

async function main() {
  const ps = new ProjectService()
  const projects = await ps.getProjects({
    select: ['escrows', 'tvsInfo', 'chainConfig'],
  })
  const tokenList = await ps.getTokens()

  const escrowsByChain = groupBy(
    projects
      .flatMap((p) => {
        const legacyConfig = getLegacyConfig(p, tokenList)
        return legacyConfig.escrows.flatMap((e) => ({ ...e, projectId: p.id }))
      })
      .filter((e) => e.chain !== 'mantle' && e.chain !== 'nova'),
    'chain',
  )
  const chainsToSupport = Object.keys(escrowsByChain)

  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (p) => p.chainConfig,
  )

  const providers = new Map(
    chainsToSupport.map((chain) => [chain, getProvider(chain, chains)]),
  )
  const etherscanClients = new Map(
    chainsToSupport.map((chain) => [chain, getEtherscanClient(chain, chains)]),
  )
  const coingeckoClient = getCoingeckoClient()

  const chainConverter = new ChainConverter(chains)

  const coingeckoTokens = await coingeckoClient.getCoinList({
    includePlatform: true,
  })

  const platformToChainName = new Map(
    chains.map((chain) => [chain.coingeckoPlatform, chain.name]),
  )

  const coingeckoTokensMap = new Map(
    coingeckoTokens.flatMap((token) =>
      Object.entries(token.platforms)
        .filter(
          ([platform, address]) => address && platformToChainName.has(platform),
        )
        .map(([platform, address]) => [
          `${platformToChainName.get(platform)}:${address?.toLowerCase()}`,
          {
            id: token.id,
            symbol: token.symbol,
          },
        ]),
    ),
  )

  const transferTopic = utils.id('Transfer(address,address,uint256)')
  const tokenContract = new utils.Interface([
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
  ])
  const existingTokens = loadExistingTokens()
  const processedEscrows = loadProcessedEscrows()
  const tokenListAddresses = new Set(
    tokenList.map(
      (t) => `${chainConverter.toName(t.chainId)}:${t.address?.toLowerCase()}`,
    ),
  )
  const allFoundTokens = new Map<
    string,
    {
      escrows: Map<
        string,
        { balance: number; project: string; preminted?: true }
      >
      coingeckoId?: string
      symbol?: string
    }
  >(
    existingTokens.found.map((t) => [
      t.address?.toLowerCase(),
      {
        escrows: new Map(
          t.escrows.map((e) => [
            e.address,
            {
              balance: e.balance ?? 0,
              project: e.project,
              preminted: e.preminted,
            },
          ]),
        ),
        coingeckoId: t.coingeckoId,
        symbol: t.symbol,
      },
    ]),
  )

  for (const [chain, chainEscrows] of Object.entries(escrowsByChain)) {
    if (!providers.has(chain) || !etherscanClients.has(chain)) {
      console.log(chalk.red(`Skipping unsupported chain: ${chain}`))
      continue
    }

    const provider = providers.get(chain)
    assert(provider, `Provider for chain ${chain} not found`)
    const latestBlock = await provider.getBlockNumber()
    const etherscanClient = etherscanClients.get(chain)
    assert(etherscanClient, `Etherscan client for chain ${chain} not found`)

    for (const escrow of chainEscrows) {
      console.log(
        `Checking logs for escrow: ${escrow.address} - ${chainEscrows.findIndex((e) => e.address === escrow.address) + 1}/${chainEscrows.length} on ${escrow.chain}`,
      )

      const lastProcessedBlock =
        processedEscrows.processed?.[getEscrowKey(chain, escrow.address)] ??
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

      const tokensFromLogs = new Set(
        allLogs.map((l) => `${escrow.chain}:${l.address.toLowerCase()}`),
      )
      for (const tokenFromLog of tokensFromLogs) {
        if (
          coingeckoTokensMap.has(tokenFromLog) &&
          !tokenListAddresses.has(tokenFromLog)
        ) {
          if (!allFoundTokens.has(tokenFromLog)) {
            const tokenInfo = coingeckoTokensMap.get(tokenFromLog)
            allFoundTokens.set(tokenFromLog, {
              escrows: new Map(),
              coingeckoId: tokenInfo?.id,
              symbol: tokenInfo?.symbol,
            })
          }

          const rawAddress = tokenFromLog.split(':')[1]

          try {
            const [balance, decimals] = await Promise.all([
              provider.call({
                to: rawAddress,
                data: tokenContract.encodeFunctionData('balanceOf', [
                  escrow.address,
                ]),
              }),
              provider.call({
                to: rawAddress,
                data: tokenContract.encodeFunctionData('decimals'),
              }),
            ])
            const balanceValue = Number(
              utils.formatUnits(balance, Number(decimals)),
            )
            allFoundTokens.get(tokenFromLog)?.escrows.set(escrow.address, {
              balance: balanceValue,
              project: escrow.projectId,
            })
          } catch {
            console.warn(
              `Failed to get balance for token ${tokenFromLog} in escrow ${escrow.address}`,
            )
            allFoundTokens.get(tokenFromLog)?.escrows.set(escrow.address, {
              balance: 0,
              project: escrow.projectId,
            })
          }
        }
      }

      const dataToSave = Array.from(allFoundTokens.entries()).map(
        ([address, data]) => ({
          address,
          escrows: Array.from(data.escrows.entries()).map(([addr, data]) => ({
            address: addr,
            balance: data.balance,
            project: data.project,
            preminted: data.preminted,
          })),
          coingeckoId: data.coingeckoId,
          symbol: data.symbol,
        }),
      )
      processedEscrows.processed[getEscrowKey(chain, escrow.address)] =
        latestBlock

      writeFileSync(
        OUTPUT_PATH,
        JSON.stringify({ found: dataToSave }, null, 2) + '\n',
      )
      writeFileSync(
        PROCESSED_ESCROWS_PATH,
        JSON.stringify(processedEscrows, null, 2) + '\n',
      )

      console.log('Tokens not found in tokenList:', allFoundTokens.size)
    }
  }

  const chunks = chunk(
    Array.from(allFoundTokens.entries()).map(([address, data]) => ({
      address,
      coingeckoId: data.coingeckoId,
    })),
    100,
  )

  const tokenMarketData = new Map<
    string,
    { marketCap: number; price: number; circulatingSupply: number }
  >()

  // Get market data for tokens
  for (const chunk of chunks) {
    const coingeckoIds = chunk
      .map((t) => t.coingeckoId)
      .filter((id): id is string => id !== undefined)

    const marketData = (await coingeckoClient.query('/coins/markets', {
      vs_currency: 'usd',
      ids: coingeckoIds.join(','),
    })) as Array<{
      id: string
      circulating_supply: number
      market_cap: number
      current_price: number
    }>

    for (const data of marketData) {
      tokenMarketData.set(data.id, {
        marketCap: data.market_cap,
        price: data.current_price,
        circulatingSupply: data.circulating_supply,
      })
    }
  }

  console.log(
    `Filtering out tokens with market cap < ${MIN_MARKET_CAP} or missing value < ${MIN_MISSING_VALUE}...`,
  )
  const sortedTokens = Array.from(allFoundTokens.entries())
    .filter(([address]) => !tokenListAddresses.has(address))
    .map(([address, data]) => {
      assert(data.coingeckoId, `Missing coingeckoId for token ${address}`)
      const marketData = tokenMarketData.get(data.coingeckoId)
      const tokenPrice = marketData?.price ?? 0
      const tokenMcap = marketData?.marketCap ?? 0
      const circulatingSupply = marketData?.circulatingSupply ?? 0

      const escrows = Array.from(data.escrows.entries()).map(([addr, data]) => {
        // Use the smaller value between escrow balance and circulating supply
        const adjustedBalance = Math.min(data.balance, circulatingSupply)
        return {
          address: addr,
          balance: adjustedBalance,
          value: Math.floor(adjustedBalance * tokenPrice),
          project: data.project,
          preminted:
            data.preminted ??
            (data.balance > circulatingSupply ? true : undefined),
        }
      })
      const escrowsBalance = escrows.reduce(
        (sum, escrow) => sum + escrow.balance,
        0,
      )

      return {
        symbol: data.symbol,
        coingeckoId: data.coingeckoId,
        marketCap: Math.floor(tokenMcap),
        circulatingSupply,
        address,
        missingValue: escrows.reduce(
          (sum, escrow) => sum + (escrow.value ?? 0),
          0,
        ),
        exceedsCirculatingSupply:
          escrowsBalance > circulatingSupply ? true : undefined,
        escrows,
      }
    })
    .filter(
      (token) =>
        token.marketCap >= MIN_MARKET_CAP &&
        token.missingValue >= MIN_MISSING_VALUE,
    )
    .sort((a, b) => {
      const missingValueA = a.missingValue ?? 0
      const missingValueB = b.missingValue ?? 0
      return missingValueB - missingValueA
    })
    .map((token) => ({
      ...token,
      marketCap: formatNumberWithCommas(token.marketCap),
      missingValue: formatNumberWithCommas(token.missingValue),
      escrows: token.escrows.map((escrow) => ({
        ...escrow,
        value: formatNumberWithCommas(escrow.value),
      })),
    }))

  console.log(`Saving ${sortedTokens.length} tokens...`)

  writeFileSync(
    OUTPUT_PATH,
    JSON.stringify({ found: sortedTokens }, null, 2) + '\n',
  )
}

main().then(() => {
  console.log('done')
})

function getProvider(chain: string, chains: ChainConfig[]) {
  const env = getEnv()
  const config = chains.find((c) => c.name === chain)
  assert(config, `Unsupported chain: ${chain}`)

  const rpcUrl = env.string([`${config.name.toUpperCase()}_RPC_URL`])
  const callsPerMinute = env.integer(
    [`${config.name.toUpperCase()}_RPC_CALLS_PER_MINUTE`],
    60,
  )
  const rateLimitedProvider = new RateLimitedProvider(
    new providers.JsonRpcProvider(rpcUrl),
    callsPerMinute,
  )
  return rateLimitedProvider
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient({
    apiKey: coingeckoApiKey,
    http,
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    logger: Logger.SILENT,
    retryStrategy: 'SCRIPT',
    sourceName: 'coingeckoAPI',
  })
  return coingeckoClient
}

function getEtherscanClient(chain: string, chains: ChainConfig[]) {
  const env = getEnv()
  const config = chains.find((c) => c.name === chain)

  const api = config?.apis.find(
    (x) =>
      x.type === 'etherscan' ||
      x.type === 'routescan' ||
      x.type === 'blockscout',
  )

  assert(api)

  let clientOptions
  if (api.type === 'etherscan') {
    clientOptions = {
      chain,
      chainId: api.chainId,
      type: api.type,
      url: env.string('ETHERSCAN_API_URL'),
      apiKey: env.string('ETHERSCAN_API_KEY'),
    }
  } else {
    clientOptions = { chain, type: api.type, url: api.url }
  }

  return new BlockIndexerClient(
    new HttpClient(),
    new RateLimiter({ callsPerMinute: 120 }),
    clientOptions,
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
        e.message.includes('query exceeds max block range 100000') ||
        e.message.includes('eth_getLogs is limited to a 10,000 range') ||
        e.message.includes('returned more than 10000'))
    ) {
      const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
      const [a, b] = await Promise.all([
        getAllLogs(provider, topics, fromBlock, midPoint),
        getAllLogs(provider, topics, midPoint + 1, toBlock),
      ])
      return a.concat(b)
    }
    throw e
  }
}
