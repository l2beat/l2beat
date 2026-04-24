import type { CoreFeatureRpcMetricsContext } from '../../../../tools/coreFeatureRpcMetrics'
import {
  instrumentCoreFeatureRpcMetricsRun,
  withCoreFeatureRpcMetricsContext,
} from '../../../../tools/coreFeatureRpcMetrics'

type InteropCoreFeature =
  | 'interop.config'
  | 'interop.capture'
  | 'interop.match'
  | 'interop.compare'
  | 'interop.sync'

type InteropRpcMetricsContext = CoreFeatureRpcMetricsContext

export function withInteropRpcMetricsContext<T>(
  coreFeature: InteropCoreFeature,
  context: InteropRpcMetricsContext,
  fn: () => T,
): T {
  return withCoreFeatureRpcMetricsContext(coreFeature, context, fn)
}

export function instrumentInteropRpcMetricsRun<
  T extends { run(): Promise<void> },
>(
  target: T,
  coreFeature: InteropCoreFeature,
  context: InteropRpcMetricsContext | (() => InteropRpcMetricsContext),
): T {
  return instrumentCoreFeatureRpcMetricsRun(target, coreFeature, context)
}
