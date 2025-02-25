import type { ChainConfig, ProjectActivityConfig } from '../../../types'

export function getActivityConfig(
  activityConfig: ProjectActivityConfig | undefined,
  chainConfig: ChainConfig | undefined,
  fallback: ProjectActivityConfig,
) {
  if (!chainConfig) {
    if (activityConfig) {
      throw new Error('Missing chainConfig!')
    }
    return undefined
  }
  const hasRpc = chainConfig.apis.some((x) => x.type === 'rpc')
  if (!hasRpc) {
    throw new Error('chainConfig is missing an rpc api!')
  }
  return activityConfig ?? fallback
}
