import type { Logger } from '@l2beat/backend-tools'
import type { RpcClient } from '@l2beat/shared'
import { CCTPv1Plugin } from './cctpv1'
import { MayanPlugin } from './mayan'
import type { Plugin } from './types'
import { WormholePlugin } from './wormhole'

export function createPlugins(
  logger: Logger,
  rpcs: Map<string, RpcClient>,
): Plugin[] {
  return [
    new WormholePlugin(logger),
    // new PortalPlugin(logger, rpcs),
    // new LayerZeroV2Plugin(logger),
    // new StargatePlugin(),
    new CCTPv1Plugin(),
    new MayanPlugin(),
  ]
}
