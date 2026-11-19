import { expect } from 'earl'
import { toRow } from './liquidStakingTvlRows'

describe(toRow.name, () => {
  const point = {
    timestamp: 100,
    projects: { lido: 9, rocketpool: 1 },
    ethStaked: 30,
    ethPrice: 2,
  }

  it('gives Others the stake the protocols do not hold, in either unit', () => {
    expect(toRow(point, ['lido', 'rocketpool'], 'eth')).toEqual({
      timestamp: 100,
      lido: 9,
      rocketpool: 1,
      others: 20,
    })
    expect(toRow(point, ['lido', 'rocketpool'], 'usd')).toEqual({
      timestamp: 100,
      lido: 18,
      rocketpool: 2,
      others: 40,
    })
  })

  it('leaves Others out when a protocol has no value, rather than give it that ETH', () => {
    const row = toRow(
      { ...point, projects: { lido: 9, rocketpool: null } },
      ['lido', 'rocketpool'],
      'eth',
    )
    expect(row.others).toEqual(null)
    expect(row.lido).toEqual(9)
  })

  it('leaves Others out when the protocols hold more than the stake', () => {
    const row = toRow({ ...point, ethStaked: 5 }, ['lido', 'rocketpool'], 'eth')
    expect(row.others).toEqual(null)
  })

  it('has no USD values without a price', () => {
    const row = toRow({ ...point, ethPrice: null }, ['lido'], 'usd')
    expect(row).toEqual({ timestamp: 100, lido: null, others: null })
  })
})
