import type { Env } from '@l2beat/backend-tools'
import type {
  ProjectPrivacyBucket,
  ProjectPrivacyOnchainRelayerSource,
  ProjectPrivacyRailgunWakuRelayerSource,
  ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import {
  assert,
  assertUnreachable,
  ChainSpecificAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { PrivacyBlockTimestampIndexer } from '../../modules/privacy/indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from '../../modules/privacy/indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from '../../modules/privacy/indexers/PrivacyPriceIndexer'
import { PrivacyRelayerActivityIndexer } from '../../modules/privacy/indexers/PrivacyRelayerActivityIndexer'
import { PrivacyRelayerSampleIndexer } from '../../modules/privacy/indexers/PrivacyRelayerSampleIndexer'
import type {
  PrivacyBlockTimestampConfig,
  PrivacyConfig,
  PrivacyFlowIndexerConfig,
  PrivacyPriceIndexerConfig,
  PrivacyRelayerActivityIndexerConfig,
  PrivacyRelayerSampleIndexerConfig,
} from '../../modules/privacy/types'
import { getPrivacyRelayerExtractor } from '../../modules/privacy/utils/extractPrivacyRelayerActivity'
import type { FeatureFlags } from '../FeatureFlags'

export async function getPrivacyConfig(
  ps: ProjectService,
  env: Env,
  flags: FeatureFlags,
): Promise<PrivacyConfig | false> {
  const minTimestamp = env.integer('PRIVACY_MIN_TIMESTAMP', 0)

  const projectsWithPrivacy = await ps.getProjects({
    select: ['privacyInfo'],
  })

  const projects = projectsWithPrivacy
    .filter((project) => flags.isEnabled('privacy', project.id))
    .filter(
      (project) =>
        project.privacyInfo.tokens.some((token) => token.buckets.length > 0) ||
        project.privacyInfo.relayerTracking !== undefined,
    )
    .map((project) => ({
      projectId: project.id.toString(),
      privacyInfo: project.privacyInfo,
    }))

  if (projects.length === 0) {
    return false
  }

  const chainNames = new Map(
    (await ps.getProjects({ select: ['chainConfig'] })).map((project) => [
      project.chainConfig.chainId,
      project.chainConfig.name,
    ]),
  )

  const flowConfigs: PrivacyFlowIndexerConfig[] = []
  const relayerConfigs: PrivacyRelayerActivityIndexerConfig[] = []
  const relayerSampleConfigs: PrivacyRelayerSampleIndexerConfig[] = []
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
      for (const bucket of token.buckets) {
        flowConfigs.push(
          toFlowConfig(
            project.projectId,
            bucket,
            'deposit',
            token.token,
            minTimestamp,
          ),
          toFlowConfig(
            project.projectId,
            bucket,
            'withdrawal',
            token.token,
            minTimestamp,
          ),
        )
      }
    }

    const tracking = project.privacyInfo.relayerTracking
    if (tracking) {
      switch (tracking.type) {
        case 'onchainEvents':
          relayerConfigs.push(
            ...tracking.sources.map((source) =>
              toRelayerConfig(project.projectId, source, minTimestamp),
            ),
          )
          break
        case 'railgunWaku':
          relayerSampleConfigs.push(
            toRelayerSampleConfig(project.projectId, tracking, chainNames),
          )
          break
        default:
          assertUnreachable(tracking)
      }
    }
  }

  const priceIdMap = new Map<string, UnixTime>()
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
      if (token.buckets.length === 0) continue

      const priceId = token.token.priceId
      const sinceTimestamp = token.token.sinceTimestamp
      if (!priceId || !sinceTimestamp) continue

      const clamped = Math.max(sinceTimestamp, minTimestamp)
      const current = priceIdMap.get(priceId)
      priceIdMap.set(
        priceId,
        current === undefined ? clamped : Math.min(current, clamped),
      )
    }
  }

  const priceConfigs: PrivacyPriceIndexerConfig[] = Array.from(
    priceIdMap.entries(),
  ).map(([priceId, sinceTimestamp]) => {
    const config = { priceId, sinceTimestamp }
    return {
      id: PrivacyPriceIndexer.idToConfigurationId(config),
      ...config,
    }
  })

  const onchainConfigs = [...flowConfigs, ...relayerConfigs]
  const chains = Array.from(
    new Set(onchainConfigs.map((config) => config.chain)),
  )

  const blockTimestampConfigs: PrivacyBlockTimestampConfig[] = chains.map(
    (chain) => {
      const sinceTimestamp = Math.min(
        ...onchainConfigs
          .filter((c) => c.chain === chain)
          .map((c) => c.sinceTimestamp),
      )
      const config = { chain, sinceTimestamp }
      return {
        id: PrivacyBlockTimestampIndexer.idToConfigurationId(config),
        ...config,
      }
    },
  )

  return {
    projects,
    flowConfigs,
    relayerConfigs,
    relayerSampleConfigs,
    priceConfigs,
    blockTimestampConfigs,
    chains,
  }
}

function toRelayerSampleConfig(
  projectId: string,
  source: ProjectPrivacyRailgunWakuRelayerSource,
  chainNames: Map<number | undefined, string>,
): PrivacyRelayerSampleIndexerConfig {
  const chain = chainNames.get(source.chainId)
  assert(chain, `No chain config for Railgun Waku chain id: ${source.chainId}`)

  const base = {
    projectId,
    chain,
    chainId: source.chainId,
    sinceTimestamp: source.sinceTimestamp,
  }

  return {
    id: PrivacyRelayerSampleIndexer.idToConfigurationId(base),
    ...base,
  }
}

function toRelayerConfig(
  projectId: string,
  source: ProjectPrivacyOnchainRelayerSource,
  minTimestamp: UnixTime,
): PrivacyRelayerActivityIndexerConfig {
  const base = {
    projectId,
    chain: ChainSpecificAddress.longChain(source.address),
    address: ChainSpecificAddress.address(source.address),
    sinceTimestamp: Math.max(source.sinceTimestamp, minTimestamp),
    event: getPrivacyRelayerExtractor(source.extractor).event,
    extractor: source.extractor,
  }

  return {
    id: PrivacyRelayerActivityIndexer.idToConfigurationId(base),
    ...base,
  }
}

export function createPrivacyConfigurationId(input: string[]): string {
  return createHash('sha1').update(input.join('')).digest('hex').slice(0, 12)
}

function toFlowConfig(
  projectId: string,
  bucket: ProjectPrivacyBucket,
  direction: 'deposit' | 'withdrawal',
  token: ProjectPrivacyToken['token'],
  minTimestamp: UnixTime,
): PrivacyFlowIndexerConfig {
  const source = bucket[direction]
  const base = {
    projectId,
    bucketId: bucket.id,
    direction,
    chain: ChainSpecificAddress.longChain(bucket.address),
    address: ChainSpecificAddress.address(bucket.address),
    sinceTimestamp: Math.max(bucket.sinceTimestamp, minTimestamp),
    priceId: token.priceId,
    decimals: token.decimals,
    ...source,
  }
  return {
    id: PrivacyFlowIndexer.idToConfigurationId(base),
    ...base,
  }
}
