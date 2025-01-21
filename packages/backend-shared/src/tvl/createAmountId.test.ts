import {
  type AggLayerL2Token,
  type AggLayerNativeEtherPreminted,
  type AggLayerNativeEtherWrapped,
  type AmountConfigBase,
  AssetId,
  type CirculatingSupplyEntry,
  CoingeckoId,
  type ElasticChainEther,
  type ElasticChainL2Token,
  type EscrowEntry,
  EthereumAddress,
  type PremintedEntry,
  ProjectId,
  type TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createAmountId } from './createAmountId'

describe(createAmountId.name, () => {
  const baseFields = [
    { key: 'assetId', newValue: 'new-assetId', shouldUpdateHash: false },
    { key: 'chain', newValue: 'new-chain', shouldUpdateHash: true },
    {
      key: 'project',
      newValue: ProjectId('new-project'),
      shouldUpdateHash: true,
    },
    { key: 'source', newValue: 'different-source', shouldUpdateHash: false },
    {
      key: 'sinceTimestamp',
      newValue: new UnixTime(1),
      shouldUpdateHash: false,
    },
    {
      key: 'untilTimestamp',
      newValue: new UnixTime(2),
      shouldUpdateHash: false,
    },
    { key: 'includeInTotal', newValue: false, shouldUpdateHash: false },
    { key: 'decimals', newValue: 666, shouldUpdateHash: false },
    { key: 'category', newValue: 'ether', shouldUpdateHash: false },
  ]

  const testCases = [
    {
      name: 'Total supply',
      mockFn: mockTotalSupply,
      extraFields: [
        {
          key: 'address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'Circulating supply',
      mockFn: mockCirculatingSupply,
      extraFields: [
        {
          key: 'address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'coingeckoId',
          newValue: CoingeckoId('new-id'),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'Escrow',
      mockFn: mockEscrow,
      extraFields: [
        {
          key: 'address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'escrowAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'Preminted',
      mockFn: mockPreminted,
      extraFields: [
        {
          key: 'address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'coingeckoId',
          newValue: CoingeckoId('new-id'),
          shouldUpdateHash: true,
        },
        {
          key: 'escrowAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'AggLayerL2Token',
      mockFn: mockAggLayerL2Token,
      extraFields: [
        {
          key: 'l1Address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'originNetwork',
          newValue: 2,
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'AggLayerNativeEtherPreminted',
      mockFn: mockAggLayerNativeEtherPreminted,
      extraFields: [
        {
          key: 'l2BridgeAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'premintedAmount',
          newValue: 200n,
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'AggLayerNativeEtherWrapped',
      mockFn: mockAggLayerNativeEtherWrapped,
      extraFields: [
        {
          key: 'wethAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'elasticChainL2Token',
      mockFn: mockElasticChainL2Token,
      extraFields: [
        {
          key: 'l1Address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'escrowAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'l2BridgeAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
    {
      name: 'elasticChainEther',
      mockFn: mockElasticChainEther,
      extraFields: [
        {
          key: 'escrowAddress',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
        {
          key: 'address',
          newValue: EthereumAddress.random(),
          shouldUpdateHash: true,
        },
      ],
    },
  ]

  testCases.forEach(({ name, mockFn, extraFields }) => {
    describe(name, () => {
      const allFields = [...baseFields, ...extraFields]
      allFields.forEach(({ key, newValue, shouldUpdateHash }) => {
        it(key, () => {
          const config = mockFn()
          const pre = createAmountId(config)
          const post = createAmountId({ ...config, [key]: newValue })

          if (shouldUpdateHash) {
            expect(pre).not.toEqual(post)
          } else {
            expect(pre).toEqual(post)
          }
        })
      })
    })
  })
})

function mockTotalSupply(): TotalSupplyEntry {
  return {
    ...mockBase(),
    type: 'totalSupply',
    address: EthereumAddress.random(),
  }
}

function mockCirculatingSupply(): CirculatingSupplyEntry {
  return {
    ...mockBase(),
    type: 'circulatingSupply',
    address: EthereumAddress.random(),
    coingeckoId: CoingeckoId('id'),
  }
}

function mockEscrow(): EscrowEntry {
  return {
    ...mockBase(),
    type: 'escrow',
    address: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
  }
}

function mockPreminted(): PremintedEntry {
  return {
    ...mockBase(),
    type: 'preminted',
    address: EthereumAddress.random(),
    coingeckoId: CoingeckoId('id'),
    escrowAddress: EthereumAddress.random(),
  }
}

function mockAggLayerL2Token(): AggLayerL2Token {
  return {
    ...mockBase(),
    type: 'aggLayerL2Token',
    l1Address: EthereumAddress.random(),
    originNetwork: 0,
    escrowAddress: EthereumAddress.random(),
  }
}

function mockAggLayerNativeEtherPreminted(): AggLayerNativeEtherPreminted {
  return {
    ...mockBase(),
    type: 'aggLayerNativeEtherPreminted',
    l2BridgeAddress: EthereumAddress.random(),
    premintedAmount: 100n,
    escrowAddress: EthereumAddress.random(),
  }
}

function mockAggLayerNativeEtherWrapped(): AggLayerNativeEtherWrapped {
  return {
    ...mockBase(),
    type: 'aggLayerNativeEtherWrapped',
    wethAddress: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
  }
}

function mockElasticChainL2Token(): ElasticChainL2Token {
  return {
    ...mockBase(),
    type: 'elasticChainL2Token',
    l1Address: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
    l2BridgeAddress: EthereumAddress.random(),
  }
}

function mockElasticChainEther(): ElasticChainEther {
  return {
    ...mockBase(),
    type: 'elasticChainEther',
    address: EthereumAddress.random(),
    escrowAddress: EthereumAddress.random(),
  }
}

function mockBase(): AmountConfigBase {
  return {
    assetId: AssetId('test'),
    chain: 'chain',
    dataSource: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: UnixTime.ZERO,
    untilTimestamp: UnixTime.ZERO,
    includeInTotal: true,
    decimals: 18,
    symbol: 'SYMBOL',
    isAssociated: false,
    category: 'other',
  }
}
