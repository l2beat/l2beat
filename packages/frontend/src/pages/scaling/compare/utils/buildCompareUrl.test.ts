import { expect } from 'earl'
import { buildCompareUrl } from './buildCompareUrl'

const PATH = '/scaling/compare'

describe(buildCompareUrl.name, () => {
  it('returns a bare path for the default state', () => {
    const url = buildCompareUrl(PATH, {
      metric: 'tvs',
      projects: [],
      range: '1y',
      scale: 'linear',
    })

    expect(url).toEqual(PATH)
  })

  it('serializes projects as a comma-separated list', () => {
    const url = buildCompareUrl(PATH, {
      metric: 'tvs',
      projects: ['arbitrum', 'base'],
      range: '1y',
      scale: 'linear',
    })

    expect(url).toEqual('/scaling/compare?projects=arbitrum,base')
  })

  it('omits defaults and serializes non-default range and scale', () => {
    const url = buildCompareUrl(PATH, {
      metric: 'tvs',
      projects: ['arbitrum'],
      range: '30d',
      scale: 'symlog',
    })

    expect(url).toEqual(
      '/scaling/compare?projects=arbitrum&range=30d&scale=log',
    )
  })

  it('serializes a custom range as from-to', () => {
    const url = buildCompareUrl(PATH, {
      metric: 'tvs',
      projects: [],
      range: { from: 1700000000, to: 1710000000 },
      scale: 'linear',
    })

    expect(url).toEqual('/scaling/compare?range=1700000000-1710000000')
  })
})
