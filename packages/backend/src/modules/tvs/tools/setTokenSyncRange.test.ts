import type { AmountFormula, TvsToken } from '@l2beat/config'
import { expect, mockObject } from 'earl'
import { setTokenSyncRange } from './setTokenSyncRange'

describe(setTokenSyncRange.name, () => {
  it('should set sync range', async () => {
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
            amount: mockAmountFormula(5),
          },
          {
            type: 'value',
            priceId: 'priceId',
            amount: mockAmountFormula(10, 50),
          },
        ],
      },
    })

    setTokenSyncRange(token, {
      sinceTimestamp: 10,
      untilTimestamp: 30,
    })

    expect(token.amount.sinceTimestamp).toEqual(20)
    expect(token.amount.untilTimestamp).toEqual(30)
    expect(token.valueForProject.arguments[0].amount.sinceTimestamp).toEqual(10)
    expect(token.valueForProject.arguments[0].amount.untilTimestamp).toEqual(20)
    expect(token.valueForProject.arguments[1].amount.sinceTimestamp).toEqual(10)
    expect(token.valueForProject.arguments[1].amount.untilTimestamp).toEqual(30)
    expect(token.valueForSummary.arguments[0].amount.sinceTimestamp).toEqual(10)
    expect(token.valueForSummary.arguments[0].amount.untilTimestamp).toEqual(30)
    expect(token.valueForSummary.arguments[1].amount.sinceTimestamp).toEqual(10)
    expect(token.valueForSummary.arguments[1].amount.untilTimestamp).toEqual(30)
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
