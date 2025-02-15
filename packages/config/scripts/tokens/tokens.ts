import { Logger, getEnv } from '@l2beat/backend-tools'
import {
  type CoinListPlatformEntry,
  CoingeckoClient,
  HttpClient,
} from '@l2beat/shared'
import {
  AssetId,
  ChainConverter,
  ChainId,
  type CoingeckoId,
  type EthereumAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { isEqual } from 'lodash'
import { ProjectService } from '../../src'
import type {
  GeneratedToken,
  Output,
  SourceEntry,
} from '../../src/tokens/types'
import type { ChainConfig } from '../../src/types'
import { ScriptLogger } from './utils/ScriptLogger'
import {
  readGeneratedFile,
  readTokensFile,
  saveResults,
} from './utils/fsIntegration'
import { getCoingeckoId } from './utils/getCoingeckoId'
import { getTokenInfo } from './utils/getTokenInfo'

main().catch((e: unknown) => {
  console.error(e)
})

// TODO:
// - load all generated into result and save result every time
async function main() {
  const logger: ScriptLogger = new ScriptLogger({})
  logger.notify('Running tokens script...\n')
  const coingeckoClient = getCoingeckoClient()
  let coinList: CoinListPlatformEntry[] | undefined = undefined
  const sourceToken = readTokensFile(logger)
  const output = readGeneratedFile(logger)
  const result: GeneratedToken[] = output.tokens

  const ps = new ProjectService()
  const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
    (x) => x.chainConfig,
  )

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )

  function saveToken(token: GeneratedToken) {
    const index = result.findIndex(
      (t) =>
        AssetId.create(chainConverter.toName(t.chainId), t.address) ===
        AssetId.create(chainConverter.toName(token.chainId), token.address),
    )

    if (index === -1) {
      result.push(token)
    } else {
      result[index] = token
    }

    const sorted = sortByChainAndName(result)
    saveResults(sorted)
  }

  for (const [chain, tokens] of Object.entries(sourceToken)) {
    const chainLogger = logger.prefix(chain)
    const chainConfig = chains.find((c) => c.name === chain)
    logger.assert(
      chainConfig !== undefined,
      `Configuration not found, add chain configuration to project .ts file`,
    )
    const chainId = getChainId(chainLogger, chainConfig)

    for (const token of tokens) {
      const tokenLogger: ScriptLogger = chainLogger.addMetadata(token.symbol)

      const source = getSource(tokenLogger, chain, token)
      const supply = getSupply(tokenLogger, chain, token)
      const category = token.category ?? 'other'

      const existingToken = findTokenInOutput(output, chainId, token)

      if (existingToken) {
        const overrides = {
          coingeckoId: token.coingeckoId ?? existingToken.coingeckoId,
          category,
          source,
          supply,
          excludeFromTotal: token.excludeFromTotal,
        }
        for (const [key, value] of Object.entries(overrides)) {
          const existing = existingToken[key as keyof typeof existingToken]
          if (value !== existing) {
            tokenLogger.overriding(
              key,
              'from',
              existing?.toString() ?? 'undefined',
              'to',
              value?.toString() ?? 'undefined',
            )
          }
        }
        const bridgedUsing = token.bridgedUsing ?? existingToken.bridgedUsing
        if (
          !isEqual(
            existingToken.bridgedUsing?.bridges,
            bridgedUsing?.bridges,
          ) ||
          existingToken.bridgedUsing?.warning !== bridgedUsing?.warning
        ) {
          tokenLogger.overriding(
            'bridgedUsing',
            'from',
            JSON.stringify(existingToken.bridgedUsing ?? 'undefined'),
            'to',
            JSON.stringify(bridgedUsing ?? 'undefined'),
          )
        }

        saveToken({ ...existingToken, ...overrides, bridgedUsing })
        continue
      }

      tokenLogger.assert(
        token.address !== undefined,
        `Native asset detected - configure manually`,
      )
      console.log()
      tokenLogger.processing()

      if (coinList === undefined) {
        coinList = await coingeckoClient.getCoinList({
          includePlatform: true,
        })
      }

      const coingeckoId =
        token.coingeckoId ??
        getCoingeckoId(
          logger,
          coinList,
          chainConfig.coingeckoPlatform,
          token.address,
        )

      const info = await fetchTokenInfo(
        tokenLogger,
        coingeckoClient,
        coingeckoId,
        chainConfig,
        token.address,
        token.symbol,
        token.deploymentTimestamp,
      )

      saveToken({
        name: info.name,
        coingeckoId: info.coingeckoId,
        address: token.address,
        symbol: token.symbol,
        decimals: info.decimals,
        deploymentTimestamp: info.deploymentTimestamp,
        coingeckoListingTimestamp: info.coingeckoListingTimestamp,
        category,
        iconUrl: info.iconUrl,
        chainId,
        source,
        supply,
        bridgedUsing: token.bridgedUsing,
        excludeFromTotal: token.excludeFromTotal,
      })

      tokenLogger.processed()
    }
  }
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient({
    http,
    retryStrategy: 'SCRIPT',
    callsPerMinute: coingeckoApiKey ? 400 : 10,
    sourceName: 'coingeckoAPI',
    apiKey: coingeckoApiKey,
    logger: Logger.WARN,
  })
  return coingeckoClient
}

