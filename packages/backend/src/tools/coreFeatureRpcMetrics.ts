import { type RpcMetricsContext, withRpcMetricsContext } from '@l2beat/shared'

export type CoreFeatureRpcMetricsContext = Omit<
  RpcMetricsContext,
  'coreFeature'
>

export function withCoreFeatureRpcMetricsContext<T>(
  coreFeature: string,
  context: CoreFeatureRpcMetricsContext,
  fn: () => T,
): T {
  return withRpcMetricsContext({ coreFeature, ...context }, fn)
}

export function instrumentCoreFeatureRpcMetricsRun<
  T extends { run(): Promise<void> },
>(
  target: T,
  coreFeature: string,
  context: CoreFeatureRpcMetricsContext | (() => CoreFeatureRpcMetricsContext),
): T {
  const run = target.run.bind(target)

  target.run = () =>
    withCoreFeatureRpcMetricsContext(
      coreFeature,
      typeof context === 'function' ? context() : context,
      run,
    )

  return target
}
