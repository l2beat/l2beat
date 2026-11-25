import { EthereumAddress, TokenId } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type {
  AmountFormula,
  CalculationFormula,
  Formula,
  TvsToken,
} from '../types'
import { extractAddressesFromTokenConfig } from './extractAddressesFromTokenConfig'

describe(extractAddressesFromTokenConfig.name, () => {
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
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result).toEqualUnsorted([
      { address: add1, chain: '1' },
      { address: add2, chain: '1' },
      { address: add4, chain: '2' },
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
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result).toEqualUnsorted([
      { address: add1, chain: '1' },
      { address: add3, chain: '1' },
    ])
  })

  it('should handle a Starknet token balance', () => {
    const tokenAddress = '0x123'
    const poolAddress = '0x456'

    const result = extractAddressesFromTokenConfig(
      mockToken({
        type: 'starknetBalanceOf',
        address: tokenAddress,
        escrowAddress: poolAddress,
        chain: 'starknet',
        sinceTimestamp: 0,
        decimals: 18,
      }),
    )

    expect(result).toEqual([{ address: tokenAddress, chain: 'starknet' }])
  })

  it('collects only the token address of an aggregate escrow formula', () => {
    const tokenAddress = EthereumAddress.random()
    const escrowAddresses = [EthereumAddress.random(), EthereumAddress.random()]

    const result = extractAddressesFromTokenConfig(
      mockToken({
        type: 'balanceOfEscrows',
        address: tokenAddress,
        escrowAddresses,
        chain: 'arbitrum',
        sinceTimestamp: 0,
        decimals: 18,
      }),
    )

    expect(result).toEqual([{ address: tokenAddress, chain: 'arbitrum' }])
  })

  // The same address can hold different contracts on different chains, and
  // each one is a contract the amount is read from.
  it('keeps one address read on two chains', () => {
    const address = EthereumAddress.random()

    const result = extractAddressesFromTokenConfig(
      mockToken({
        type: 'calculation',
        operator: 'sum',
        arguments: [
          mockAmountFormula({ type: 'totalSupply', address, chain: '1' }),
          mockAmountFormula({ type: 'totalSupply', address, chain: '2' }),
        ],
      }),
    )

    expect(result).toEqualUnsorted([
      { address, chain: '1' },
      { address, chain: '2' },
    ])
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
        ]),
      ],
    })
    const result = extractAddressesFromTokenConfig(token)
    expect(result).toEqual([])
  })
})

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

function mockToken(amount: CalculationFormula | AmountFormula): TvsToken {
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
