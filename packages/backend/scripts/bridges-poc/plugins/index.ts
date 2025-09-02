import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { LayerZeroV2Plugin } from './layerzero'
import { PortalPlugin } from './portal'
import type { Plugin } from './types'
import { WormholePlugin } from './wormhole'

export function createPlugins(
  logger: Logger,
  rpcs: Map<string, RpcClient>,
): Plugin[] {
  return [
    new WormholePlugin(logger),
    new PortalPlugin(logger, rpcs),
    new LayerZeroV2Plugin(logger),
  ]
}
