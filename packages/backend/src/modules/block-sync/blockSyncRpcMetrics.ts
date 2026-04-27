import type { CoreFeatureRpcMetricsContext } from '../../tools/coreFeatureRpcMetrics'
import { withCoreFeatureRpcMetricsContext } from '../../tools/coreFeatureRpcMetrics'

type BlockSyncCoreFeature =
  | 'blockSync.tip'
  | 'blockSync.fetch'
  | 'blockSync.process'

type BlockSyncRpcMetricsContext = CoreFeatureRpcMetricsContext

export function withBlockSyncRpcMetricsContext<T>(
  coreFeature: BlockSyncCoreFeature,
  context: BlockSyncRpcMetricsContext,
  fn: () => T,
): T {
  return withCoreFeatureRpcMetricsContext(coreFeature, context, fn)
}
