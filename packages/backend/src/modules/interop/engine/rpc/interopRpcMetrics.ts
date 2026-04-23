import { type RpcMetricsContext, withRpcMetricsContext } from '@l2beat/shared'

type InteropRpcMetricsContext = Omit<RpcMetricsContext, 'module'>

export function withInteropRpcMetricsContext<T>(
  context: InteropRpcMetricsContext,
  fn: () => T,
): T {
  return withRpcMetricsContext({ module: 'interop', ...context }, fn)
}

export function instrumentInteropRpcMetricsRun<
  T extends { run(): Promise<void> },
>(
  target: T,
  context: InteropRpcMetricsContext | (() => InteropRpcMetricsContext),
): T {
  const run = target.run.bind(target)

  target.run = () =>
    withInteropRpcMetricsContext(
      typeof context === 'function' ? context() : context,
      run,
    )

  return target
}
