import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { Token as LegacyToken } from '@l2beat/shared-pure'
import {
  AmountConfig,
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  CirculatingSupplyAmountFormula,
  EscrowToken,
  isEscrowToken,
  PriceConfig,
  Token,
  TotalSupplyAmountFormula,
  TvsConfig,
} from './types'
import { BackendProject, BackendProjectEscrow } from '@l2beat/backend-shared'
import { ChainConfig, tokenList } from '@l2beat/config'

export function mapConfig(
  project: BackendProject,
  chain: ChainConfig,
): TvsConfig {
  const tokens: Map<string, Token> = new Map()

  // map escrows to tokens
  for (const escrow of project.escrows) {
    // TODO - implement support for shared escrows
    if (escrow.sharedEscrow) {
      continue
    }

    for (const legacyToken of escrow.tokens) {
      if (!legacyToken.id.endsWith('native')) {
        assert(
          legacyToken.address,
          `Token address is required ${legacyToken.id}`,
        )
      }

      const existingToken = tokens.get(legacyToken.id)

      if (existingToken) {
        assert(isEscrowToken(existingToken))
        const updatedEscrowToken = updateEscrowToken(existingToken, escrow)
        tokens.set(existingToken.id, updatedEscrowToken)
      } else {
        const token = createToken(legacyToken, project, chain, escrow)
        tokens.set(token.id, token)
      }
    }
  }

  // map totalSupply and circulatingSupply tokens
  const nonZeroSupplyTokens = tokenList.filter(
    (t) => t.supply !== 'zero' && t.chainId === chain.chainId,
  )
  for (const legacyToken of nonZeroSupplyTokens) {
    const token = createToken(legacyToken, project, chain)
    tokens.set(token.id, token)
  }

  return {
    projectId: project.projectId,
    tokens: Array.from(tokens.values()),
  }
}

function updateEscrowToken(
  token: EscrowToken,
  escrow: BackendProjectEscrow,
): Token {
  // add this escrow to tokens esccrows list
  const escrowAddresses = [...token.amount.escrowAddresses, escrow.address]

  let sinceTimestamp = token.sinceTimestamp
  // update sinceTimestamp if needed
  if (escrow.sinceTimestamp.lt(token.sinceTimestamp)) {
    sinceTimestamp = escrow.sinceTimestamp
  }

  let untilTimestamp = token.untilTimestamp
  // reset or update  untilTimestamp if needed
  if (!escrow.untilTimestamp && token.untilTimestamp) {
    untilTimestamp = undefined
  } else if (
    escrow.untilTimestamp &&
    token.untilTimestamp &&
    escrow.untilTimestamp.gt(token.untilTimestamp)
  ) {
    untilTimestamp = escrow.untilTimestamp
  }

  return {
    ...token,
    amount: {
      ...token.amount,
      escrowAddresses,
    },
    sinceTimestamp,
    untilTimestamp,
  }
}

function createToken(
  legacyToken: LegacyToken,
  project: BackendProject,
  chain: ChainConfig,
  escrow?: BackendProjectEscrow,
): Token {
  let amountFormula: AmountFormula
  let sinceTimestamp: UnixTime
  let untilTimestamp: UnixTime | undefined

  switch (legacyToken.supply) {
    case 'zero':
      assert(escrow, 'Escrow is required for zero supply tokens')

      amountFormula = {
        type: 'balanceOfEscrow',
        address: legacyToken.address ?? EthereumAddress.ZERO,
        chain: chain.name,
        escrowAddresses: [escrow.address],
        decimals: legacyToken.decimals,
      } as BalanceOfEscrowAmountFormula

      sinceTimestamp = escrow.sinceTimestamp
      untilTimestamp = escrow.untilTimestamp
      break
    case 'totalSupply':
      assert(
        chain.minTimestampForTvl,
        'Chain with token should have minTimestamp',
      )

      amountFormula = {
        type: 'totalSupply',
        address: legacyToken.address,
        chain: chain.name,
        decimals: legacyToken.decimals,
      } as TotalSupplyAmountFormula

      sinceTimestamp = UnixTime.max(
        chain.minTimestampForTvl,
        legacyToken.sinceTimestamp,
      )
      break
    case 'circulatingSupply':
      assert(
        chain.minTimestampForTvl,
        'Chain with token should have minTimestamp',
      )

      amountFormula = {
        type: 'circulatingSupply',
        ticker: legacyToken.symbol,
      } as CirculatingSupplyAmountFormula

      sinceTimestamp = UnixTime.max(
        chain.minTimestampForTvl,
        legacyToken.sinceTimestamp,
      )
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    id: legacyToken.id,
    ticker: mapCoingeckoIdToTicker(legacyToken.coingeckoId),
    amount: amountFormula,
    sinceTimestamp,
    untilTimestamp,
    category: legacyToken.category,
    source: legacyToken.source,
    isAssociated:
      project.associatedTokens?.includes(legacyToken.symbol) ?? false,
  }
}

export function extractPricesAndAmounts(_config: TvsConfig): {
  prices: PriceConfig[]
  amounts: AmountConfig[]
} {
  throw new Error('Not implemented')
}

export function mapCoingeckoIdToTicker(coingeckoId: string): string {
  const token = tokenList.find((t) => t.coingeckoId === coingeckoId)

  assert(token, `Token not found for coingeckoId ${coingeckoId}`)

  return token.symbol
}
