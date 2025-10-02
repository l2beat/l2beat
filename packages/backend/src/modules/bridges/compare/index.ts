import type { Logger } from '@l2beat/backend-tools'
import { AcrossComparePlugin } from './across'

export function createBridgeComparePlugins(logger: Logger) {
  return [new AcrossComparePlugin(logger)]
}
