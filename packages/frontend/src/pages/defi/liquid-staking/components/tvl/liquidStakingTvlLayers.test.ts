import { expect } from 'earl'
import type { TvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import {
  getLayers,
  getToggledScope,
  inUnit,
  NOT_STAKED_KEY,
  OTHERS_KEY,
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
const series = [{ key: 'lido', label: 'Lido', color: 'red' }]

describe(getLayers.name, () => {
  it('stacks Others in Staked view, and the ETH not staked on top in vs. Supply view', () => {
    const keys = (scope: 'staked' | 'supply' | 'liquid') =>
      getLayers(series, scope).map((layer) => layer.key)
    expect(keys('liquid')).toEqual(['lido'])
    expect(keys('staked')).toEqual(['lido', OTHERS_KEY])
    expect(keys('supply')).toEqual(['lido', OTHERS_KEY, NOT_STAKED_KEY])
  })

  it('leaves the ETH not staked out above an incomplete stack', () => {
    const notStaked = getLayers(series, 'supply').at(-1)
    expect(notStaked?.value(breakdown)).toEqual(null)
    expect(notStaked?.value({ ...breakdown, others: 20 })).toEqual(70)
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
