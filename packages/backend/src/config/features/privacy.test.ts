import { Env } from '@l2beat/backend-tools'
import { ProjectService } from '@l2beat/config'
import { expect, mockFn, mockObject } from 'earl'
import { PrivacyRelayerSampleIndexer } from '../../modules/privacy/indexers/PrivacyRelayerSampleIndexer'
import { FeatureFlags } from '../FeatureFlags'
import { getPrivacyConfig } from './privacy'

const ps = new ProjectService()
const env = new Env({})

describe(getPrivacyConfig.name, () => {
  it('returns false if enabled privacy projects have no tracked buckets', async () => {
    const project = await ps.getProject({
      slug: 'privacy-pools',
      select: ['privacyInfo'],
    })
    if (!project) throw new Error('Privacy Pools project not found')

    const untrackedProject = {
      ...project,
      privacyInfo: {
        ...project.privacyInfo,
        relayerTracking: undefined,
        tokens: project.privacyInfo.tokens.map((token) => ({
          ...token,
          buckets: [],
        })),
      },
    }
    const projectService = mockObject<ProjectService>({
      getProjects: mockFn().resolvesToOnce([untrackedProject]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
    )

    expect(config).toEqual(false)
  })

  it('includes a project that only tracks relayers', async () => {
    const project = await ps.getProject({
      slug: 'privacy-pools',
      select: ['privacyInfo'],
    })
    if (!project) throw new Error('Privacy Pools project not found')

    const relayerOnlyProject = {
      ...project,
      privacyInfo: {
        ...project.privacyInfo,
        tokens: project.privacyInfo.tokens.map((token) => ({
          ...token,
          buckets: [],
        })),
      },
    }
    const projectService = mockObject<ProjectService>({
      getProjects: mockFn()
        .resolvesToOnce([relayerOnlyProject])
        .resolvesToOnce([]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
    )

    if (!config) throw new Error('Privacy config not created')
    expect(config.projects).toHaveLength(1)
    expect(config.flowConfigs).toHaveLength(0)
    expect(config.priceConfigs).toHaveLength(0)
    expect(config.relayerConfigs).toHaveLength(1)
    expect(config.blockTimestampConfigs).toHaveLength(1)
  })

  it('builds Railgun Waku sample configs without onchain dependencies', async () => {
    const project = await ps.getProject({
      slug: 'railgun',
      select: ['privacyInfo'],
    })
    if (!project) throw new Error('Railgun project not found')

    const wakuOnlyProject = {
      ...project,
      privacyInfo: {
        ...project.privacyInfo,
        tokens: project.privacyInfo.tokens.map((token) => ({
          ...token,
          buckets: [],
        })),
      },
    }
    const projectService = mockObject<ProjectService>({
      getProjects: mockFn()
        .resolvesToOnce([wakuOnlyProject])
        .resolvesToOnce([{ chainConfig: { name: 'ethereum', chainId: 1 } }]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
    )

    if (!config) throw new Error('Privacy config not created')
    const source = wakuOnlyProject.privacyInfo.relayerTracking
    if (source?.type !== 'railgunWaku') {
      throw new Error('Railgun should declare railgunWaku relayer tracking')
    }
    expect(config.relayerSampleConfigs).toEqual([
      {
        id: PrivacyRelayerSampleIndexer.idToConfigurationId({
          projectId: 'railgun',
          chain: 'ethereum',
          chainId: source.chainId,
          sinceTimestamp: source.sinceTimestamp,
        }),
        projectId: 'railgun',
        chain: 'ethereum',
        chainId: source.chainId,
        sinceTimestamp: source.sinceTimestamp,
      },
    ])
    expect(config.relayerConfigs).toHaveLength(0)
    expect(config.blockTimestampConfigs).toHaveLength(0)
    expect(config.chains).toHaveLength(0)
  })

  describe('price is tracked no later than flows', () => {
    it('every privacy bucket starts at or after its token price', async () => {
      const projects = await ps.getProjects({ select: ['privacyInfo'] })
      for (const project of projects) {
        for (const token of project.privacyInfo.tokens) {
          const priceSince = token.token.sinceTimestamp
          if (!token.token.priceId || !priceSince) continue
          for (const bucket of token.buckets) {
            expect(priceSince <= bucket.sinceTimestamp).toEqual(true)
          }
        }
      }
    })
  })
})
