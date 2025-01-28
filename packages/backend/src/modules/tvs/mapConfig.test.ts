import { layer2ToBackendProject } from '@l2beat/backend-shared'
import { layer2s } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { extractPricesAndAmounts, mapConfig } from './mapConfig'
import type { Token, TvsConfig } from './types'

describe(mapConfig.name, () => {
  it("should map arbitrum's escrows to tokens", async () => {
    const arbitrum = layer2s.find((l) => l.id === ProjectId('arbitrum'))

    assert(arbitrum, 'Arbitrum not found')
    assert(arbitrum.chainConfig, 'Arbitrum chain config not defined')

    const backendProject = layer2ToBackendProject(arbitrum)

    const result = mapConfig(backendProject, arbitrum.chainConfig)

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(501)

    expect(result.tokens[0]).toEqual({
      id: 'ethereum-native',
      ticker: 'ETH',
      amount: {
        type: 'balanceOfEscrow',
        address: 'native',
        chain: 'ethereum',
        escrowAddresses: [
          '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
          '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
        ],
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1622243344),
      untilTimestamp: undefined,
      category: 'ether',
      source: 'canonical',
      isAssociated: false,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'ethereum-0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
      ),
    ).toEqual({
      id: 'ethereum-0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
      ticker: 'ARB',
      amount: {
        type: 'balanceOfEscrow',
        address: EthereumAddress('0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1'),
        chain: 'ethereum',
        escrowAddresses: [
          '0xcEe284F754E854890e311e3280b767F80797180d',
          '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
        ],
        decimals: 18,
      },
      sinceTimestamp: new UnixTime(1623784100),
      untilTimestamp: undefined,
      category: 'other',
      source: 'external',
      isAssociated: true,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'arbitrum-0x912CE59144191C1204E64559FE8253a0e49E6548',
      ),
    ).toEqual({
      id: 'arbitrum-0x912CE59144191C1204E64559FE8253a0e49E6548',
      ticker: 'ARB',
      amount: {
        type: 'circulatingSupply',
        ticker: 'ARB',
      },
      sinceTimestamp: new UnixTime(1679529600),
      untilTimestamp: undefined,
      category: 'other',
      source: 'native',
      isAssociated: true,
    })

    expect(
      result.tokens.find(
        (t) => t.id === 'arbitrum-0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
      ),
    ).toEqual({
      id: 'arbitrum-0xc87B37a581ec3257B734886d9d3a581F5A9d056c',
      ticker: 'ATH',
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
          ticker: 'ARB',
          amount: {
            type: 'balanceOfEscrow',
            address: EthereumAddress(
              '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
            ),
            chain: 'arbitrum',
            escrowAddresses: [
              '0xcEe284F754E854890e311e3280b767F80797180d',
              '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            ],
            decimals: 18,
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          ticker: 'ARB',
          amount: {
            type: 'circulatingSupply',
            ticker: 'ARB',
          },
          valueForProject: undefined,
          valueForTotal: undefined,
        }),
        mockObject<Token>({
          ticker: 'ATH',
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
          id: '11466053d846',
          address: EthereumAddress(
            '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
          ),
          chain: 'arbitrum',
          decimals: 18,
          escrowAddresses: [
            '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            '0xcEe284F754E854890e311e3280b767F80797180d',
          ],
          type: 'balanceOfEscrow',
        },
        {
          id: 'fa28ab16f857',
          ticker: 'ARB',
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
          id: 'c29d12840de6',
          ticker: 'ARB',
        },
        {
          id: '7aac1877cd8b',
          ticker: 'ATH',
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
          ticker: 'WBTC',
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
          ticker: 'SolvBTC',
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
                ticker: 'SolvBTC',
              },
              {
                type: 'value',
                amount: {
                  type: 'balanceOfEscrow',
                  address: wBTCContractAddress,
                  chain: 'bob',
                  decimals: 18,
                  escrowAddresses: [solvBTCEscrowAddress],
                },
                ticker: 'WBTC',
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
          escrowAddresses: [solvBTCEscrowAddress],
        },
      ],
      prices: [
        {
          id: 'aa65c34f8046',
          ticker: 'WBTC',
        },
        {
          id: '3eb7e84f0423',
          ticker: 'SolvBTC',
        },
      ],
    })
  })
})
