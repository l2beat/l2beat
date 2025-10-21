import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { AcrossNetworksPlugin } from './across'

export function createInteropNetworksPlugins(
  chains: { id: number; name: string }[],
  logger: Logger,
  ethereumRpc: RpcClient,
) {
  return [new AcrossNetworksPlugin(chains, logger, ethereumRpc)]
}
