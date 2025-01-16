import { BackendProject, tokenList } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { AmountConfig, PriceConfig, Token, TvsConfig } from './types'

export function mapConfig(project: BackendProject, chain: string): TvsConfig {
  const tokens: Map<string, Token> = new Map()

  for (const escrow of project.escrows) {
    // TODO - implement support for shared escrows
    if (escrow.sharedEscrow) {
      continue
    }

    for (const token of escrow.tokens) {
      if (!token.id.endsWith('native')) {
        assert(token.address, `Token address is required ${token.id}`)
      }

      const exisitingToken = tokens.get(token.id)

      if (exisitingToken) {
        // add escrow to the amount formula
        exisitingToken.amount.arguments.push(escrow.address)

        // update sinceTimestamp if needed
        if (escrow.sinceTimestamp < exisitingToken.sinceTimestamp) {
          exisitingToken.sinceTimestamp = escrow.sinceTimestamp
        }

        // reset or update  untilTimestamp if needed
        if (!escrow.untilTimestamp && exisitingToken.untilTimestamp) {
          exisitingToken.untilTimestamp = undefined
        } else if (
          escrow.untilTimestamp &&
          exisitingToken.untilTimestamp &&
          escrow.untilTimestamp > exisitingToken.untilTimestamp
        ) {
          exisitingToken.untilTimestamp = escrow.untilTimestamp
        }
      } else {
        tokens.set(token.id, {
          id: token.id,
          category: token.category,
          source: token.source,
          decimals: token.decimals,
          address: token.address,
          amount: {
            operator: 'balanceOfEscrow',
            arguments: [escrow.address],
          },
          chain,
          ticker: mapCoingeckoIdToTicker(token.coingeckoId),
          sinceTimestamp: escrow.sinceTimestamp,
          untilTimestamp: escrow.untilTimestamp,
          isAssociated:
            project.associatedTokens?.includes(token.symbol) ?? false,
        })
      }
    }
  }

  return {
    projectId: project.projectId,
    tokens: Array.from(tokens.values()),
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
