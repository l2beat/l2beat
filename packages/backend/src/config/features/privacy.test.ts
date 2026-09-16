import { Env } from '@l2beat/backend-tools'
import {
  type ChainConfig,
  type ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { PrivacyRelayerSampler } from '../../modules/privacy/PrivacyRelayerSampler'
import { ERC20_TRANSFER_TOPIC } from '../../modules/privacy/utils/erc20'
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
      getProjects: vi.fn().mockResolvedValueOnce([untrackedProject]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
      [],
    )

    expect(config).toStrictEqual(false)
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
      getProjects: vi.fn().mockResolvedValueOnce([relayerOnlyProject]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
      [],
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
      getProjects: vi.fn().mockResolvedValueOnce([wakuOnlyProject]),
    })

    const config = await getPrivacyConfig(
      projectService,
      env,
      new FeatureFlags('privacy'),
      [{ name: 'ethereum', chainId: 1, apis: [] } as ChainConfig],
    )

    if (!config) throw new Error('Privacy config not created')
    const source = wakuOnlyProject.privacyInfo.relayerTracking
    if (source?.type !== 'railgunWaku') {
      throw new Error('Railgun should declare railgunWaku relayer tracking')
    }
    expect(config.relayerSampleConfigs).toStrictEqual([
      {
        id: PrivacyRelayerSampler.idToConfigurationId({
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

  describe('erc20Transfer sources', () => {
    const POOL = EthereumAddress('0x1111111111111111111111111111111111111111')
    const TOKEN = EthereumAddress('0x2222222222222222222222222222222222222222')
    const POOL_TOPIC = `0x${'00'.repeat(12)}${POOL.slice(2).toLowerCase()}`
    type FlowSource = ProjectPrivacyToken['buckets'][number]['withdrawal']

    async function getFlowConfigs(deposit: FlowSource, withdrawal: FlowSource) {
      const project = await ps.getProject({
        slug: 'privacy-pools',
        select: ['privacyInfo'],
      })
      if (!project) throw new Error('Privacy Pools project not found')

      const token: ProjectPrivacyToken = {
        token: {
          address: TOKEN,
          iconUrl: undefined,
          symbol: 'TKN',
          decimals: 18,
          priceId: 'tkn',
          sinceTimestamp: UnixTime(1000),
        },
        buckets: [
          {
            id: 'bucket',
            type: 'pool',
            label: 'TKN',
            address: ChainSpecificAddress.fromLong('ethereum', POOL),
            sinceTimestamp: UnixTime(1000),
            deposit,
            withdrawal,
          },
        ],
      }
      const projectService = mockObject<ProjectService>({
        getProjects: vi.fn().mockResolvedValueOnce([
          {
            ...project,
            privacyInfo: {
              ...project.privacyInfo,
              relayerTracking: undefined,
              tokens: [token],
            },
          },
        ]),
      })

      const config = await getPrivacyConfig(
        projectService,
        env,
        new FeatureFlags('privacy'),
        [],
      )
      if (!config) throw new Error('Privacy config not created')
      return config.flowConfigs
    }

    it('queries the token contract filtered by the pool as receiver or sender', async () => {
      const [deposit, withdrawal] = await getFlowConfigs(
        {
          event: ERC20_TRANSFER_TOPIC,
          extractor: 'erc20Transfer',
          params: { to: POOL },
        },
        {
          event: ERC20_TRANSFER_TOPIC,
          extractor: 'erc20Transfer',
          params: { from: POOL },
        },
      )

      expect(deposit).toStrictEqual(
        expect.objectContaining({
          direction: 'deposit',
          chain: 'ethereum',
          address: TOKEN,
          event: ERC20_TRANSFER_TOPIC,
          topics: [null, POOL_TOPIC],
        }),
      )
      expect(withdrawal).toStrictEqual(
        expect.objectContaining({
          direction: 'withdrawal',
          chain: 'ethereum',
          address: TOKEN,
          event: ERC20_TRANSFER_TOPIC,
          topics: [POOL_TOPIC],
        }),
      )
      expect(deposit.id).not.toStrictEqual(withdrawal.id)
    })

    it('filters both ends when from and to are set', async () => {
      const [deposit] = await getFlowConfigs(
        {
          event: ERC20_TRANSFER_TOPIC,
          extractor: 'erc20Transfer',
          params: { from: TOKEN, to: POOL },
        },
        {
          event: ERC20_TRANSFER_TOPIC,
          extractor: 'erc20Transfer',
          params: { from: POOL },
        },
      )

      expect(deposit.topics).toStrictEqual([
        `0x${'00'.repeat(12)}${TOKEN.slice(2).toLowerCase()}`,
        POOL_TOPIC,
      ])
    })

    it('rejects a source without any filter', async () => {
      await expect(
        getFlowConfigs(
          {
            event: ERC20_TRANSFER_TOPIC,
            extractor: 'erc20Transfer',
            // The type forbids this, so bypass it to exercise the runtime guard.
            params: {} as { from: typeof POOL },
          },
          {
            event: ERC20_TRANSFER_TOPIC,
            extractor: 'erc20Transfer',
            params: { from: POOL },
          },
        ),
      ).rejects.toThrow('erc20Transfer source needs a from or to filter')
    })
  })

  describe('price is tracked no later than flows', () => {
    it('every privacy bucket starts at or after its token price', async () => {
      const projects = await ps.getProjects({ select: ['privacyInfo'] })
      for (const project of projects) {
        for (const token of project.privacyInfo.tokens) {
          const priceSince = token.token.sinceTimestamp
          if (!token.token.priceId || !priceSince) continue
          for (const bucket of token.buckets) {
            expect(priceSince <= bucket.sinceTimestamp).toStrictEqual(true)
          }
        }
      }
    })
  })

  it('clamps anonymity set backfills to PRIVACY_MIN_TIMESTAMP', async () => {
    const minTimestamp = UnixTime(2_000_000_000)
    const config = await getPrivacyConfig(
      ps,
      new Env({ PRIVACY_MIN_TIMESTAMP: minTimestamp.toString() }),
      new FeatureFlags('privacy'),
      [{ name: 'ethereum', chainId: 1, apis: [] } as ChainConfig],
    )

    if (config === false) throw new Error('Privacy config should be enabled')
    expect(config.anonymitySetConfigs.length).toBeGreaterThan(0)
    for (const anonymitySetConfig of config.anonymitySetConfigs) {
      expect(anonymitySetConfig.sinceTimestamp).toStrictEqual(minTimestamp)
    }
  })
})
