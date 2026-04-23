import { type RpcMetricsContext, withRpcMetricsContext } from '@l2beat/shared'

type BlockSyncRpcMetricsContext = Omit<RpcMetricsContext, 'module'>

export function withBlockSyncRpcMetricsContext<T>(
  context: BlockSyncRpcMetricsContext,
  fn: () => T,
): T {
  return withRpcMetricsContext({ module: 'blockSync', ...context }, fn)
}
