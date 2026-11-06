import type { ProjectPrivacyInfo } from '@l2beat/config'
import type { IndexerConfigurationRecord } from '@l2beat/database'
import { getPrivacyBucketAddress } from '@l2beat/shared'
import { type UnixTime, unique } from '@l2beat/shared-pure'

/**
 * How far the backend has indexed the flows of a set of projects, as the
 * heights of their flow indexer configurations.
 */
export interface PrivacyFlowSync {
  /** The height the furthest configuration has reached. */
  reached: UnixTime
  /** The height the slowest configuration has reached: a new bucket backfills from its start. */
  slowest: UnixTime
}

/**
 * One flow indexer runs per chain, and STRK-20 sources go through a Starknet
 * one. Mirrors the indexer names and tags the backend uses.
 */
export function getPrivacyFlowIndexerIds(
  projects: { privacyInfo: Pick<ProjectPrivacyInfo, 'tokens'> }[],
): string[] {
  return unique(
    projects.flatMap((project) =>
      project.privacyInfo.tokens.flatMap((token) =>
        token.buckets.flatMap((bucket) => {
          const { chain } = getPrivacyBucketAddress(bucket.address)
          return [
            bucket.deposit,
            bucket.withdrawal,
            ...(bucket.additionalWithdrawals ?? []),
          ].map((source) =>
            source.extractor.startsWith('strk20')
              ? `privacy_starknet_flow_indexer::${chain}`
              : `privacy_flow_indexer::${chain}`,
          )
        }),
      ),
    ),
  )
}

/**
 * Picks the configurations of the given projects out of their indexers'
 * configurations and reads their heights. Undefined when none has started.
 */
export function getPrivacyFlowSync(
  configurations: IndexerConfigurationRecord[],
  projectIds: string[],
): PrivacyFlowSync | undefined {
  const projects = new Set(projectIds)
  const heights = configurations
    .filter(
      (configuration) =>
        configuration.maxHeight === null &&
        projects.has(getProjectId(configuration)),
    )
    .map((configuration) => configuration.currentHeight)
    .filter((height): height is number => height !== null)

  if (heights.length === 0) return undefined
  return { reached: Math.max(...heights), slowest: Math.min(...heights) }
}

function getProjectId(configuration: IndexerConfigurationRecord): string {
  const properties: unknown = JSON.parse(configuration.properties)
  if (
    typeof properties === 'object' &&
    properties !== null &&
    'projectId' in properties &&
    typeof properties.projectId === 'string'
  ) {
    return properties.projectId
  }
  return ''
}
