import type { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getDaBeatConfig } from './dabeat'

const projects = [
  {
    id: ProjectId('ethereum'),
    daLayer: {
      economicSecurity: { token: { coingeckoId: 'ethereum' } },
    },
  },
  // A second layer so the exclusion test can show the rest survives
  {
    id: ProjectId('other-layer'),
    daLayer: {
      economicSecurity: { token: { coingeckoId: 'other-token' } },
    },
  },
]

function mockProjectService(): ProjectService {
  return mockObject<ProjectService>({
    getProjects: mockFn().resolvesToOnce(projects),
  })
}

describe(getDaBeatConfig.name, () => {
  it('includes all projects by default', async () => {
    const config = await getDaBeatConfig(
      mockProjectService(),
      new FeatureFlags('da-beat'),
    )

    expect(config.projectsForDaBeatStats).toEqual([
      ProjectId('ethereum'),
      ProjectId('other-layer'),
    ])
    expect(config.coingeckoIds).toEqual(['ethereum', 'other-token'])
  })

  it('excludes a project disabled with !da-beat.<project>', async () => {
    const config = await getDaBeatConfig(
      mockProjectService(),
      new FeatureFlags('da-beat,!da-beat.ethereum'),
    )

    expect(config.projectsForDaBeatStats).toEqual([ProjectId('other-layer')])
    expect(config.coingeckoIds).toEqual(['other-token'])
  })
})
