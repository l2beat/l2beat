import { expect } from 'earl'
import { getPrivacyTrackedChains } from './getPrivacyTrackedChains'

describe(getPrivacyTrackedChains.name, () => {
  const ethereum = {
    slug: 'ethereum',
    name: 'Ethereum',
    chainConfig: { name: 'ethereum' },
  }
  const polygon = {
    slug: 'polygon-pos',
    name: 'Polygon PoS',
    chainConfig: { name: 'polygonpos' },
  }
  const arbitrum = {
    slug: 'arbitrum',
    name: 'Arbitrum One',
    chainConfig: { name: 'arbitrum' },
    scalingInfo: {},
  }
  const projects = [ethereum, polygon, arbitrum]

  it('resolves chain names in configured order', () => {
    const result = getPrivacyTrackedChains(
      ['polygonpos', 'ethereum'],
      projects,
      [],
    )
    expect(result.map((c) => c.id)).toEqual(['polygonpos', 'ethereum'])
    expect(result.map((c) => c.name)).toEqual(['Polygon PoS', 'Ethereum'])
  })

  it('uses the project slug for the icon', () => {
    const [result] = getPrivacyTrackedChains(['polygonpos'], projects, [])
    expect(result?.iconUrl).toEqual('/icons/polygon-pos.png')
  })

  it('links only chains that have a project page', () => {
    const [ethereumChain, arbitrumChain] = getPrivacyTrackedChains(
      ['ethereum', 'arbitrum'],
      projects,
      [],
    )
    expect(ethereumChain?.href).toEqual(undefined)
    expect(arbitrumChain?.href).toEqual('/layer2s/projects/arbitrum')
  })

  it('skips chains without a matching chainConfig', () => {
    const result = getPrivacyTrackedChains(
      ['ethereum', 'unknown'],
      projects,
      [],
    )
    expect(result.map((c) => c.id)).toEqual(['ethereum'])
  })
})
