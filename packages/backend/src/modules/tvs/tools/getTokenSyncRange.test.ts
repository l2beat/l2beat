import { expect, mockObject } from 'earl'
import type { AmountFormula, Token } from '../types'
import { getTokenSyncRange } from './getTokenSyncRange'

describe(getTokenSyncRange.name, () => {
  it('should return sync range', async () => {
    const token: Token = mockObject<Token>({
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
      valueForTotal: {
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

    expect(result).toEqual({
      sinceTimestamp: 5,
      untilTimestamp: undefined,
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
