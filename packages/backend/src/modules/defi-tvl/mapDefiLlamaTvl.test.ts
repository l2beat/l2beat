import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DefiLlamaProtocol } from './DefiLlamaClient'
import { mapDefiLlamaTvl } from './mapDefiLlamaTvl'
import type { DefiTvlProjectConfig } from './types'

describe(mapDefiLlamaTvl.name, () => {
  const target = UnixTime.fromDate(new Date('2026-08-31T12:00:00Z'))
  const config: DefiTvlProjectConfig = {
    configurationId: '123456789abc',
    projectId: ProjectId('uniswapv3'),
    protocolSlug: 'uniswap-v3',
    sinceTimestamp: UnixTime.fromDate(new Date('2021-05-05T00:00:00Z')),
    chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
  }

  it('imports daily history and adds the current hourly observation', () => {
    const day1 = UnixTime.fromDate(new Date('2026-08-29T00:00:00Z'))
    const day2 = UnixTime.fromDate(new Date('2026-08-30T00:00:00Z'))
    const sourceTimestamp = UnixTime.fromDate(new Date('2026-08-31T12:30:00Z'))
    const data = protocol({
      Ethereum: {
        current: 130,
        history: [
          { date: day1, totalLiquidityUSD: 100 },
          { date: day2, totalLiquidityUSD: 110 },
          { date: sourceTimestamp, totalLiquidityUSD: 125 },
        ],
      },
      Arbitrum: {
        current: 999,
        history: [{ date: sourceTimestamp, totalLiquidityUSD: 999 }],
      },
    })

    const result = mapDefiLlamaTvl(data, config, config.sinceTimestamp, target)

    expect(result).toEqual([
      record(day1, day1, 100),
      record(day2, day2, 110),
      record(target, sourceTimestamp, 130),
    ])
  })

  it('reconciles the last 30 days on incremental updates', () => {
    const withinWindow = UnixTime.toStartOf(target - 29 * UnixTime.DAY, 'day')
    const outsideWindow = UnixTime.toStartOf(target - 31 * UnixTime.DAY, 'day')
    const data = protocol({
      Ethereum: {
        current: 130,
        history: [
          { date: outsideWindow, totalLiquidityUSD: 90 },
          { date: withinWindow, totalLiquidityUSD: 105 },
          { date: target, totalLiquidityUSD: 125 },
        ],
      },
    })

    const result = mapDefiLlamaTvl(
      data,
      config,
      target - UnixTime.HOUR + 1,
      target,
    )

    expect(result).toEqual([
      record(withinWindow, withinWindow, 105),
      record(target, target, 130),
    ])
  })

  it('fails closed when the configured chain is missing', () => {
    const data = protocol({
      Arbitrum: {
        current: 100,
        history: [{ date: target, totalLiquidityUSD: 100 }],
      },
    })

    expect(() =>
      mapDefiLlamaTvl(data, config, config.sinceTimestamp, target),
    ).toThrow('Missing current TVL for Ethereum')
  })

  it('fails closed on stale current data', () => {
    const stale = target - 7 * UnixTime.HOUR
    const data = protocol({
      Ethereum: {
        current: 100,
        history: [{ date: stale, totalLiquidityUSD: 100 }],
      },
    })

    expect(() =>
      mapDefiLlamaTvl(data, config, config.sinceTimestamp, target),
    ).toThrow('Stale TVL for Ethereum')
  })

  function record(
    timestamp: UnixTime,
    sourceTimestamp: UnixTime,
    valueUsd: number,
  ) {
    return {
      configurationId: config.configurationId,
      projectId: config.projectId,
      chain: 'ethereum',
      timestamp,
      sourceTimestamp,
      valueUsd,
    }
  }
})

function protocol(
  chains: Record<
    string,
    {
      current: number
      history: { date: number; totalLiquidityUSD: number }[]
    }
  >,
): DefiLlamaProtocol {
  return {
    currentChainTvls: Object.fromEntries(
      Object.entries(chains).map(([chain, data]) => [chain, data.current]),
    ),
    chainTvls: Object.fromEntries(
      Object.entries(chains).map(([chain, data]) => [
        chain,
        { tvl: data.history },
      ]),
    ),
  }
}
