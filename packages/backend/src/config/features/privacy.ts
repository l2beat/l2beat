import type {
  ProjectPrivacyBucket,
  ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  PrivacyConfig,
  PrivacyFlowIndexerConfig,
  PrivacyPriceIndexerConfig,
} from '../../modules/privacy/types'
import type { FeatureFlags } from '../FeatureFlags'

export async function getPrivacyConfig(
  ps: ProjectService,
  flags: FeatureFlags,
): Promise<PrivacyConfig | false> {
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
          toFlowConfig(project.projectId, bucket, 'deposit', token.token),
          toFlowConfig(project.projectId, bucket, 'withdrawal', token.token),
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

      const current = priceIdMap.get(priceId)
      priceIdMap.set(
        priceId,
        current === undefined
          ? sinceTimestamp
          : UnixTime(Math.min(current, sinceTimestamp)),
      )
    }
  }

  const priceConfigs: PrivacyPriceIndexerConfig[] = Array.from(
    priceIdMap.entries(),
  ).map(([priceId, sinceTimestamp]) => ({
    priceId,
    sinceTimestamp,
  }))

  const chains = Array.from(new Set(flowConfigs.map((config) => config.chain)))

  return {
    projects,
    flowConfigs,
    priceConfigs,
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
): PrivacyFlowIndexerConfig {
  const source = bucket[direction]
  return {
    projectId,
    bucketId: bucket.id,
    direction,
    chain: ChainSpecificAddress.longChain(bucket.address),
    address: ChainSpecificAddress.address(bucket.address),
    sinceTimestamp: bucket.sinceTimestamp,
    priceId: token.priceId,
    decimals: token.decimals,
    ...source,
  }
}
