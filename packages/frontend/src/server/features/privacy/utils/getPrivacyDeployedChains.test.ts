import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getPrivacyDeployedChains,
  type PrivacyChainProject,
} from './getPrivacyDeployedChains'

describe(getPrivacyDeployedChains.name, () => {
  const ethereum = chainProject('ethereum', 'Ethereum', 'ethereum')
  const polygon = chainProject('polygon-pos', 'Polygon PoS', 'polygonpos')
  const arbitrum = chainProject('arbitrum', 'Arbitrum One', 'arbitrum', {
    scalingInfo: {},
  })
  const chainProjects = [ethereum, polygon, arbitrum]

  it('resolves chain names in configured order', () => {
    const result = getPrivacyDeployedChains(
      ['polygonpos', 'ethereum'],
      chainProjects,
    )
    expect(result.map((c) => c.id)).toEqual(['polygonpos', 'ethereum'])
    expect(result.map((c) => c.name)).toEqual(['Polygon PoS', 'Ethereum'])
  })

  it('uses the project slug for the icon', () => {
    const [result] = getPrivacyDeployedChains(['polygonpos'], chainProjects)
    expect(result?.iconUrl).toEqual('/icons/polygon-pos.png')
  })

  it('links only chains that are scaling projects', () => {
    const [ethereumChain, arbitrumChain] = getPrivacyDeployedChains(
      ['ethereum', 'arbitrum'],
      chainProjects,
    )
    expect(ethereumChain?.href).toEqual(undefined)
    expect(arbitrumChain?.href).toEqual('/scaling/projects/arbitrum')
  })

  it('skips chains without a matching chainConfig', () => {
    const result = getPrivacyDeployedChains(
      ['ethereum', 'unknown'],
      chainProjects,
    )
    expect(result.map((c) => c.id)).toEqual(['ethereum'])
  })
})

function chainProject(
  slug: string,
  name: string,
  chainName: string,
  extra: object = {},
): PrivacyChainProject {
  return {
    id: ProjectId(slug),
    slug,
    name,
    chainConfig: { name: chainName },
    ...extra,
  } as unknown as PrivacyChainProject
}
