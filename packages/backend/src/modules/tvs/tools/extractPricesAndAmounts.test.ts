import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ProjectTvsConfig, Token } from '../types'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'

describe(extractPricesAndAmounts.name, () => {
  it('should map amount formulas to sync configs', async () => {
    const tvsConfig = mockObject<ProjectTvsConfig>({
      tokens: [
        mockObject<Token>({
          priceId: 'price-ARB',
          amount: {
            type: 'balanceOfEscrow',
            address: EthereumAddress(
              '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
            ),
            chain: 'arbitrum',
            escrowAddress: EthereumAddress(
              '0xcEe284F754E854890e311e3280b767F80797180d',
            ),
            decimals: 18,
            sinceTimestamp: UnixTime(100),
            untilTimestamp: UnixTime(200),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-ARB',
          amount: {
            type: 'circulatingSupply',
            apiId: 'price-ARB',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-ATH',
          amount: {
            type: 'calculation',
            operator: 'max',
            arguments: [
              {
                type: 'const',
                value: '100',
                decimals: 0,
                sinceTimestamp: UnixTime(100),
              },
              {
                type: 'totalSupply',
                address: EthereumAddress(
                  '0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
                ),
                chain: 'arbitrum',
                decimals: 18,
                sinceTimestamp: UnixTime(100),
              },
            ],
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
      ],
    })

    const result = extractPricesAndAmounts(tvsConfig)
    expect(result).toEqual({
      amounts: [
        {
          id: 'de9829103265',
          address: EthereumAddress(
            '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
          ),
          chain: 'arbitrum',
          decimals: 18,
          escrowAddress: EthereumAddress(
            '0xcEe284F754E854890e311e3280b767F80797180d',
          ),
          type: 'balanceOfEscrow',
          sinceTimestamp: UnixTime(100),
          untilTimestamp: UnixTime(200),
        },
        {
          id: '4ffda8b9b469',
          apiId: 'price-ARB',
          type: 'circulatingSupply',
          decimals: 18,
          sinceTimestamp: UnixTime(100),
        },
        {
          id: '9c352c5b1183',
          address: EthereumAddress(
            '0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
          ),
          chain: 'arbitrum',
          decimals: 18,
          type: 'totalSupply',
          sinceTimestamp: UnixTime(100),
        },
      ],
      prices: [
        {
          priceId: 'price-ARB',
          sinceTimestamp: UnixTime(100),
          untilTimestamp: undefined,
        },
        {
          priceId: 'price-ATH',
          sinceTimestamp: UnixTime(100),
          untilTimestamp: undefined,
        },
      ],
    })
  })

  it('should map calculation formulas to sync config', async () => {
    const wBTCContractAddress = EthereumAddress(
      '0x10e4C3460310a2F4b56C8DB0b3806Be29B15c15E',
    )
    const solvBTCContractAddress = EthereumAddress(
      '0x6E50888634562713c5F8f8AA650807cDc67Fc363',
    )
    const solvBTCEscrowAddress = EthereumAddress(
      '0xA9cF190a5b7daE4CB1b3BD68fABf310cf1982185',
    )

    const tvsConfig = mockObject<ProjectTvsConfig>({
      tokens: [
        // WBTC with amount formula as totalSupply on L2
        mockObject<Token>({
          priceId: 'price-WBTC',
          amount: {
            type: 'totalSupply',
            address: wBTCContractAddress,
            chain: 'bob',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        // solvBTC with
        // - amount formula as totalSupply on L2
        // - valueForProject formula as totalSupply of solveBTC on L2 - balance of WBTC locked in solvBTC escrow
        mockObject<Token>({
          priceId: 'price-SolvBTC',
          amount: {
            type: 'totalSupply',
            address: solvBTCContractAddress,
            chain: 'bob',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
          },
          valueForProject: {
            type: 'calculation',
            operator: 'diff',
            arguments: [
              {
                type: 'value',
                amount: {
                  type: 'totalSupply',
                  address: solvBTCContractAddress,
                  chain: 'bob',
                  decimals: 18,
                  sinceTimestamp: UnixTime(100),
                },
                priceId: 'price-SolvBTC',
              },
              {
                type: 'value',
                amount: {
                  type: 'balanceOfEscrow',
                  address: wBTCContractAddress,
                  chain: 'bob',
                  decimals: 18,
                  escrowAddress: solvBTCEscrowAddress,
                  sinceTimestamp: UnixTime(100),
                },
                priceId: 'price-WBTC',
              },
            ],
          },
          valueForTotal: undefined,
        }),
      ],
    })

    const result = extractPricesAndAmounts(tvsConfig)
    expect(result).toEqual({
      amounts: [
        {
          id: '16ab02a2d2c7',
          type: 'totalSupply',
          address: wBTCContractAddress,
          chain: 'bob',
          decimals: 18,
          sinceTimestamp: UnixTime(100),
        },
        {
          id: 'b1828c012ce3',
          type: 'totalSupply',
          address: solvBTCContractAddress,
          chain: 'bob',
          decimals: 18,
          sinceTimestamp: UnixTime(100),
          untilTimestamp: undefined,
        },
        {
          id: '87ab15cf98f5',
          type: 'balanceOfEscrow',
          address: wBTCContractAddress,
          chain: 'bob',
          decimals: 18,
          escrowAddress: solvBTCEscrowAddress,
          sinceTimestamp: UnixTime(100),
        },
      ],
      prices: [
        {
          priceId: 'price-WBTC',
          sinceTimestamp: UnixTime(100),
          untilTimestamp: undefined,
        },
        {
          priceId: 'price-SolvBTC',
          sinceTimestamp: UnixTime(100),
          untilTimestamp: undefined,
        },
      ],
    })
  })

  it('should extract sync configs with correct price and amount ranges', async () => {
    const address = EthereumAddress(
      '0x10e4C3460310a2F4b56C8DB0b3806Be29B15c15E',
    )

    const tvsConfig = mockObject<ProjectTvsConfig>({
      tokens: [
        mockObject<Token>({
          priceId: 'price-A',
          amount: {
            type: 'totalSupply',
            address,
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
            untilTimestamp: UnixTime(200),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-A',
          amount: {
            type: 'totalSupply',
            address,
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: UnixTime(50),
            untilTimestamp: UnixTime(300),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-B',
          amount: {
            type: 'totalSupply',
            address,
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
            untilTimestamp: UnixTime(200),
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-B',
          amount: {
            type: 'totalSupply',
            address,
            chain: 'chain',
            decimals: 18,
            sinceTimestamp: UnixTime(100),
          },
          valueForProject: {
            type: 'calculation',
            operator: 'sum',
            arguments: [
              {
                type: 'value',
                amount: {
                  type: 'totalSupply',
                  address,
                  chain: 'chain',
                  decimals: 18,
                  sinceTimestamp: UnixTime(50),
                  untilTimestamp: UnixTime(300),
                },
                priceId: 'price-B',
              },
              {
                type: 'value',
                amount: {
                  type: 'totalSupply',
                  address,
                  chain: 'chain',
                  decimals: 18,
                  sinceTimestamp: UnixTime(300),
                  untilTimestamp: UnixTime(500),
                },
                priceId: 'price-C',
              },
            ],
          },
          valueForTotal: undefined,
        }),
      ],
    })

    const result = extractPricesAndAmounts(tvsConfig)
    expect(result).toEqual({
      amounts: [
        {
          id: 'ecd2a2018003',
          type: 'totalSupply',
          address,
          chain: 'chain',
          decimals: 18,
          sinceTimestamp: 300,
          untilTimestamp: undefined,
        },
      ],
      prices: [
        {
          priceId: 'price-A',
          sinceTimestamp: 50,
          untilTimestamp: 300,
        },
        {
          priceId: 'price-B',
          sinceTimestamp: 50,
          untilTimestamp: undefined,
        },
        {
          priceId: 'price-C',
          sinceTimestamp: 300,
          untilTimestamp: 500,
        },
      ],
    })
  })
})
