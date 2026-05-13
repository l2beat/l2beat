import type { Env } from '@l2beat/backend-tools'
import type {
  ProjectPrivacyBucket,
  ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import { ChainSpecificAddress, type UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { PrivacyBlockTimestampIndexer } from '../../modules/privacy/indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from '../../modules/privacy/indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from '../../modules/privacy/indexers/PrivacyPriceIndexer'
import type {
  PrivacyBlockTimestampConfig,
  PrivacyConfig,
  PrivacyFlowIndexerConfig,
  PrivacyPriceIndexerConfig,
} from '../../modules/privacy/types'
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
    .map((project) => ({
      projectId: project.id.toString(),
      privacyInfo: project.privacyInfo,
    }))

  if (projects.length === 0) {
    return false
  }

  const flowConfigs: PrivacyFlowIndexerConfig[] = []
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
  }

  const priceIdMap = new Map<string, UnixTime>()
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
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

  const chains = Array.from(new Set(flowConfigs.map((config) => config.chain)))

  const blockTimestampConfigs: PrivacyBlockTimestampConfig[] = chains.map(
    (chain) => {
      const sinceTimestamp = Math.min(
        ...flowConfigs
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
    priceConfigs,
    blockTimestampConfigs,
    chains,
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

