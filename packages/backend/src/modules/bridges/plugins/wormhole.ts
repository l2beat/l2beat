import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
} from './types'

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

const NETWORKS = [
  { wormholeChainId: 2, chain: 'ethereum' },
  { wormholeChainId: 23, chain: 'arbitrum' },
  { wormholeChainId: 30, chain: 'base' },
]

export const LogMessagePublished = createBridgeEventType<{
  payload: `0x${string}`
  sequence: string
  wormholeChainId: number
  sender: EthereumAddress
  txHash: string
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements BridgePlugin {
  name = 'wormhole'
  chains = ['ethereum', 'arbitrum', 'base']

  constructor(private logger: Logger) {
    this.logger = logger.for(this)
  }

  capture(input: LogToCapture) {
    const parsed = parseLogMessagePublished(input.log, null)
    if (!parsed) return

    const network = NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) {
      this.logger.warn('Network not configured', { chain: input.ctx.chain })
      return
    }

    return LogMessagePublished.create(input.ctx, {
      payload: parsed.payload,
      sequence: parsed.sequence.toString(),
      wormholeChainId: network.wormholeChainId,
      sender: EthereumAddress(parsed.sender),
      txHash: input.ctx.txHash,
    })
  }
}
