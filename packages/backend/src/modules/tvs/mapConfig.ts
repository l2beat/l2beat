import { BackendProject, BackendProjectEscrow, tokenList } from '@l2beat/config'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { Token as LegacyToken } from '@l2beat/shared-pure'
import {
  AmountConfig,
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  CirculatingSupplyAmountFormula,
  PriceConfig,
  Token,
  TotalSupplyAmountFormula,
  TvsConfig,
} from './types'

export function mapConfig(project: BackendProject, chain: string): TvsConfig {
  const tokens: Map<string, Token> = new Map()

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

      const exisitingToken = tokens.get(legacyToken.id)

      if (exisitingToken) {
        updateToken(exisitingToken, escrow)
      } else {
        const token = createToken(legacyToken, escrow, project, chain)
        tokens.set(token.id, token)
      }
    }
  }

  return {
    projectId: project.projectId,
    tokens: Array.from(tokens.values()),
  }
}

function updateToken(token: Token, escrow: BackendProjectEscrow) {
  const amountFormula = token.amount as BalanceOfEscrowAmountFormula

  // add escrow to the amount formula
  amountFormula.escrowAddresses.push(escrow.address)

  // update sinceTimestamp if needed
  if (escrow.sinceTimestamp < token.sinceTimestamp) {
    token.sinceTimestamp = escrow.sinceTimestamp
  }

  // reset or update  untilTimestamp if needed
  if (!escrow.untilTimestamp && token.untilTimestamp) {
    token.untilTimestamp = undefined
  } else if (
    escrow.untilTimestamp &&
    token.untilTimestamp &&
    escrow.untilTimestamp > token.untilTimestamp
  ) {
    token.untilTimestamp = escrow.untilTimestamp
  }
}

function createToken(
  legacyToken: LegacyToken,
  escrow: BackendProjectEscrow,
  project: BackendProject,
  chain: string,
): Token {
  let amountFormula: AmountFormula

  switch (legacyToken.supply) {
    case 'zero':
      amountFormula = {
        type: 'balanceOfEscrow',
        address: legacyToken.address ?? EthereumAddress.ZERO,
        chain,
        escrowAddresses: [escrow.address],
        decimals: legacyToken.decimals,
      } as BalanceOfEscrowAmountFormula
      break
    case 'totalSupply':
      amountFormula = {
        type: 'totalSupply',
        address: legacyToken.address,
        chain,
        decimals: legacyToken.decimals,
      } as TotalSupplyAmountFormula
      break
    case 'circulatingSupply':
      amountFormula = {
        type: 'circulatingSupply',
        ticker: legacyToken.symbol,
      } as CirculatingSupplyAmountFormula
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    id: legacyToken.id,
    ticker: mapCoingeckoIdToTicker(legacyToken.coingeckoId),
    amount: amountFormula,
    sinceTimestamp: escrow.sinceTimestamp,
    untilTimestamp: escrow.untilTimestamp,
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
