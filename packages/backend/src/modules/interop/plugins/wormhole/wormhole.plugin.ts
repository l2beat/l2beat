import { assert, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  createEventParser,
  createInteropEventType,
  type InteropPlugin,
  type LogToCapture,
} from '../types'
import { WormholeConfig } from './wormhole.config'

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

export const LogMessagePublished = createInteropEventType<{
  payload: `0x${string}`
  sequence: bigint
  wormholeChainId: number
  sender: EthereumAddress
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements InteropPlugin {
  readonly name = 'wormhole'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const networks = this.configs.get(WormholeConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) {
      return
    }

    assert(network.coreContract, 'We capture only chain with core contracts')

    const parsed = parseLogMessagePublished(input.log, [network.coreContract])
    if (!parsed) return


    // TODO: if the sender is the token bridge, we can get the src token by
    // looking at the Transfer at logIndex - 1. Example: https://app.blocksec.com/phalcon/explorer/tx/base/0x7eebd35bd9b1d0b614dfe3d464d915378f2d370ab425d1ddc4510b820ed5df8d
    return [
      LogMessagePublished.create(input, {
        payload: parsed.payload,
        sequence: parsed.sequence,
        wormholeChainId: network.wormholeChainId,
        sender: EthereumAddress(parsed.sender),
      }),
    ]
  }
  // no matching because wormhole matches by (msg.sender,sequence) (sender=emitter in wormhole core contracts, not to be confused with event emitter),
  // of which the destination event depends on the app layer
}
