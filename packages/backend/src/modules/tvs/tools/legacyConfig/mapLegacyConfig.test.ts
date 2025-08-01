import { Logger } from '@l2beat/backend-tools'
import { ProjectService, type TvsToken } from '@l2beat/config'
import {
  assert,
  EthereumAddress,
  ProjectId,
  TokenId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { LocalStorage } from '../LocalStorage'
import { getLegacyConfig } from './getLegacyConfig'
import { mapLegacyConfig } from './mapLegacyConfig'

describe(mapLegacyConfig.name, () => {
  it("should map arbitrum's escrows to tokens", async () => {
    const ps = new ProjectService()
    const arbitrum = await ps.getProject({
      id: ProjectId('arbitrum'),
      select: ['escrows', 'chainConfig', 'tvsInfo'],
    })

    assert(arbitrum, 'Arbitrum not found')

    const projectsWithChain = (
      await ps.getProjects({ select: ['chainConfig'] })
    ).map((p) => p.chainConfig)

    const chains = new Map(projectsWithChain.map((p) => [p.name, p]))

    const mockLocalStorage = mockObject<LocalStorage>({
      getAddress: mockFn().resolvesTo(undefined),
    })

    const tokens = await ps.getTokens()
    const legacyConfig = getLegacyConfig(arbitrum, tokens)

    const result = await mapLegacyConfig(
      arbitrum,
      legacyConfig,
      chains,
      Logger.SILENT,
      mockLocalStorage,
    )

    expect(result.projectId).toEqual(ProjectId('arbitrum'))
    expect(result.tokens.length).toBeGreaterThanOrEqual(501)

    expect(
      result.tokens.find((t: TvsToken) => t.id === 'arbitrum-ETH'),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ETH'),
      priceId: 'ethereum',
      symbol: 'ETH',
      name: 'Ether',
      iconUrl:
        'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
      amount: {
        type: 'calculation',
        operator: 'sum',
        arguments: [
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
            ),
            decimals: 18,
            sinceTimestamp: 1661457944,
          },
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0xcEe284F754E854890e311e3280b767F80797180d',
            ),
            decimals: 18,
            sinceTimestamp: 1623867835,
          },
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
            ),
            decimals: 18,
            sinceTimestamp: 1623784100,
          },
          {
            type: 'balanceOfEscrow',
            address: 'native',
            chain: 'ethereum',
            escrowAddress: EthereumAddress(
              '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
            ),
            decimals: 18,
            sinceTimestamp: 1622243344,
          },
        ],
      },
      category: 'ether',
      source: 'canonical',
      isAssociated: false,
      bridgedUsing: undefined,
    })

    expect(
      result.tokens.find(
        (t: TvsToken) =>
          t.id === 'arbitrum-ARB-1' && t.amount.type === 'circulatingSupply',
      ),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ARB-1'),
      symbol: 'ARB',
      name: 'Arbitrum',
      iconUrl:
        'https://coin-images.coingecko.com/coins/images/16547/large/arb.jpg?1721358242',
      priceId: 'arbitrum',
      amount: {
        type: 'circulatingSupply',
        apiId: 'arbitrum',
        decimals: 18,
        sinceTimestamp: UnixTime(1679529600),
        address: EthereumAddress('0x912CE59144191C1204E64559FE8253a0e49E6548'),
        chain: 'arbitrum',
      },
      category: 'other',
      source: 'native',
      isAssociated: true,
      bridgedUsing: undefined,
    })

    expect(
      result.tokens.find((t: TvsToken) => t.id === 'arbitrum-ATH'),
    ).toEqual({
      mode: 'auto',
      id: TokenId('arbitrum-ATH'),
      symbol: 'ATH',
      name: 'Aethir Token',
      iconUrl:
        'https://coin-images.coingecko.com/coins/images/36179/large/logogram_circle_dark_green_vb_green_%281%29.png?1718232706',
      priceId: 'aethir',
      amount: {
        type: 'totalSupply',
        address: EthereumAddress('0xc87B37a581ec3257B734886d9d3a581F5A9d056c'),
        chain: 'arbitrum',
        decimals: 18,
        sinceTimestamp: UnixTime(1718150400),
      },
      category: 'other',
      source: 'external',
      isAssociated: false,
      bridgedUsing: {
        bridges: [
          {
            name: 'Axelar (ITS)',
          },
        ],
      },
    })
  })
})
