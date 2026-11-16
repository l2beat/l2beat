import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  AmountFormula,
  BalanceOfEscrowAmountFormula,
  BalanceOfEscrowsAmountFormula,
  Formula,
  TotalSupplyAmountFormula,
  ValueFormula,
} from '../types'
import {
  getAmountFormulas,
  getCountedAmountFormulas,
  getEscrowAddresses,
  getValueFormulas,
  isAmountFormulaActive,
} from './tvsFormulas'

const TOKEN = EthereumAddress('0x1111111111111111111111111111111111111111')
const ESCROW_A = EthereumAddress('0x2222222222222222222222222222222222222222')
const ESCROW_B = EthereumAddress('0x3333333333333333333333333333333333333333')

describe(getAmountFormulas.name, () => {
  it('returns every amount of a sum and a diff, depth first', () => {
    const a = supply('arbitrum')
    const b = escrow('ethereum', ESCROW_A)
    const c = escrows('ethereum', [ESCROW_A, ESCROW_B])

    expect(getAmountFormulas(sum(a, diff(b, c)))).toEqual([a, b, c])
  })

  it('reads through value formulas', () => {
    const a = supply('base')
    const b = escrow('ethereum', ESCROW_A)

    expect(getAmountFormulas(diff(value(a, 'x'), value(b, 'y')))).toEqual([
      a,
      b,
    ])
  })
})

describe(getCountedAmountFormulas.name, () => {
  it('counts every argument of a sum', () => {
    const a = supply('arbitrum')
    const b = escrow('ethereum', ESCROW_A)

    expect(getCountedAmountFormulas(sum(a, b))).toEqual([a, b])
  })

  it('counts only the minuend of a diff', () => {
    const minuend = supply('base')
    const subtrahends = [escrow('base', ESCROW_A), escrow('base', ESCROW_B)]

    expect(getCountedAmountFormulas(diff(minuend, ...subtrahends))).toEqual([
      minuend,
    ])
    expect(
      getCountedAmountFormulas(sum(diff(sum(minuend), ...subtrahends))),
    ).toEqual([minuend])
  })

  it('counts the minuend of a valueForProject override', () => {
    const minted = supply('base')
    const backing = escrow('ethereum', ESCROW_A)

    expect(
      getCountedAmountFormulas(diff(value(minted, 'x'), value(backing, 'y'))),
    ).toEqual([minted])
  })

  it('counts a constant of a valueForSummary override', () => {
    const zero: AmountFormula = {
      type: 'const',
      value: '0',
      decimals: 0,
      sinceTimestamp: UnixTime(1),
    }

    expect(getCountedAmountFormulas(value(zero, 'x'))).toEqual([zero])
  })
})

describe(getValueFormulas.name, () => {
  it('returns the value formulas of an override, depth first', () => {
    const x = value(supply('base'), 'x')
    const y = value(escrow('ethereum', ESCROW_A), 'y')

    expect(getValueFormulas(diff(x, y))).toEqual([x, y])
    expect(getValueFormulas(x)).toEqual([x])
  })

  it('returns nothing for an amount', () => {
    expect(getValueFormulas(sum(supply('base')))).toEqual([])
  })
})

describe(isAmountFormulaActive.name, () => {
  it('includes both ends of the range', () => {
    const formula = supply('base', { since: 100, until: 200 })

    expect(isAmountFormulaActive(formula, UnixTime(99))).toEqual(false)
    expect(isAmountFormulaActive(formula, UnixTime(100))).toEqual(true)
    expect(isAmountFormulaActive(formula, UnixTime(200))).toEqual(true)
    expect(isAmountFormulaActive(formula, UnixTime(201))).toEqual(false)
  })

  it('has no end without untilTimestamp', () => {
    expect(
      isAmountFormulaActive(supply('base', { since: 100 }), UnixTime(10_000)),
    ).toEqual(true)
  })
})

describe(getEscrowAddresses.name, () => {
  it('returns the escrows of balanceOfEscrow and balanceOfEscrows', () => {
    expect(getEscrowAddresses(escrow('ethereum', ESCROW_A))).toEqual([ESCROW_A])
    expect(
      getEscrowAddresses(escrows('ethereum', [ESCROW_A, ESCROW_B])),
    ).toEqual([ESCROW_A, ESCROW_B])
  })

  it('returns no escrows for a supply', () => {
    expect(getEscrowAddresses(supply('base'))).toEqual([])
  })
})

function supply(
  chain: string,
  range: { since?: number; until?: number } = {},
): TotalSupplyAmountFormula {
  return {
    type: 'totalSupply',
    chain,
    address: TOKEN,
    decimals: 18,
    sinceTimestamp: UnixTime(range.since ?? 1),
    untilTimestamp:
      range.until === undefined ? undefined : UnixTime(range.until),
  }
}

function escrow(
  chain: string,
  escrowAddress: EthereumAddress,
): BalanceOfEscrowAmountFormula {
  return {
    type: 'balanceOfEscrow',
    chain,
    address: TOKEN,
    escrowAddress,
    decimals: 18,
    sinceTimestamp: UnixTime(1),
  }
}

function escrows(
  chain: string,
  escrowAddresses: EthereumAddress[],
): BalanceOfEscrowsAmountFormula {
  return {
    type: 'balanceOfEscrows',
    chain,
    address: 'native',
    escrowAddresses,
    decimals: 18,
    sinceTimestamp: UnixTime(1),
  }
}

function value(amount: AmountFormula, priceId: string): ValueFormula {
  return { type: 'value', amount, priceId }
}

function sum(...args: Formula[]): Formula {
  return { type: 'calculation', operator: 'sum', arguments: args }
}

function diff(...args: Formula[]): Formula {
  return { type: 'calculation', operator: 'diff', arguments: args }
}
