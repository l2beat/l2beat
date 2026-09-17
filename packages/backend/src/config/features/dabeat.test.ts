import { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { FeatureFlags } from '../FeatureFlags'
import { getDaBeatConfig } from './dabeat'

const env = new Env({ CELESTIA_API_URL: 'https://celestia.example.com' })

const projects = [
  {
    id: ProjectId('avail'),
    daLayer: {
      economicSecurity: { token: { coingeckoId: 'avail' } },
    },
  },
  {
    id: ProjectId('celestia'),
    daLayer: {
      economicSecurity: { token: { coingeckoId: 'celestia' } },
    },
  },
]

function mockProjectService(): ProjectService {
  return {
    getProjects: vi.fn().mockResolvedValueOnce(projects),
  } as unknown as ProjectService
}

describe(getDaBeatConfig.name, () => {
  it('includes all projects by default', async () => {
    const config = await getDaBeatConfig(
      mockProjectService(),
      env,
      new FeatureFlags('da-beat'),
    )

    expect(config.projectsForDaBeatStats).toStrictEqual([
      ProjectId('avail'),
      ProjectId('celestia'),
    ])
    expect(config.coingeckoIds).toStrictEqual(['avail', 'celestia'])
  })

  it('excludes a project disabled with !da-beat.<project>', async () => {
    const config = await getDaBeatConfig(
      mockProjectService(),
      env,
      new FeatureFlags('da-beat,!da-beat.avail'),
    )

    expect(config.projectsForDaBeatStats).toStrictEqual([ProjectId('celestia')])
    expect(config.coingeckoIds).toStrictEqual(['celestia'])
  })
})
