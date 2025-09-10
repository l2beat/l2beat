import type { Logger } from '@l2beat/backend-tools'
import { CCTPv1Plugin } from './cctpv1'
import { CCTPv2Plugin } from './cctpv2'
import { MayanPlugin } from './mayan'

import { StargatePlugin } from './stargate'
import type { BridgePlugin } from './types'
import { WormholePlugin } from './wormhole'
import { MayanMCTPFastPlugin } from './mayan-mctp-fast'
import { CCTPv2TokenMessengerPlugin } from './cctpv2-tokenMessenger'

export function createBridgePlugins(logger: Logger): BridgePlugin[] {
  return [
    new StargatePlugin(),
    new MayanPlugin(),
    new MayanMCTPFastPlugin(),
    new CCTPv2TokenMessengerPlugin(),
    new CCTPv1Plugin(),
    new CCTPv2Plugin(),
    new WormholePlugin(logger),
  ]
}
