import { getEnv } from '@l2beat/backend-tools'
import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { AssetId, ChainId, Token } from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { parse, ParseError } from 'jsonc-parser'

import { chains } from '../chains'
import { ChainConfig } from '../common'
import { Output, Source, SourceEntry } from './types'
import { getCoingeckoId } from './utils/getCoingeckoId'
import { getTokenInfo } from './utils/getTokenInfo'
import { ScriptLogger } from './utils/ScriptLogger'

const SOURCE_FILE_PATH = './src/tokens/tokens.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/generated.json'

async function main() {
  const logger = new ScriptLogger({})
  const coingeckoClient = getCoingeckoClient()
  const source = getSourceFile(logger)
  const output = getOutputFile(logger)
  const result: Token[] = []

  for (const [devId, tokens] of Object.entries(source)) {
    const chainLogger = logger.prefix(devId)
    const chain = getChainConfiguration(chainLogger, devId)
    const chainId = getChainId(chainLogger, chain)

    chainLogger.processing()

    for (const token of tokens) {
      const tokenLogger: ScriptLogger = chainLogger.addMetadata(token.symbol)

      const type = getType(tokenLogger, devId, token)
      const formula = getFormula(tokenLogger, devId, token)
      const category = token.category ?? 'other'

      const existingToken = findTokenInOutput(output, chainId, token)

      if (existingToken) {
        tokenLogger.skipping()
        result.push({
          ...existingToken,
          category,
          type,
          formula,
        })
        continue
      }

      tokenLogger.processing()

      const info = await fetchTokenInfo(
        tokenLogger,
        coingeckoClient,
        chain,
        token,
      )

      const assetId = getAssetId(chain, token, info.name)

      result.push({
        id: assetId,
        chainId,
        address: token.address,
        symbol: token.symbol,
        name: info.name,
        decimals: info.decimals,
        coingeckoId: info.coingeckoId,
        sinceTimestamp: info.sinceTimestamp,
        iconUrl: info.iconUrl,
        category,
        type,
        formula,
      })

      tokenLogger.processed()
    }

    chainLogger.processed()
  }

  const sorted = sortByChainAndSymbol(result)
  logger.success('\nSorted ', 'tokens by chain and name')

  saveResults(sorted)
  logger.success('\nSaved ', 'output file')
}

function getSourceFile(logger: ScriptLogger) {
  logger.notify('Loading... ', 'source file')

  const sourceFile = readFileSync(SOURCE_FILE_PATH, 'utf-8')
  const errors: ParseError[] = []
  const parsed = parse(sourceFile, errors, {
    allowTrailingComma: true,
  }) as Record<string, string>
  logger.assert(errors.length === 0, 'Cannot parse source.jsonc')
  const source = Source.parse(parsed)

  logger.success('Loaded ', 'source file')

  return source
}

function getOutputFile(logger: ScriptLogger) {
  logger.notify('Loading... ', 'output file')

  const outputFile = readFileSync(OUTPUT_FILE_PATH, 'utf-8')
  const output = Output.parse(JSON.parse(outputFile))

  logger.success('Loaded ', 'output file')

  return output
}

function getCoingeckoClient() {
  const env = getEnv()
  const coingeckoApiKey = env.optionalString('COINGECKO_API_KEY')
  const http = new HttpClient()
  const coingeckoClient = new CoingeckoClient(http, coingeckoApiKey)
  return coingeckoClient
}

function getChainConfiguration(logger: ScriptLogger, devId: string) {
  const chain = chains.find((c) => c.devId === devId.replaceAll('-', '')) // handle manta pacific case
  logger.assert(chain !== undefined, `Configuration not found, TODO add readme`)
  return chain
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

function getType(tokenLogger: ScriptLogger, devId: string, entry: SourceEntry) {
  const type = devId === 'ethereum' ? 'CBV' : entry.type
  tokenLogger.assert(type !== undefined, `Missing type`)
  return type
}

function getFormula(
  tokenLogger: ScriptLogger,
  devId: string,
  entry: SourceEntry,
) {
  const formula = devId === 'ethereum' ? 'locked' : entry.formula
  tokenLogger.assert(formula !== undefined, `Missing formula`)
  return formula
}

function getAssetId(chain: ChainConfig, token: SourceEntry, name: string) {
  return AssetId(
    `${chain.devId}:${token.symbol.replaceAll(' ', '-').toLowerCase()}-${name
      .replaceAll(' ', '-')
      .toLowerCase()}`,
  )
}

function sortByChainAndSymbol(result: Token[]) {
  return result.sort((a, b) => {
    if (a.chainId !== b.chainId) {
      return Number(a.chainId) - Number(b.chainId)
    }
    return a.name.localeCompare(b.name)
  })
}

function saveResults(result: Token[]) {
  const comment = 'This file was autogenerated. Please do not edit it manually.'
  const outputJson = JSON.stringify(
    {
      comment: comment,
      tokens: result,
    },
    null,
    2,
  )
  writeFileSync(OUTPUT_FILE_PATH, outputJson + '\n')
}

function findTokenInOutput(
  output: Output,
  chainId: ChainId | undefined,
  entry: SourceEntry,
) {
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
  chain: ChainConfig,
  entry: SourceEntry,
) {
  logger.assert(
    entry.address !== undefined,
    `Native asset detected - configure manually`,
  )

  const coingeckoId =
    entry.coingeckoId ??
    (await getCoingeckoId(
      coingeckoClient,
      logger,
      entry.address,
      chain.coingeckoPlatform,
    ))

  const env = getEnv()
  const rpcUrl = env.optionalString(`${chain.devId.toUpperCase()}_RPC_URL`)
  logger.assert(
    rpcUrl !== undefined,
    `Missing environmental variable: ${chain.devId.toUpperCase()}_RPC_URL`,
  )
  const provider = new providers.JsonRpcProvider(rpcUrl)

  const tokenInfo = await getTokenInfo(
    logger,
    provider,
    coingeckoClient,
    entry.address,
    entry.symbol,
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

main().catch((e: unknown) => {
  console.error(e)
})
