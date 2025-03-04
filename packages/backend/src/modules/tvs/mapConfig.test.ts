import { ProjectService } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { extractPricesAndAmounts, mapConfig } from './mapConfig'
import { type Token, TokenId, type TvsConfig } from './types'

describe(mapConfig.name, () => {
  it("should map arbitrum's escrows to tokens", async () => {
    const ps = new ProjectService()
    const arbitrum = await ps.getProject({
      id: ProjectId('arbitrum'),
      select: ['tvlConfig', 'chainConfig'],
    })
    assert(arbitrum, 'Arbitrum not found')

    const result = mapConfig(arbitrum, arbitrum.chainConfig)

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(501)

    expect(result.tokens[0]).toEqual({
      id: TokenId('arbitrum-ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ether',
      amount: {
        type: 'balanceOfEscrow',
        address: 'native',
        chain: 'ethereum',
        escrowAddress: EthereumAddress(
          '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
        ),
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1661457944),
      untilTimestamp: undefined,
      category: 'ether',
      source: 'canonical',
      isAssociated: false,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'arbitrum-ARB' && t.amount.type === 'circulatingSupply',
      ),
    ).toEqual({
      id: TokenId('arbitrum-ARB'),
      symbol: 'ARB',
      name: 'Arbitrum',
      priceId: 'arbitrum',
      amount: {
        type: 'circulatingSupply',
        priceId: 'arbitrum',
      },
      sinceTimestamp: new UnixTime(1679529600),
      untilTimestamp: undefined,
      category: 'other',
      source: 'native',
      isAssociated: true,
    })

    expect(result.tokens.find((t) => t.id === 'arbitrum-ATH')).toEqual({
      id: TokenId('arbitrum-ATH'),
      symbol: 'ATH',
      name: 'Aethir Token',
      priceId: 'aethir',
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0xc87B37a581ec3257B734886d9d3a581F5A9d056c'),
        chain: 'arbitrum',
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1718150400),
      untilTimestamp: undefined,
      category: 'other',
      source: 'external',
      isAssociated: false,
    })
  })
})

describe(extractPricesAndAmounts.name, () => {
  it('should map amount formulas to sync configs', async () => {
    const tvsConfig = mockObject<TvsConfig>({
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
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-ARB',
          amount: {
            type: 'circulatingSupply',
            priceId: 'price-ARB',
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          priceId: 'price-ATH',
          amount: {
            type: 'totalSupply',
            address: EthereumAddress(
              '0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
            ),
            chain: 'arbitrum',
            decimals: 18,
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
        },
        {
          id: '4ffda8b9b469',
          priceId: 'price-ARB',
          type: 'circulatingSupply',
        },
        {
          id: '9c352c5b1183',
          address: EthereumAddress(
            '0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
          ),
          chain: 'arbitrum',
          decimals: 18,
          type: 'totalSupply',
        },
      ],
      prices: [
        {
          priceId: 'price-ARB',
        },
        {
          priceId: 'price-ATH',
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

    const tvsConfig = mockObject<TvsConfig>({
      tokens: [
        // WBTC with amount formula as totalSupply on L2
        mockObject<Token>({
          priceId: 'price-WBTC',
          amount: {
            type: 'totalSupply',
            address: wBTCContractAddress,
            chain: 'bob',
            decimals: 18,
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
        },
        {
          id: 'b1828c012ce3',
          type: 'totalSupply',
          address: solvBTCContractAddress,
          chain: 'bob',
          decimals: 18,
        },
        {
          id: '87ab15cf98f5',
          type: 'balanceOfEscrow',
          address: wBTCContractAddress,
          chain: 'bob',
          decimals: 18,
          escrowAddress: solvBTCEscrowAddress,
        },
      ],
      prices: [
        {
          priceId: 'price-WBTC',
        },
        {
          priceId: 'price-SolvBTC',
        },
      ],
    })
  })
})
