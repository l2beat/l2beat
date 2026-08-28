import type { Env } from '@l2beat/backend-tools'
import type {
  PrivacyBucketAddress,
  PrivacyFlowSource,
  ProjectPrivacyBucket,
  ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { PrivacyBlockTimestampIndexer } from '../../modules/privacy/indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from '../../modules/privacy/indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from '../../modules/privacy/indexers/PrivacyPriceIndexer'
import { StarknetPrivacyFlowIndexer } from '../../modules/privacy/indexers/StarknetPrivacyFlowIndexer'
import type {
  PrivacyBlockTimestampConfig,
  PrivacyConfig,
  PrivacyFlowIndexerConfig,
  PrivacyPriceIndexerConfig,
  StarknetPrivacyFlowIndexerConfig,
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
    .filter((project) =>
      project.privacyInfo.tokens.some((token) => token.buckets.length > 0),
    )
    .map((project) => ({
      projectId: project.id.toString(),
      privacyInfo: project.privacyInfo,
    }))

  if (projects.length === 0) {
    return false
  }

  const flowConfigs: PrivacyFlowIndexerConfig[] = []
  const starknetFlowConfigs: StarknetPrivacyFlowIndexerConfig[] = []
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
      for (const bucket of token.buckets) {
        const configs = [
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
        ]
        for (const config of configs) {
          if (
            config.extractor === 'strk20Deposit' ||
            config.extractor === 'strk20Withdrawal'
          ) {
            starknetFlowConfigs.push(config)
          } else {
            flowConfigs.push(config)
          }
        }
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

  const allFlowConfigs = [...flowConfigs, ...starknetFlowConfigs]
  const chains = Array.from(
    new Set(allFlowConfigs.map((config) => config.chain)),
  )

  const blockTimestampConfigs: PrivacyBlockTimestampConfig[] = chains.map(
    (chain) => {
      const sinceTimestamp = Math.min(
        ...allFlowConfigs
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
    starknetFlowConfigs,
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
): PrivacyFlowIndexerConfig | StarknetPrivacyFlowIndexerConfig {
  const source = bucket[direction]
  const privacyAddress = getPrivacyBucketAddress(
    source.address ?? bucket.address,
  )
  const base = {
    projectId,
    bucketId: bucket.id,
    direction,
    chain: privacyAddress.chain,
    address: privacyAddress.address,
    sinceTimestamp: Math.max(bucket.sinceTimestamp, minTimestamp),
    priceId: token.priceId,
    decimals: token.decimals,
  }
  if (
    source.extractor === 'strk20Deposit' ||
    source.extractor === 'strk20Withdrawal'
  ) {
    const config = { ...base, ...source, address: privacyAddress.address }
    return {
      id: StarknetPrivacyFlowIndexer.idToConfigurationId(config),
      ...config,
    }
  }

  const config = {
    ...base,
    ...source,
    address: EthereumAddress(privacyAddress.address),
    topics: resolveTopics(source),
  }
  return { id: PrivacyFlowIndexer.idToConfigurationId(config), ...config }
}

/**
 * Combines the explicit source topic filters with filters implied by the
 * extractor params (erc20Transfer from/to are indexed args) and normalizes
 * everything to lowercase 32-byte values, positions starting at topic1.
 */
function resolveTopics(
  source: Exclude<
    PrivacyFlowSource,
    { extractor: 'strk20Deposit' | 'strk20Withdrawal' }
  >,
): (string | null)[] | undefined {
  const topics = (source.topics ?? []).map((topic) =>
    topic === null ? null : padTopic(topic),
  )

  if (source.extractor === 'erc20Transfer') {
    // Transfer(address indexed from, address indexed to, uint256 value)
    if (source.params.from) {
      setTopic(topics, 0, padTopic(source.params.from.toString()))
    }
    if (source.params.to) {
      setTopic(topics, 1, padTopic(source.params.to.toString()))
    }
  }

  while (topics.length > 0 && topics[topics.length - 1] === null) {
    topics.pop()
  }
  return topics.length > 0 ? topics : undefined
}

function setTopic(topics: (string | null)[], index: number, value: string) {
  while (topics.length <= index) {
    topics.push(null)
  }
  assert(
    topics[index] === null || topics[index] === value,
    `Conflicting topic filter at position ${index + 1}: ${topics[index]} vs ${value}`,
  )
  topics[index] = value
}

function padTopic(value: string): string {
  assert(
    /^0x[0-9a-fA-F]+$/.test(value) && value.length <= 66,
    `Invalid topic filter: ${value}`,
  )
  return `0x${value.slice(2).padStart(64, '0')}`.toLowerCase()
}

function getPrivacyBucketAddress(address: PrivacyBucketAddress): {
  chain: string
  address: string
} {
  if (typeof address !== 'string') {
    return address
  }
  return {
    chain: ChainSpecificAddress.longChain(address),
    address: ChainSpecificAddress.address(address).toString(),
  }
}