function getChainId(logger: ScriptLogger, chain: ChainConfig) {
  let chainId: ChainId | undefined = undefined
  try {
    chainId = ChainId(chain.chainId)
  } catch {
    logger.assert(false, `ChainId not found for`)
  }
  return chainId
}

function getSource(
  tokenLogger: ScriptLogger,
  chain: string,
  entry: SourceEntry,
) {
  const type = chain === 'ethereum' ? 'canonical' : entry.source
  tokenLogger.assert(type !== undefined, `Missing type`)
  return type
}

function getSupply(
  tokenLogger: ScriptLogger,
  chain: string,
  entry: SourceEntry,
) {
  const formula = chain === 'ethereum' ? 'zero' : entry.supply
  tokenLogger.assert(formula !== undefined, `Missing formula`)
  return formula
}

function sortByChainAndName(result: GeneratedToken[]) {
  return result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
  })
}

function findTokenInOutput(
  output: Output,
  chainId: ChainId | undefined,
  entry: SourceEntry,
): GeneratedToken | undefined {
  return output.tokens.find((e) => {
    if (chainId !== e.chainId) {
      return false
    }
    if (!e.address) {
      return e.symbol === entry.symbol
    }
    return e.address === entry.address
  })
}

async function fetchTokenInfo(
  logger: ScriptLogger,
  coingeckoClient: CoingeckoClient,
  coingeckoId: CoingeckoId,
  chain: ChainConfig,
  address: EthereumAddress,
  symbol: string,
  deploymentTimestampOverride?: UnixTime,
) {
  const env = getEnv()
  const rpcUrl = env.optionalString(`${chain.name.toUpperCase()}_RPC_URL`)
  logger.assert(
    rpcUrl !== undefined,
    `Missing environmental variable: ${chain.name.toUpperCase()}_RPC_URL`,
  )
  const provider = new providers.JsonRpcProvider(rpcUrl)

  const tokenInfo = await getTokenInfo(
    logger,
    provider,
    coingeckoClient,
    address,
    symbol,
    coingeckoId,
    deploymentTimestampOverride,
  )

  return {
    name: tokenInfo.name,
    coingeckoId: tokenInfo.coingeckoId,
    decimals: tokenInfo.decimals,
    deploymentTimestamp: tokenInfo.deploymentTimestamp,
    coingeckoListingTimestamp: tokenInfo.coingeckoListingTimestamp,
    iconUrl: tokenInfo.iconUrl,
  }
}
