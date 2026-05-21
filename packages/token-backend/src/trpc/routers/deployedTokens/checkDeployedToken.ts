import type {
  AbstractTokenRecord,
  Database,
  TokenDatabase,
} from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { Address32 } from '@l2beat/shared-pure'
import { Chain } from '../../../chains/Chain'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import {
  fetchDeployedTokenFacts,
  formatError,
} from '../../../chains/fetchDeployedTokenFacts'
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
      warnings: [],
    }
  }
  if (!input.address.startsWith('0x')) {
    return {
      error: undefined,
      data: undefined,
      warnings: [],
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
      warnings: [],
    }
  }

  const chain = createChain(chainRecord)

  const warnings: AutofillWarning[] = []

  const facts = await fetchDeployedTokenFacts(chain, input.address)
  warnings.push(...facts.warnings)
  if (facts.isContract === false) {
    return {
      error: {
        type: 'not-a-token' as const,
        message:
          'Address does not point to a deployed contract on this chain, so it cannot be a token.',
      },
      data: undefined,
      warnings,
    }
  }

  const { decimals, symbol, symbolSource, deploymentTimestamp } = facts

  const coinResult = await getCoinByChainAndAddress(
    coingeckoClient,
    tokenDb,
    input.chain,
    input.address,
  )
  warnings.push(...coinResult.warnings)
  const coin = coinResult.coin

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
    warnings.push({
      field: 'abstractTokenSuggestions',
      message: `Partial transfer suggestion lookup failed: ${formatError(error)}.`,
    })
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
      warnings,
    }
  }

  const abstractToken = coin.id
    ? await tokenDb.abstractToken.findByCoingeckoId(coin.id)
    : undefined
  if (!abstractToken) {
    warnings.push({
      field: 'abstractTokenId',
      message: `No abstract token found with CoinGecko id ${coin.id}.`,
    })
  }

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
    warnings: filterWarningsForAutofilledFields(warnings, {
      symbol: symbol ?? coin.symbol,
    }),
  }
}

async function getCoinByChainAndAddress(
  coingeckoClient: CoingeckoClient,
  db: TokenDatabase,
  chain: string,
  address: string,
): Promise<{
  coin: {
    id: string
    name: string
    symbol: string
    suggestions: ReturnType<typeof findUnregisteredPlatformTokens>
  } | null
  warnings: AutofillWarning[]
}> {
  const data = await coingeckoClient.getCoinList({ includePlatform: true })
  const chains = await db.chain.getAll()
  const coingeckoWarning = (message: string): AutofillWarning => ({
    field: 'coingeckoId',
    message,
  })

  const chainToAliases = new Map(
    chains.map((c) => [c.name, [c.name, ...(c.aliases ?? [])]]),
  )

  const aliases = chainToAliases.get(chain)
  if (!aliases) {
    return {
      coin: null,
      warnings: [
        coingeckoWarning(
          `Chain ${chain} was not present in the chain alias list, so CoinGecko lookup was skipped.`,
        ),
      ],
    }
  }

  const coin = data.find((c) =>
    aliases.some(
      (alias) => c.platforms[alias]?.toLowerCase() === address.toLowerCase(),
    ),
  )
  if (!coin) {
    return {
      coin: null,
      warnings: [
        coingeckoWarning(
          `CoinGecko did not return a coin with ${chain} platform address ${address}.`,
        ),
      ],
    }
  }

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
    coin: {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      suggestions,
    },
    warnings: [],
  }
}

type AutofillWarning = {
  field:
    | 'symbol'
    | 'decimals'
    | 'deploymentTimestamp'
    | 'coingeckoId'
    | 'abstractTokenId'
    | 'abstractTokenSuggestions'
    | 'contractCode'
  message: string
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

function filterWarningsForAutofilledFields(
  warnings: AutofillWarning[],
  values: { symbol: string | undefined },
): AutofillWarning[] {
  return warnings.filter((warning) => {
    if (warning.field === 'symbol' && values.symbol !== undefined) {
      return false
    }
    return true
  })
}
