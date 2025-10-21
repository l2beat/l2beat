import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { AcrossConfigPlugin } from './across'

export function createInteropConfigPlugins(
  chains: { id: number; name: string }[],
  logger: Logger,
  ethereumRpc: RpcClient,
) {
  return [new AcrossConfigPlugin(chains, logger, ethereumRpc)]
}
