import type { Env } from '@l2beat/backend-tools'
import type {
  PrivacyAnonymitySetDepositSource,
  PrivacyBucketAddress,
  ProjectPrivacyBucket,
  ProjectPrivacyToken,
  ProjectService,
} from '@l2beat/config'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import {
  ChainSpecificAddress,
  EthereumAddress,
  type UnixTime,
} from '@l2beat/shared-pure'
import { PrivacyBlockTimestampIndexer } from '../../modules/privacy/indexers/PrivacyBlockTimestampIndexer'
import { PrivacyFlowIndexer } from '../../modules/privacy/indexers/PrivacyFlowIndexer'
import { PrivacyPriceIndexer } from '../../modules/privacy/indexers/PrivacyPriceIndexer'
import { StarknetPrivacyFlowIndexer } from '../../modules/privacy/indexers/StarknetPrivacyFlowIndexer'
import type {
  PrivacyAnonymitySetIndexerConfig,
  PrivacyAnonymitySetIndexerConfigProperties,
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
  const anonymitySetConfigs: PrivacyAnonymitySetIndexerConfig[] = []
  const starknetFlowConfigs: StarknetPrivacyFlowIndexerConfig[] = []
  for (const project of projects) {
    for (const token of project.privacyInfo.tokens) {
      for (const bucket of token.buckets) {
        if (bucket.anonymitySet !== undefined) {
          anonymitySetConfigs.push(
            toAnonymitySetConfig(project.projectId, bucket, bucket.deposit),
          )
        }

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
    anonymitySetConfigs,
    flowConfigs,
    starknetFlowConfigs,
    priceConfigs,
    blockTimestampConfigs,
    chains,
  }
}

function toAnonymitySetConfig(
  projectId: string,
  bucket: ProjectPrivacyBucket,
  source: PrivacyAnonymitySetDepositSource,
): PrivacyAnonymitySetIndexerConfig {
  const privacyAddress = getPrivacyBucketAddress(bucket.address)
  const config: PrivacyAnonymitySetIndexerConfigProperties = {
    projectId,
    bucketId: bucket.id,
    chain: privacyAddress.chain,
    address: EthereumAddress(privacyAddress.address),
    sinceTimestamp: bucket.sinceTimestamp,
    ...source,
  }

  return {
    id: createPrivacyAnonymitySetConfigurationId({
      ...config,
      address: config.address.toString(),
    }),
    ...config,
  }
}

function toFlowConfig(
  projectId: string,
  bucket: ProjectPrivacyBucket,
  direction: 'deposit' | 'withdrawal',
  token: ProjectPrivacyToken['token'],
  minTimestamp: UnixTime,
): PrivacyFlowIndexerConfig | StarknetPrivacyFlowIndexerConfig {
  const source = bucket[direction]
  const privacyAddress = getPrivacyBucketAddress(bucket.address)
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
    const config = { ...base, ...source }
    return {
      id: StarknetPrivacyFlowIndexer.idToConfigurationId(config),
      ...config,
    }
  }

  const config = {
    ...base,
    address: EthereumAddress(privacyAddress.address),
    ...source,
  }
  return { id: PrivacyFlowIndexer.idToConfigurationId(config), ...config }
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
