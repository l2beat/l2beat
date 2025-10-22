import type { Logger } from '@l2beat/backend-tools'
import { HttpClient, type RpcClient } from '@l2beat/shared'
import { AcrossNetworksPlugin } from './across'
import { LayerZeroNetworksPlugin } from './layerzero'

export function createInteropNetworksPlugins(
  chains: { id: number; name: string }[],
  logger: Logger,
  ethereumRpc: RpcClient,
) {
  return [
    new AcrossNetworksPlugin(chains, logger, ethereumRpc),
    new LayerZeroNetworksPlugin(chains, new HttpClient()),
  ]
}
