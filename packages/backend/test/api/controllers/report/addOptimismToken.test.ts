import { CoingeckoId, mock, UnixTime } from '@l2beat/common'
import { expect } from 'earljs'

import { addOptimismToken } from '../../../../src/api/controllers/report/addOptimismToken'
import {
  OutputEntry,
  ProjectEntry,
  TokenEntry,
} from '../../../../src/api/controllers/report/aggregateReportsDaily'
import { PriceRepository } from '../../../../src/peripherals/database/PriceRepository'

describe(addOptimismToken.name, () => {
  const AIRDROP_DATE = UnixTime.fromDate(new Date('2022-05-30'))

  const priceRepository = mock<PriceRepository>({
    getByToken: async (token) => {
      const result = {
        timestamp: AIRDROP_DATE,
        coingeckoId: token,
      }

      if (token === CoingeckoId('optimism')) {
        return [{ ...result, priceUsd: 9 }]
      }
      if (token === CoingeckoId('ethereum')) {
        return [{ ...result, priceUsd: 1500 }]
      }
      return [
        {
          ...result,
          priceUsd: 0,
        },
      ]
    },
  })

  it('before airdrop', async () => {
    const projects: Map<string, ProjectEntry> = new Map()
    const tokens: Map<string, TokenEntry> = new Map()
    projects.set('Optimism', { value: { eth: 0n, usd: 0n }, tokens })
    const entries: OutputEntry[] = [
      {
        timestamp: UnixTime.fromDate(new Date('2022-05-29')),
        value: {
          eth: 0n,
          usd: 0n,
        },
        projects,
      },
    ]

    await addOptimismToken(entries, priceRepository)
    expect(entries).toEqual([
      {
        timestamp: UnixTime.fromDate(new Date('2022-05-29')),
        value: {
          eth: 0n,
          usd: 0n,
        },
        projects,
      },
    ])
  })

  it('after airdrop', async () => {
    const projects: Map<string, ProjectEntry> = new Map()
    const tokens: Map<string, TokenEntry> = new Map()
    projects.set('Optimism', { value: { eth: 0n, usd: 0n }, tokens })
    const entries: OutputEntry[] = [
      {
        timestamp: UnixTime.fromDate(new Date('2022-05-30')),
        value: {
          eth: 0n,
          usd: 0n,
        },
        projects,
      },
    ]

    const balance = 214_748_364n
    const price = 9n
    const priceEth = 1500n
    const usdTVL = balance * price * 10n ** 2n
    const ethTVL = (usdTVL * 10n ** 4n) / priceEth

    await addOptimismToken(entries, priceRepository)
    expect(entries).toEqual([
      {
        timestamp: UnixTime.fromDate(new Date('2022-05-30')),
        value: {
          eth: ethTVL,
          usd: usdTVL,
        },
        projects,
      },
    ])
    expect(projects.get('Optimism')).toEqual({
      value: {
        eth: ethTVL,
        usd: usdTVL,
      },
      tokens,
    })
  })
})
