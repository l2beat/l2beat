import {
  AmountConfigBase,
  CirculatingSupplyEntry,
  CoingeckoId,
  EscrowEntry,
  EthereumAddress,
  PremintedEntry,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createAmountId } from './createAmountId'

describe(createAmountId.name, () => {
  const baseFields = [
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

function mockBase(): AmountConfigBase {
  return {
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
