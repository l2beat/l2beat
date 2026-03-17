import type { AbstractTokenRecord, TokenDatabase } from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import { Chain } from '../../../chains/Chain'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  findUnregisteredPlatformTokens,
  platformsToChainAddressPairs,
} from './chainAliases'
import type { DeployedTokensRouterDeps } from './types'

async function fetchTokenMetadata(
  chain: Chain,
  address: string,
): Promise<{
  decimals: number | undefined
  symbol: string | undefined
  symbolSource: 'rpc' | undefined
}> {
  if (!chain.rpc) {
    return { decimals: undefined, symbol: undefined, symbolSource: undefined }
  }
  try {
    const [decimals, symbol] = await Promise.all([
      chain.rpc.getDecimals(address),
      chain.rpc.getSymbol(address),
    ])
    return { decimals, symbol, symbolSource: 'rpc' }
  } catch (error) {
    console.error(error)
    return { decimals: undefined, symbol: undefined, symbolSource: undefined }
  }
}

async function fetchDeploymentTimestamp(
  chain: Chain,
  address: string,
): Promise<UnixTime | undefined> {
  if (chain.etherscan) {
    try {
      const contractCreation =
        await chain.etherscan.getContractCreation(address)
      return contractCreation[0].timestamp
    } catch (error) {
      console.error(error)
    }
  }

  if (chain.blockscout) {
    try {
      const contractCreation =
        await chain.blockscout.getContractCreation(address)
      const txHash = contractCreation[0].txHash
      const txInfo = await chain.blockscout.getTransactionInfo(txHash)
      return txInfo.timeStamp
    } catch (error) {
      console.error(error)
    }
  }

  return undefined
}

async function getCoinByChainAndAddress(
  coingeckoClient: CoingeckoClient,
  db: TokenDatabase,
  chain: string,
  address: string,
) {
  const data = await coingeckoClient.getCoinList({ includePlatform: true })
  const chains = await db.chain.getAll()

  const chainToAliases = new Map(
    chains.map((c) => [c.name, [c.name, ...(c.aliases ?? [])]]),
  )

  const aliases = chainToAliases.get(chain)
  if (!aliases) return null

  const coin = data.find((c) =>
    aliases.some(
      (alias) => c.platforms[alias]?.toLowerCase() === address.toLowerCase(),
    ),
  )
  if (!coin) return null

  const aliasToChain = buildAliasToChainMap(chains)
  const chainAddressPairs = platformsToChainAddressPairs(
    coin.platforms,
    aliasToChain,
  )

  const deployedTokens =
    await db.deployedToken.getByChainsAndAddresses(chainAddressPairs)

  const suggestions = findUnregisteredPlatformTokens(
    coin.platforms,
    deployedTokens,
    aliasToChain,
    chain,
  )

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    suggestions,
  }
}

export async function checkDeployedToken(
  deps: DeployedTokensRouterDeps,
  tokenDb: TokenDatabase,
  input: { chain: string; address: string },
) {
  const {
    coingeckoClient,
    createChain = (chainRecord: ChainRecord) =>
      new Chain(chainRecord, {
        etherscanApiKey: deps.etherscanApiKey,
      }),
  } = deps

  const result = await tokenDb.deployedToken.findByChainAndAddress({
    chain: input.chain,
    address: input.address,
  })
  if (result !== undefined) {
    return {
      error: {
        type: 'already-exists' as const,
        message: 'Deployed token with given address and chain already exists',
      },
      data: undefined,
    }
  }
  if (!input.address.startsWith('0x')) {
    return {
      error: undefined,
      data: undefined,
    }
  }

  const chainRecord = await tokenDb.chain.findByName(input.chain)
  assert(chainRecord, 'Chain not found')

  const chain = createChain(chainRecord)

  const [metadata, deploymentTimestamp] = await Promise.all([
    fetchTokenMetadata(chain, input.address),
    fetchDeploymentTimestamp(chain, input.address),
  ])

  const { decimals, symbol, symbolSource } = metadata

  const coin = await getCoinByChainAndAddress(
    coingeckoClient,
    tokenDb,
    input.chain,
    input.address,
  )
  if (coin === null) {
    let abstractTokenSuggestions: AbstractTokenSuggestion[] | undefined
    if (symbol) {
      const allAbstractTokens = await tokenDb.abstractToken.getAll()
      abstractTokenSuggestions = findSimilarAbstractTokens(
        symbol,
        allAbstractTokens,
        5,
      )
    }

    return {
      error: {
        type: 'not-found-on-coingecko' as const,
        message: 'Coin not found on Coingecko',
      },
      data: {
        symbol,
        symbolSource,
        suggestions: undefined,
        decimals,
        deploymentTimestamp,
        abstractTokenId: undefined,
        coingeckoId: undefined,
        abstractTokenSuggestions,
      },
    }
  }

  const abstractToken = coin.id
    ? await tokenDb.abstractToken.findByCoingeckoId(coin.id)
    : undefined

  return {
    error: undefined,
    data: {
      symbol: symbol ?? coin.symbol,
      symbolSource: symbolSource ?? 'coingecko',
      decimals,
      deploymentTimestamp,
      abstractTokenId: abstractToken?.id,
      suggestions: coin.suggestions,
      coingeckoId: coin.id,
      abstractTokenSuggestions: undefined,
    },
  }
}

type AbstractTokenSuggestion = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer'
>
function findSimilarAbstractTokens(
  deployedSymbol: string,
  abstractTokens: AbstractTokenRecord[],
  limit: number,
): AbstractTokenSuggestion[] {
  // Forward: deployed symbol as query against abstract token symbols
  // Handles exact matches and when deployed symbol is shorter
  const forward = fuzzysort.go(deployedSymbol, abstractTokens, {
    key: (e) => e.symbol,
    limit,
  })

  // Reverse: each abstract symbol as query against deployed symbol
  // Handles cases like USDC.e -> USDC where deployed symbol has a suffix
  // or WETH -> ETH where deployed symbol has a prefix
  const reverse = abstractTokens
    .map((t) => {
      const result = fuzzysort.single(t.symbol, deployedSymbol)
      if (result === null) return undefined
      return {
        token: t,
        result,
      }
    })
    .filter((x) => x !== undefined)
    .sort((a, b) => b.result.score - a.result.score)
    .slice(0, limit)

  // Merge and deduplicate, preferring higher scores
  const seen = new Map<
    string,
    { token: (typeof abstractTokens)[number]; score: number }
  >()
  for (const r of forward) {
    seen.set(r.obj.id, { token: r.obj, score: r.score })
  }
  for (const r of reverse) {
    const existing = seen.get(r.token.id)
    if (!existing || r.result.score > existing.score) {
      seen.set(r.token.id, { token: r.token, score: r.result.score })
    }
  }

  return [...seen.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => ({
      id: r.token.id,
      symbol: r.token.symbol,
      issuer: r.token.issuer,
    }))
}
