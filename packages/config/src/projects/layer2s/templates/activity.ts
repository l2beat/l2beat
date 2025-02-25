import type { ChainConfig, ProjectActivityConfig } from '../../../types'

export function getActivityConfig(
  activityConfig: ProjectActivityConfig | undefined,
  chainConfig: ChainConfig | undefined,
  fallback: ProjectActivityConfig,
) {
  const hasRpc = chainConfig?.apis.some((x) => x.type === 'rpc')
  if (!hasRpc) {
    if (activityConfig) {
      throw new Error('Missing chainConfig or rpc api!')
    }
    return undefined
  }
  return activityConfig ?? fallback
}
