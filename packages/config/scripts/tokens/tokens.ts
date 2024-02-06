import { getEnv } from '@l2beat/backend-tools'
import {
  CoingeckoClient,
  CoinListPlatformEntry,
  HttpClient,
} from '@l2beat/shared'
import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  Token,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { chains } from '../../src'
import { ChainConfig } from '../../src/common'
import { Output, SourceEntry } from '../../src/tokens/types'
import {
  readGeneratedFile,
  readTokensFile,
  saveResults,
} from './utils/fsIntegration'
import { getCoingeckoId } from './utils/getCoingeckoId'
import { getTokenInfo } from './utils/getTokenInfo'
import { ScriptLogger } from './utils/ScriptLogger'

main().catch((e: unknown) => {
  console.error(e)
})

async function main() {
  const logger = new ScriptLogger({})
  logger.notify('Running tokens script...\n')
  const coingeckoClient = getCoingeckoClient()
  let coinList: CoinListPlatformEntry[] | undefined = undefined
  const source = readTokensFile(logger)
  const output = readGeneratedFile(logger)
  const result: Token[] = []

  for (const [chain, tokens] of Object.entries(source)) {
    const chainLogger = logger.prefix(chain)
    const chainConfig = getChainConfiguration(chainLogger, chain)
    const chainId = getChainId(chainLogger, chainConfig)

    for (const token of tokens) {
      const tokenLogger: ScriptLogger = chainLogger.addMetadata(token.symbol)

      const type = getType(tokenLogger, chain, token)
      const formula = getFormula(tokenLogger, chain, token)
      const category = token.category ?? 'other'

      const existingToken = findTokenInOutput(output, chainId, token)

      if (existingToken) {
        const overrides = {
          coingeckoId: token.coingeckoId ?? existingToken.coingeckoId,
          category,
          type,
          formula,
        }
        for (const [key, value] of Object.entries(overrides)) {
          const existing = existingToken[key as keyof typeof existingToken]
          if (value !== existing) {
            tokenLogger.overriding(
              key,
              'from',
              existing?.toString() ?? 'undefined',
              'to',
              value.toString(),
            )
          }
        }
        const bridgedUsing = token.bridgedUsing ?? existingToken.bridgedUsing
        if (
          existingToken.bridgedUsing?.bridge !== bridgedUsing?.bridge ||
          existingToken.bridgedUsing?.slug !== bridgedUsing?.slug
        ) {
          tokenLogger.overriding(
            'bridgedUsing',
            'from',
            JSON.stringify(existingToken.bridgedUsing ?? 'undefined'),
            'to',
            JSON.stringify(bridgedUsing ?? 'undefined'),
          )
        }

        result.push({ ...existingToken, ...overrides, bridgedUsing })
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
      )

      const assetId = getAssetId(chainConfig, token, info.name)

      result.push({
        id: assetId,
        name: info.name,
        coingeckoId: info.coingeckoId,
        address: token.address,
        symbol: token.symbol,
        decimals: info.decimals,
        sinceTimestamp: info.sinceTimestamp,
        category,
        iconUrl: info.iconUrl,
        chainId,
        type,
        formula,
        bridgedUsing: token.bridgedUsing,
      })

      tokenLogger.processed()
    }
  }

  const sorted = sortByChainAndName(result)
  saveResults(sorted)
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  return coingeckoClient
}

function getChainConfiguration(logger: ScriptLogger, chain: string) {
  const chainConfig = chains.find((c) => c.name === chain)
  logger.assert(
    chainConfig !== undefined,
    `Configuration not found, add chain configuration to project .ts file`,
  )
  return chainConfig
}

function getChainId(logger: ScriptLogger, chain: ChainConfig) {
  let chainId: ChainId | undefined = undefined
  try {
    chainId = ChainId(chain.chainId)
  } catch (e) {
    logger.assert(false, `ChainId not found for`)
  }
  return chainId
}

function getType(tokenLogger: ScriptLogger, chain: string, entry: SourceEntry) {
  const type = chain === 'ethereum' ? 'CBV' : entry.type
  tokenLogger.assert(type !== undefined, `Missing type`)
  return type
}

function getFormula(
  tokenLogger: ScriptLogger,
  chain: string,
  entry: SourceEntry,
) {
  const formula = chain === 'ethereum' ? 'locked' : entry.formula
  tokenLogger.assert(formula !== undefined, `Missing formula`)
  return formula
}

function getAssetId(chain: ChainConfig, token: SourceEntry, name: string) {
  const chainPrefix = chain.name === 'ethereum' ? '' : `${chain.name}:`

  return AssetId(
    `${chainPrefix}${token.symbol.replaceAll(' ', '-').toLowerCase()}-${name
      .replaceAll(' ', '-')
      .toLowerCase()}`,
  )
}

function sortByChainAndName(result: Token[]) {
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
): Token | undefined {
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
  )

  return {
    name: tokenInfo.name,
    coingeckoId: tokenInfo.coingeckoId,
    decimals: tokenInfo.decimals,
    sinceTimestamp: tokenInfo.sinceTimestamp,
    iconUrl: tokenInfo.iconUrl,
  }
}
