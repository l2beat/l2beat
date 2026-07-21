import type {
  AmountFormula,
  CalculationFormula,
  Formula,
  TvsToken,
  ValueFormula,
} from '@l2beat/config'
import { EthereumAddress, TokenId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'

describe(extractAddressesFromTokenConfig.name, () => {
  it('returns empty array if no amount', () => {
    const token = mockToken()
    const result = extractAddressesFromTokenConfig(token)
    expect(result).toEqual({ addresses: [], escrows: [] })
  })

  it('should handle calculation', () => {
    const add1 = EthereumAddress.random()
    const add2 = EthereumAddress.random()
    const add3 = EthereumAddress.random()
    const add4 = EthereumAddress.random()

    const token = mockToken({
      type: 'calculation',
      operator: 'sum',
      arguments: [
        mockCalculationFormula([
          mockAmountFormula({
            type: 'balanceOfEscrow',
            address: add1,
            escrowAddress: add2,
            chain: '1',
          }),
          mockAmountFormula({
            type: 'circulatingSupply',
            address: add4,
            chain: '2',
          }),
          mockAmountFormula({
            type: 'totalSupply',
            address: add1,
            chain: '1',
          }),
          mockAmountFormula({
            type: 'balanceOfEscrow',
            address: add2,
            escrowAddress: add3,
            chain: '1',
          }),
          mockValueFormula(),
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result.addresses).toEqualUnsorted([
      { address: add1, chain: '1' },
      { address: add2, chain: '1' },
      { address: add4, chain: '2' },
    ])
    expect(result.escrows).toEqualUnsorted([
      { address: add2, chain: '1' },
      { address: add3, chain: '1' },
    ])
  })

  it('should handle calculation with nested calculation', () => {
    const add1 = EthereumAddress.random()
    const add2 = EthereumAddress.random()
    const add3 = EthereumAddress.random()

    const token = mockToken({
      type: 'calculation',
      operator: 'sum',
      arguments: [
        mockCalculationFormula([
          mockAmountFormula({
            type: 'balanceOfEscrow',
            address: add1,
            escrowAddress: add2,
            chain: '1',
          }),
          mockCalculationFormula([
            mockAmountFormula({
              type: 'balanceOfEscrow',
              address: add1,
              escrowAddress: add2,
              chain: '1',
            }),
            mockAmountFormula({
              type: 'totalSupply',
              address: add3,
              chain: '1',
            }),
          ]),
          mockValueFormula(),
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result.addresses).toEqualUnsorted([
      { address: add1, chain: '1' },
      { address: add3, chain: '1' },
    ])
    expect(result.escrows).toEqualUnsorted([{ address: add2, chain: '1' }])
  })

  it('should return empty array for types with no addresses', () => {
    const token = mockToken({
      type: 'calculation',
      operator: 'sum',
      arguments: [
        mockCalculationFormula([
          mockAmountFormula({
            type: 'const',
          }),
          mockValueFormula(),
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result.addresses).toEqual([])
    expect(result.escrows).toEqual([])
  })
})

function mockValueFormula(): ValueFormula {
  return mockObject<ValueFormula>({
    type: 'value',
    priceId: '1',
  })
}

function mockAmountFormula(amount: Partial<AmountFormula>): AmountFormula {
  return mockObject<AmountFormula>({
    decimals: 18,
    ...amount,
  })
}

function mockCalculationFormula(args: Formula[]): CalculationFormula {
  return mockObject<CalculationFormula>({
    type: 'calculation',
    operator: 'sum',
    arguments: args,
  })
}

function mockToken(amount?: CalculationFormula | AmountFormula): TvsToken {
  return mockObject<TvsToken>({
    mode: 'auto',
    id: TokenId('1'),
    priceId: '1',
    symbol: '1',
    name: '1',
    category: 'ether',
    source: 'native',
    isAssociated: false,
    amount,
  })
}
