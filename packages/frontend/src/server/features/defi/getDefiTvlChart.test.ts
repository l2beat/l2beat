import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { env } from '~/env'
import { getDefiTvlChart } from './getDefiTvlChart'

describe(getDefiTvlChart.name, () => {
  const originalMock = env.MOCK

  afterEach(() => {
    env.MOCK = originalMock
  })

  it('serves a configured external project through the unified endpoint', async () => {
    env.MOCK = true
    const to = UnixTime.toStartOf(UnixTime.now(), 'hour')

    const result = await getDefiTvlChart({
      projectId: 'uniswapv3',
      range: [to - 7 * UnixTime.DAY, to],
    })

    expect(result.chart.length).toBeGreaterThan(0)
    expect(
      result.chart.every(([, value]) => typeof value === 'number'),
    ).toEqual(true)
    expect(result.syncedUntil).not.toEqual(undefined)
  })

  it('returns no chart for a project without a TVL source', async () => {
    env.MOCK = true
    const to = UnixTime.toStartOf(UnixTime.now(), 'hour')

    const result = await getDefiTvlChart({
      projectId: 'chainlink',
      range: [to - 7 * UnixTime.DAY, to],
    })

    expect(result).toEqual({
      chart: [],
      syncedUntil: undefined,
      sourceTimestamp: undefined,
    })
  })
})
