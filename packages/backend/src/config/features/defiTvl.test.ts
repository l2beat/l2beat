import type {
  Project,
  ProjectDefiTvlConfig,
  ProjectService,
} from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { FeatureFlags } from '../FeatureFlags'
import { getDefiTvlConfig } from './defiTvl'

describe(getDefiTvlConfig.name, () => {
  it('maps enabled external projects and ignores other TVL sources', async () => {
    const external = project('external', {
      source: 'defillama',
      protocolSlug: 'external-protocol',
      sinceTimestamp: UnixTime(123),
      chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
    })
    const projectService = mockProjectService([
      external,
      project('internal', { source: 'l2beat' }),
      project('unconfigured'),
    ])

    const config = await getDefiTvlConfig(
      projectService,
      new FeatureFlags('defi-tvl'),
      'https://api.llama.fi',
    )

    if (!config) throw new Error('DeFi TVL config not created')
    expect(config.apiUrl).toEqual('https://api.llama.fi')
    expect(config.projects).toEqual([
      {
        configurationId: config.projects[0]?.configurationId,
        projectId: external.id,
        protocolSlug: 'external-protocol',
        sinceTimestamp: 123,
        chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
      },
    ])
    expect(config.projects[0]?.configurationId).toHaveLength(12)
  })

  it('returns false when no external project is enabled', async () => {
    const projectService = mockProjectService([
      project('external', {
        source: 'defillama',
        protocolSlug: 'external-protocol',
        sinceTimestamp: UnixTime(123),
        chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
      }),
    ])

    const config = await getDefiTvlConfig(
      projectService,
      new FeatureFlags('defi-tvl,!defi-tvl.external'),
      'https://api.llama.fi',
    )

    expect(config).toEqual(false)
  })
})

function project(id: string, tvl?: ProjectDefiTvlConfig): Project<'defiInfo'> {
  return {
    id: ProjectId(id),
    slug: id,
    name: id,
    shortName: undefined,
    addedAt: UnixTime(0),
    defiInfo: { category: 'DEX', tvl },
  }
}

function mockProjectService(projects: Project<'defiInfo'>[]): ProjectService {
  return mockObject<ProjectService>({
    getProjects: mockFn().resolvesToOnce(projects),
  })
}
