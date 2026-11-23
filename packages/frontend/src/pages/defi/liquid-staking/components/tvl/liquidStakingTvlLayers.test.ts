import { expect } from 'earl'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import {
  getProtocolLayers,
  getToggledScope,
  inUnit,
  NOT_STAKED_KEY,
  OTHERS_KEY,
  stackOnKnown,
  VIEWS,
} from './liquidStakingTvlLayers'

const breakdown: TvlBreakdown = {
  timestamp: 1,
  projects: { lido: 9, rocketpool: null },
  liquid: null,
  others: null,
  staked: 30,
  notStaked: 70,
  supply: 100,
  ethPrice: 2,
}
describe(stackOnKnown.name, () => {
  const layers = stackOnKnown([
    ...getProtocolLayers([
      { key: 'lido', label: 'Lido', color: 'red' },
      { key: 'rocketpool', label: 'Rocket Pool', color: 'blue' },
    ]),
    ...VIEWS.supply.layers,
  ])
  const values = (row: TvlBreakdown) => layers.map((layer) => layer.value(row))

  it('leaves out every layer above a missing one, which has no base', () => {
    expect(values(breakdown)).toEqual([9, null, null, null])
  })

  it('draws every layer of a complete day', () => {
    expect(
      values({
        ...breakdown,
        projects: { lido: 9, rocketpool: 1 },
        others: 20,
      }),
    ).toEqual([9, 1, 20, 70])
  })
})

describe(getToggledScope.name, () => {
  it('switches views with Others and Not staked, and not with a protocol', () => {
    expect(getToggledScope('staked', OTHERS_KEY)).toEqual('liquid')
    expect(getToggledScope('liquid', OTHERS_KEY)).toEqual('staked')
    expect(getToggledScope('staked', NOT_STAKED_KEY)).toEqual('supply')
    expect(getToggledScope('supply', NOT_STAKED_KEY)).toEqual('staked')
    expect(getToggledScope('supply', 'lido')).toEqual(undefined)
  })
})

describe(inUnit.name, () => {
  it("prices every amount at the day's price", () => {
    expect(inUnit(breakdown, 'usd')).toEqual({
      ...breakdown,
      projects: { lido: 18, rocketpool: null },
      staked: 60,
      notStaked: 140,
      supply: 200,
    })
  })

  it('has no USD amounts without a price', () => {
    const usd = inUnit({ ...breakdown, ethPrice: null }, 'usd')
    expect(usd.projects.lido).toEqual(null)
    expect(usd.staked).toEqual(null)
  })
})
