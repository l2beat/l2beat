import type { AmountFormula, TvsToken } from '@l2beat/config'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it } from 'vitest'
import { getTokenSyncRange } from './getTokenSyncRange'

describe(getTokenSyncRange.name, () => {
  it('should return sync range - until undefined', async () => {
    const token: TvsToken = mockObject<TvsToken>({
      amount: mockAmountFormula(20, 40),
      valueForProject: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 20),
          },
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10),
          },
        ],
      },
      valueForSummary: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(5, 15),
          },
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 50),
          },
        ],
      },
    })

    const result = getTokenSyncRange(token)

    expect(result).toStrictEqual({
      sinceTimestamp: 5,
      untilTimestamp: undefined,
    })
  })

  it('should return sync range - until defined', async () => {
    const token: TvsToken = mockObject<TvsToken>({
      amount: mockAmountFormula(20, 40),
      valueForProject: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 20),
          },
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 20),
          },
        ],
      },
      valueForSummary: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(5, 15),
          },
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 50),
          },
        ],
      },
    })

    const result = getTokenSyncRange(token)

    expect(result).toStrictEqual({
      sinceTimestamp: 5,
      untilTimestamp: 50,
    })
  })
})

function mockAmountFormula(
  sinceTimestamp: number,
  untilTimestamp: number | undefined = undefined,
): AmountFormula {
  return mockObject<AmountFormula>({
    type: 'balanceOfEscrow',
    sinceTimestamp,
    untilTimestamp,
  })
}
