import { Address32, assert, EthereumAddress } from '@l2beat/shared-pure'
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

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export const LogMessagePublished = createInteropEventType<{
  payload: `0x${string}`
  sequence: bigint
  wormholeChainId: number
  sender: EthereumAddress
  srcTokenAddress?: Address32
  srcAmount?: bigint
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

    // If the sender is the token bridge, get the src token from the Transfer event at previous log positions
    // Example: https://app.blocksec.com/phalcon/explorer/tx/base/0x7eebd35bd9b1d0b614dfe3d464d915378f2d370ab425d1ddc4510b820ed5df8d
    let srcTokenAddress: Address32 | undefined
    let srcAmount: bigint | undefined

    const senderAddress = EthereumAddress(parsed.sender)

    if (network.tokenBridge && senderAddress === network.tokenBridge) {
      // Find the Transfer event to the token bridge, searching backwards from current log
      for (let i = input.log.logIndex! - 1; i >= 0; i--) {
        const candidateLog = input.txLogs.find((log) => log.logIndex === i)
        if (!candidateLog) continue

        const transfer = parseTransfer(candidateLog, null)
        if (transfer && EthereumAddress(transfer.to) === network.tokenBridge) {
          srcTokenAddress = Address32.from(candidateLog.address)
          srcAmount = transfer.value
          break
        }
      }
    }

    return [
      LogMessagePublished.create(input, {
        payload: parsed.payload,
        sequence: parsed.sequence,
        wormholeChainId: network.wormholeChainId,
        sender: EthereumAddress(parsed.sender),
        srcTokenAddress,
        srcAmount,
      }),
    ]
  }
  // no matching because wormhole matches by (msg.sender,sequence) (sender=emitter in wormhole core contracts, not to be confused with event emitter),
  // of which the destination event depends on the app layer
}
