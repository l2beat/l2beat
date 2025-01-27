import { createHash } from 'crypto'
import type {
  BackendProject,
  BackendProjectEscrow,
} from '@l2beat/backend-shared'
import { type ChainConfig, tokenList } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Token as LegacyToken } from '@l2beat/shared-pure'
import { tokenToTicker } from './providers/tickers'
import {
  type AmountConfig,
  type AmountFormula,
  type BalanceOfEscrowAmountFormula,
  type CalculationFormula,
  type CirculatingSupplyAmountFormula,
  type EscrowToken,
  type PriceConfig,
  type Token,
  type TotalSupplyAmountFormula,
  type TvsConfig,
  type ValueFormula,
  isEscrowToken,
} from './types'

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
  let source: 'canonical' | 'external' | 'native'

  switch (legacyToken.supply) {
    case 'zero':
      assert(escrow, 'Escrow is required for zero supply tokens')

      amountFormula = {
        type: 'balanceOfEscrow',
        address: legacyToken.address ?? 'native',
        chain: escrow.chain,
        escrowAddresses: [escrow.address],
        decimals: legacyToken.decimals,
      } as BalanceOfEscrowAmountFormula

      sinceTimestamp = escrow.sinceTimestamp
      untilTimestamp = escrow.untilTimestamp
      source = escrow.source ?? legacyToken.source
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
      source = legacyToken.source
      break
    case 'circulatingSupply':
      assert(
        chain.minTimestampForTvl,
        'Chain with token should have minTimestamp',
      )

      amountFormula = {
        type: 'circulatingSupply',
        ticker: tokenToTicker(legacyToken),
      } as CirculatingSupplyAmountFormula

      sinceTimestamp = UnixTime.max(
        chain.minTimestampForTvl,
        legacyToken.sinceTimestamp,
      )
      source = legacyToken.source
      break

    default:
      throw new Error(`Unsupported supply type ${legacyToken.supply}`)
  }

  return {
    id: legacyToken.id,
    // This is a temporary solution
    ticker: tokenToTicker(legacyToken),
    amount: amountFormula,
    sinceTimestamp,
    untilTimestamp,
    category: legacyToken.category,
    source: source,
    isAssociated:
      project.associatedTokens?.includes(legacyToken.symbol) ?? false,
  }
}

export function extractPricesAndAmounts(config: TvsConfig): {
  amounts: AmountConfig[]
  prices: PriceConfig[]
} {
  const amounts = new Map<string, AmountConfig>()
  const prices = new Map<string, PriceConfig>()

  for (const token of config.tokens) {
    const amount = createAmountConfig(token.amount)
    amounts.set(amount.id, amount)

    const price = createPriceConfig({
      amount: token.amount,
      ticker: token.ticker,
    } as ValueFormula)
    prices.set(price.id, price)

    if (token.valueForProject) {
      const { formulaAmounts, formulaPrices } = processFormula(
        token.valueForProject,
      )
      formulaAmounts.forEach((a) => amounts.set(a.id, a))
      formulaPrices.forEach((p) => prices.set(p.id, p))
    }

    if (token.valueForTotal) {
      const { formulaAmounts, formulaPrices } = processFormula(
        token.valueForTotal,
      )
      formulaAmounts.forEach((a) => amounts.set(a.id, a))
      formulaPrices.forEach((p) => prices.set(p.id, p))
    }
  }

  return {
    amounts: Array.from(amounts.values()),
    prices: Array.from(prices.values()),
  }
}

export function createAmountConfig(formula: AmountFormula): AmountConfig {
  switch (formula.type) {
    case 'balanceOfEscrow':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
          ...formula.escrowAddresses.sort(),
        ]),
        ...formula,
      }
    case 'totalSupply':
      return {
        id: hash([
          formula.type,
          formula.address,
          formula.chain,
          formula.decimals.toString(),
        ]),
        ...formula,
      }
    case 'circulatingSupply':
      return {
        id: hash([formula.type, formula.ticker]),
        ...formula,
      }
  }
}

export function createPriceConfig(formula: ValueFormula): PriceConfig {
  return {
    id: hash([formula.ticker]),
    ticker: formula.ticker,
  }
}

function processFormula(formula: CalculationFormula | ValueFormula): {
  formulaAmounts: AmountConfig[]
  formulaPrices: PriceConfig[]
} {
  const formulaAmounts: AmountConfig[] = []
  const formulaPrices: PriceConfig[] = []

  const processFormulaRecursive = (f: CalculationFormula | ValueFormula) => {
    if (f.type === 'value') {
      const amount = createAmountConfig(f.amount)
      formulaAmounts.push(amount)

      const price = createPriceConfig(f)
      formulaPrices.push(price)

      return
    }

    for (const arg of f.arguments) {
      processFormulaRecursive(arg)
    }
  }

  processFormulaRecursive(formula)

  return { formulaAmounts, formulaPrices }
}

export function hash(input: string[]): string {
  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
