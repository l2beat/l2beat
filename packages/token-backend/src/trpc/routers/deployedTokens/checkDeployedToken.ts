import type {
  AbstractTokenRecord,
  Database,
  TokenDatabase,
} from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { Address32, type UnixTime } from '@l2beat/shared-pure'
import { Chain } from '../../../chains/Chain'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  buildAliasToChainMap,
  findUnregisteredPlatformTokens,
  platformsToChainAddressPairs,
} from './chainAliases'
import {
  getSuggestionsByPartialTransfersForToken,
  type TransferSuggestion,
} from './getSuggestionsByPartialTransfers'
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
  db: Database,
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
        message: 'Deployed token with given address and chain already exists.',
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

  if (!chainRecord) {
    return {
      error: {
        type: 'chain-not-found' as const,
        message: 'Chain not found.',
      },
      data: undefined,
    }
  }

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

  let partialTransferAbstractTokenSuggestions: AbstractTokenSuggestion[] = []
  try {
    const transferSuggestions = await getSuggestionsByPartialTransfersForToken(
      db,
      tokenDb,
      { chain: input.chain, address: Address32.from(input.address) },
    )
    partialTransferAbstractTokenSuggestions =
      mapTransferSuggestionsToAbstractTokenSuggestions(transferSuggestions)
  } catch (error) {
    console.error(error)
  }

  if (coin === null) {
    return {
      error: {
        type: 'not-found-on-coingecko' as const,
        message: 'Coin not found on Coingecko.',
      },
      data: {
        symbol,
        symbolSource,
        suggestions: undefined,
        decimals,
        deploymentTimestamp,
        abstractTokenId: undefined,
        coingeckoId: undefined,
        abstractTokenSuggestions: partialTransferAbstractTokenSuggestions,
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
      abstractTokenSuggestions:
        abstractToken === undefined
          ? partialTransferAbstractTokenSuggestions
          : [],
    },
  }
}

type AbstractTokenSuggestion = Pick<
  AbstractTokenRecord,
  'id' | 'symbol' | 'issuer'
>

function mapTransferSuggestionsToAbstractTokenSuggestions(
  suggestions: TransferSuggestion[],
): AbstractTokenSuggestion[] {
  return suggestions.map((suggestion) => ({
    id: suggestion.abstractToken.id,
    symbol: suggestion.abstractToken.symbol,
    issuer: suggestion.abstractToken.issuer,
  }))
}
