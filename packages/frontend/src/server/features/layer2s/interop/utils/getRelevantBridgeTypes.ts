import type { Project } from '@l2beat/config'
import {
  type KnownInteropBridgeType,
  notUndefined,
  unique,
} from '@l2beat/shared-pure'

export function getRelevantBridgeTypes(
  project: Project<'interopConfig'>,
  type: KnownInteropBridgeType | undefined,
): KnownInteropBridgeType[] {
  if (type) {
    return [type]
  }

  return unique(
    project.interopConfig.plugins.map((plugin) => plugin.bridgeType),
  ).filter(notUndefined)
}
