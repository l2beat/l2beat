import { expect, mockObject } from 'earl'
import type { AmountFormula, Token } from '../types'
import { getEffectiveConfig } from './getEffectiveConfig'

describe(getEffectiveConfig.name, () => {
  it('should set sinceTimestamp for all amounts', async () => {
    const tokens: Token[] = [
      mockObject<Token>({
        amount: mockAmountFormula(0),
        valueForProject: {
          type: 'calculation',
          operator: 'sum',
          arguments: [
            {
              type: 'value',
              priceId: 'priceId',
              amount: mockAmountFormula(0),
            },
            {
              type: 'value',
              priceId: 'priceId',
              amount: mockAmountFormula(0),
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
              amount: mockAmountFormula(0),
            },
            {
              type: 'value',
              priceId: 'priceId',
              amount: mockAmountFormula(0),
            },
          ],
        },
      }),
      mockObject<Token>({
        amount: mockAmountFormula(30),
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
    ]

    const result = getEffectiveConfig(tokens, 10)

    const expectedResult = [
      {
        amount: {
          type: 'balanceOfEscrow',
          sinceTimestamp: 10,
          untilTimestamp: undefined,
        },
        valueForProject: {
          type: 'calculation',
          operator: 'sum',
          arguments: [
            {
              type: 'value',
              priceId: 'priceId',
              amount: {
                type: 'balanceOfEscrow',
                sinceTimestamp: 10,
                untilTimestamp: undefined,
              },
            },
            {
              type: 'value',
              priceId: 'priceId',
              amount: {
                type: 'balanceOfEscrow',
                sinceTimestamp: 10,
                untilTimestamp: undefined,
              },
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
              amount: {
                type: 'balanceOfEscrow',
                sinceTimestamp: 10,
                untilTimestamp: undefined,
              },
            },
            {
              type: 'value',
              priceId: 'priceId',
              amount: {
                type: 'balanceOfEscrow',
                sinceTimestamp: 10,
                untilTimestamp: undefined,
              },
            },
          ],
        },
      },
      {
        amount: {
          type: 'balanceOfEscrow',
          sinceTimestamp: 30,
          untilTimestamp: undefined,
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      },
    ] as any

    expect(result).toEqual(expectedResult)
  })

  it('should remove tokens - amount not in range', async () => {
    const tokens: Token[] = [
      mockObject<Token>({
        amount: mockAmountFormula(0),
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
      // amount formula not in range
      mockObject<Token>({
        amount: mockAmountFormula(0, 5),
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
    ]

    const result = getEffectiveConfig(tokens, 10)

    const expectedResult = [
      {
        amount: {
          type: 'balanceOfEscrow',
          sinceTimestamp: 10,
          untilTimestamp: undefined,
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      },
    ] as any

    expect(result).toEqual(expectedResult)
  })

  it('should remove tokens - calculation formula with argument(s) not in range', async () => {
    const tokens: Token[] = [
      // calculation formula with one argument not in range - one argument should be filtered out
      mockObject<Token>({
        amount: {
          type: 'calculation',
          operator: 'sum',
          arguments: [mockAmountFormula(0, 5), mockAmountFormula(0)],
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
      // calculation formula with all arguments not in range - entire token should be filtered out
      mockObject<Token>({
        amount: {
          type: 'calculation',
          operator: 'sum',
          arguments: [mockAmountFormula(0, 5), mockAmountFormula(0, 7)],
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
      // calculation formula (diff) with one argument not in range - entire token should be filtered out
      mockObject<Token>({
        amount: {
          type: 'calculation',
          operator: 'diff',
          arguments: [mockAmountFormula(0, 5), mockAmountFormula(0)],
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      }),
    ]

    const result = getEffectiveConfig(tokens, 10)

    const expectedResult = [
      {
        amount: {
          type: 'calculation',
          operator: 'sum',
          arguments: [
            {
              type: 'balanceOfEscrow',
              sinceTimestamp: 10,
              untilTimestamp: undefined,
            },
          ],
        },
        valueForProject: undefined,
        valueForTotal: undefined,
      },
    ] as any

    expect(result).toEqual(expectedResult)
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
