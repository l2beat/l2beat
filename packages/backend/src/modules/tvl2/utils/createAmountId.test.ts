import {
  CirculatingSupplyEntry,
  CoingeckoId,
  EscrowEntry,
  EthereumAddress,
  ProjectId,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { createAmountId } from './createAmountId'

describe(createAmountId.name, () => {
  const baseFields = [
    {
      key: 'chain',
      newValue: 'new-chain',
      shouldUpdateHash: true,
    },
    {
      key: 'project',
      newValue: ProjectId('new-project'),
      shouldUpdateHash: true,
    },
    {
      key: 'source',
      newValue: 'different-source',
      shouldUpdateHash: false,
    },
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
    {
      key: 'includeInTotal',
      newValue: false,
      shouldUpdateHash: false,
    },
    {
      key: 'decimals',
      newValue: 666,
      shouldUpdateHash: false,
    },
  ]

  describe('Total supply', () => {
    const address = EthereumAddress.random()

    const fields = [
      {
        key: 'address',
        newValue: EthereumAddress.random(),
        shouldUpdateHash: true,
      },
    ]

    // @ts-expect-error tests
    for (const f of baseFields.concat(fields)) {
      it(f.key, () => {
        const pre = createAmountId(mockTotalSupply(address))

        const post = createAmountId({
          ...mockTotalSupply(address),
          ...{ [f.key]: f.newValue },
        })

        if (f.shouldUpdateHash) {
          expect(pre).not.toEqual(post)
        } else {
          expect(pre).toEqual(post)
        }
      })
    }
  })

  describe('Circulating supply', () => {
    const address = EthereumAddress.random()
    const coingeckoId = CoingeckoId('id')

    const fields = [
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
    ]

    // @ts-expect-error tests
    for (const f of baseFields.concat(fields)) {
      it(f.key, () => {
        const pre = createAmountId(mockCirculatingSupply(address, coingeckoId))

        const post = createAmountId({
          ...mockCirculatingSupply(address, coingeckoId),
          ...{ [f.key]: f.newValue },
        })

        if (f.shouldUpdateHash) {
          expect(pre).not.toEqual(post)
        } else {
          expect(pre).toEqual(post)
        }
      })
    }
  })

  describe('Escrow', () => {
    const address = EthereumAddress.random()
    const escrowAddress = EthereumAddress.random()

    const fields = [
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
    ]

    // @ts-expect-error tests
    for (const f of baseFields.concat(fields)) {
      it(f.key, () => {
        const pre = createAmountId(mockEscrow(address, escrowAddress))

        const post = createAmountId({
          ...mockEscrow(address, escrowAddress),
          ...{ [f.key]: f.newValue },
        })

        if (f.shouldUpdateHash) {
          expect(pre).not.toEqual(post)
        } else {
          expect(pre).toEqual(post)
        }
      })
    }
  })
})

function mockTotalSupply(address: EthereumAddress): TotalSupplyEntry {
  return {
    ...mock(),
    type: 'totalSupply',
    address,
  }
}

function mockCirculatingSupply(
  address: EthereumAddress,
  coingeckoId: CoingeckoId,
): CirculatingSupplyEntry {
  return {
    ...mock(),
    type: 'circulatingSupply',
    coingeckoId,
    address,
  }
}

function mockEscrow(
  address: EthereumAddress,
  escrowAddress: EthereumAddress,
): EscrowEntry {
  return {
    ...mock(),
    type: 'escrow',
    address,
    escrowAddress,
  }
}

function mock() {
  return {
    chain: 'chain',
    project: ProjectId('project'),
    source: 'canonical' as const,
    sinceTimestamp: UnixTime.ZERO,
    untilTimestamp: UnixTime.ZERO,
    includeInTotal: true,
    decimals: 18,
  }
}
