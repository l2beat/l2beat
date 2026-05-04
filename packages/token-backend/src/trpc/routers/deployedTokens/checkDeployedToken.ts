import type {
  AbstractTokenRecord,
  Database,
  TokenDatabase,
} from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import { Address32, type UnixTime } from '@l2beat/shared-pure'
import { Chain } from '../../../chains/Chain'
import type { CoingeckoClient } from '../../../chains/clients/coingecko/CoingeckoClient'
import { getDeploymentTimestampFromRpc } from '../../../chains/clients/rpc/getDeploymentTimestampFromRpc'
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

  const contractCodeStatus = await fetchContractCodeStatus(chain, input.address)
  warnings.push(...contractCodeStatus.warnings)
  if (contractCodeStatus.isContract === false) {
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

  const [metadata, deploymentTimestampResult] = await Promise.all([
    fetchTokenMetadata(chain, input.address),
    fetchDeploymentTimestamp(chain, input.address),
  ])
  warnings.push(...metadata.warnings, ...deploymentTimestampResult.warnings)

  const { decimals, symbol, symbolSource } = metadata
  const { deploymentTimestamp } = deploymentTimestampResult

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

async function fetchTokenMetadata(
  chain: Chain,
  address: string,
): Promise<{
  decimals: number | undefined
  symbol: string | undefined
  symbolSource: 'rpc' | undefined
  warnings: AutofillWarning[]
}> {
  if (!chain.rpc) {
    return {
      decimals: undefined,
      symbol: undefined,
      symbolSource: undefined,
      warnings: [
        {
          field: 'decimals',
          message: `No RPC configured for ${chain.name}, so decimals were not autofilled.`,
        },
        {
          field: 'symbol',
          message: `No RPC configured for ${chain.name}, so symbol was not autofilled.`,
        },
      ],
    }
  }

  const warnings: AutofillWarning[] = []
  const [decimalsResult, symbolResult] = await Promise.allSettled([
    chain.rpc.getDecimals(address),
    chain.rpc.getSymbol(address),
  ])

  const decimals =
    decimalsResult.status === 'fulfilled' ? decimalsResult.value : undefined
  if (decimalsResult.status === 'rejected') {
    warnings.push({
      field: 'decimals',
      message: `RPC decimals lookup failed: ${formatError(decimalsResult.reason)}.`,
    })
  }

  const symbol =
    symbolResult.status === 'fulfilled' ? symbolResult.value : undefined
  if (symbolResult.status === 'rejected') {
    warnings.push({
      field: 'symbol',
      message: `RPC symbol lookup failed: ${formatError(symbolResult.reason)}.`,
    })
  }

  return {
    decimals,
    symbol,
    symbolSource: symbol ? 'rpc' : undefined,
    warnings,
  }
}

async function fetchDeploymentTimestamp(
  chain: Chain,
  address: string,
): Promise<{
  deploymentTimestamp: UnixTime | undefined
  warnings: AutofillWarning[]
}> {
  const failureMessages: string[] = []

  if (chain.etherscan) {
    try {
      const contractCreation =
        await chain.etherscan.getContractCreation(address)
      if (!contractCreation[0]) {
        throw new Error('contract creation response was empty')
      }
      if (contractCreation[0].timestamp === undefined) {
        throw new Error('contract creation timestamp was empty')
      }
      return {
        deploymentTimestamp: contractCreation[0].timestamp,
        warnings: [],
      }
    } catch (error) {
      failureMessages.push(`Etherscan lookup failed: ${formatError(error)}.`)
    }
  }

  if (chain.blockscout) {
    try {
      const contractCreation =
        await chain.blockscout.getContractCreation(address)
      if (!contractCreation[0]) {
        throw new Error('contract creation response was empty')
      }
      const txHash = contractCreation[0].txHash
      const txInfo = await chain.blockscout.getTransactionInfo(txHash)
      if (txInfo.timeStamp === undefined) {
        throw new Error('transaction timestamp was empty')
      }
      return { deploymentTimestamp: txInfo.timeStamp, warnings: [] }
    } catch (error) {
      failureMessages.push(`Blockscout lookup failed: ${formatError(error)}.`)
    }
  }

  if (chain.rpc) {
    try {
      const deploymentTimestamp = await getDeploymentTimestampFromRpc(
        chain.rpc,
        address,
      )
      if (deploymentTimestamp !== undefined) {
        return {
          deploymentTimestamp,
          warnings: [],
        }
      }
      failureMessages.push('RPC lookup returned no value.')
    } catch (error) {
      failureMessages.push(`RPC lookup failed: ${formatError(error)}.`)
    }
  }

  const message =
    failureMessages.length > 0
      ? failureMessages.join(' ')
      : `No Etherscan, Blockscout, or RPC configured for ${chain.name}.`

  return {
    deploymentTimestamp: undefined,
    warnings: [
      {
        field: 'deploymentTimestamp',
        message: `${message} Deployment timestamp was not autofilled.`,
      },
    ],
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

async function fetchContractCodeStatus(
  chain: Chain,
  address: string,
): Promise<{
  isContract: boolean | undefined
  warnings: AutofillWarning[]
}> {
  if (!chain.rpc) {
    return { isContract: undefined, warnings: [] }
  }

  try {
    const code = await chain.rpc.getCode(address, 'latest')
    return { isContract: code !== '0x', warnings: [] }
  } catch (error) {
    return {
      isContract: undefined,
      warnings: [
        {
          field: 'contractCode',
          message: `RPC contract code lookup failed: ${formatError(error)}.`,
        },
      ],
    }
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

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
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
