import { AssetId, mock, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import {
  addOptimismToken,
  addOptimismTokenV2,
} from '../../../../src/api/controllers/report/addOptimismToken'
import {
  OutputEntry,
  OutputEntryV2,
  ProjectEntry,
  ProjectEntryV2,
  TokenEntry,
} from '../../../../src/api/controllers/report/aggregateReportsDaily'
import { PriceRepository } from '../../../../src/peripherals/database/PriceRepository'

describe(addOptimismToken.name, () => {
  const balance = 214_748_364n * 10n ** 18n
  const priceOp = 9n
  const priceEth = 1500n
  const usdTVL = (balance * priceOp) / 10n ** (18n - 2n)
  const ethTVL = (usdTVL * 10n ** 4n) / priceEth

  const DAY_BEFORE_AIRDROP = UnixTime.fromDate(new Date('2022-05-29'))
  const AIRDROP_DAY = UnixTime.fromDate(new Date('2022-05-30'))

  const priceRepository = mock<PriceRepository>({
    getByToken: async (token) => {
      const priceUsd =
        token === AssetId('op-optimism')
          ? Number(priceOp)
          : token === AssetId.ETH
          ? Number(priceEth)
          : 0
      return [
        {
          timestamp: AIRDROP_DAY,
          assetId: token,
          priceUsd,
        },
      ]
    },
  })

  it('before airdrop', async () => {
    const entries: OutputEntry[] = [
      mockEntry({ timestamp: DAY_BEFORE_AIRDROP }),
    ]

    await addOptimismToken(entries, priceRepository)
    expect(entries).toEqual([
      {
        timestamp: DAY_BEFORE_AIRDROP,
        value: { eth: 0n, usd: 0n },
        projects: entries[0].projects,
      },
    ])
  })

  it('after airdrop', async () => {
    const entries: OutputEntry[] = [mockEntry({ timestamp: AIRDROP_DAY })]

    await addOptimismToken(entries, priceRepository)

    const tokens = new Map<string, TokenEntry>()
    tokens.set('OP', { usd: usdTVL, eth: ethTVL, balance, decimals: 18 })
    const projects = new Map<string, ProjectEntry>()
    projects.set('Optimism', { value: { usd: usdTVL, eth: ethTVL }, tokens })
    expect(entries).toEqual([
      {
        timestamp: AIRDROP_DAY,
        value: { eth: ethTVL, usd: usdTVL },
        projects,
      },
    ])
  })

  it('during airdrop', async () => {
    const entries: OutputEntry[] = [
      mockEntry({ timestamp: DAY_BEFORE_AIRDROP }),
      mockEntry({ timestamp: AIRDROP_DAY }),
    ]

    await addOptimismToken(entries, priceRepository)

    const tokens = new Map<string, TokenEntry>()
    tokens.set('OP', { usd: usdTVL, eth: ethTVL, balance, decimals: 18 })
    const projects = new Map<string, ProjectEntry>()
    projects.set('Optimism', { value: { usd: usdTVL, eth: ethTVL }, tokens })
    expect(entries).toEqual([
      {
        timestamp: DAY_BEFORE_AIRDROP,
        value: { eth: 0n, usd: 0n },
        projects: entries[0].projects,
      },
      {
        timestamp: AIRDROP_DAY,
        value: { eth: ethTVL, usd: usdTVL },
        projects,
      },
    ])
  })
})

describe(addOptimismTokenV2.name, () => {
  const balance = 214_748_364n * 10n ** 18n
  const priceOp = 9n
  const priceEth = 1500n
  const usdTVL = (balance * priceOp) / 10n ** (18n - 2n)
  const ethTVL = (usdTVL * 10n ** 4n) / priceEth

  const DAY_BEFORE_AIRDROP = UnixTime.fromDate(new Date('2022-05-29'))
  const AIRDROP_DAY = UnixTime.fromDate(new Date('2022-05-30'))

  const priceRepository = mock<PriceRepository>({
    getByToken: async (token) => {
      const priceUsd =
        token === AssetId('op-optimism')
          ? Number(priceOp)
          : token === AssetId.ETH
          ? Number(priceEth)
          : 0
      return [
        {
          timestamp: AIRDROP_DAY,
          assetId: token,
          priceUsd,
        },
      ]
    },
  })

  it('before airdrop', async () => {
    const entries: OutputEntryV2[] = [
      mockEntryV2({ timestamp: DAY_BEFORE_AIRDROP }),
    ]

    await addOptimismTokenV2(entries, priceRepository)
    expect(entries).toEqual([
      {
        timestamp: DAY_BEFORE_AIRDROP,
        value: { eth: 0n, usd: 0n },
        projects: entries[0].projects,
      },
    ])
  })

  it('after airdrop', async () => {
    const entries: OutputEntryV2[] = [mockEntryV2({ timestamp: AIRDROP_DAY })]

    await addOptimismTokenV2(entries, priceRepository)

    const tokens = new Map<AssetId, TokenEntry>()
    tokens.set(AssetId('op-optimism'), {
      usd: usdTVL,
      eth: ethTVL,
      balance,
      decimals: 18,
    })
    const projects = new Map<string, ProjectEntryV2>()
    projects.set('Optimism', { value: { usd: usdTVL, eth: ethTVL }, tokens })
    expect(entries).toEqual([
      {
        timestamp: AIRDROP_DAY,
        value: { eth: ethTVL, usd: usdTVL },
        projects,
      },
    ])
  })

  it('during airdrop', async () => {
    const entries: OutputEntryV2[] = [
      mockEntryV2({ timestamp: DAY_BEFORE_AIRDROP }),
      mockEntryV2({ timestamp: AIRDROP_DAY }),
    ]

    await addOptimismTokenV2(entries, priceRepository)

    const tokens = new Map<AssetId, TokenEntry>()
    tokens.set(AssetId('op-optimism'), {
      usd: usdTVL,
      eth: ethTVL,
      balance,
      decimals: 18,
    })
    const projects = new Map<string, ProjectEntryV2>()
    projects.set('Optimism', { value: { usd: usdTVL, eth: ethTVL }, tokens })
    expect(entries).toEqual([
      {
        timestamp: DAY_BEFORE_AIRDROP,
        value: { eth: 0n, usd: 0n },
        projects: entries[0].projects,
      },
      {
        timestamp: AIRDROP_DAY,
        value: { eth: ethTVL, usd: usdTVL },
        projects,
      },
    ])
  })
})

export function mockEntry(
  entry?: Partial<OutputEntry>,
  projectName = 'Optimism',
) {
  const projects = new Map<string, ProjectEntry>()
  const tokens = new Map<string, TokenEntry>()
  projects.set(projectName, { value: { eth: 0n, usd: 0n }, tokens })

  return {
    timestamp: UnixTime.fromDate(new Date('2022-05-30')),
    value: {
      eth: 0n,
      usd: 0n,
    },
    projects,
    ...entry,
  }
}

export function mockEntryV2(
  entry?: Partial<OutputEntryV2>,
  projectName = 'Optimism',
) {
  const projects = new Map<string, ProjectEntryV2>()
  const tokens = new Map<AssetId, TokenEntry>()
  projects.set(projectName, { value: { eth: 0n, usd: 0n }, tokens })

  return {
    timestamp: UnixTime.fromDate(new Date('2022-05-30')),
    value: {
      eth: 0n,
      usd: 0n,
    },
    projects,
    ...entry,
  }
}
