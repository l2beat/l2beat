import type { Logger } from '@l2beat/backend-tools'
import {
  createActionType,
  defineEvent,
  type LogToDecode,
  type Plugin,
} from './types'

const Event_LogMessagePublished = defineEvent(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

// We need config for ChainId to create ID
const NETWORKS = [
  { wormholeChainId: 2, chain: 'ethereum' },
  { wormholeChainId: 23, chain: 'arbitrum' },
  { wormholeChainId: 30, chain: 'base' },
]

export const LogMessagePublished = createActionType<{
  payload: `0x${string}`
  sequence: string
  wormholeChainId: number
  sender: `0x${string}`
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements Plugin {
  name = 'wormhole'

  constructor(private logger: Logger) {
    this.logger = logger.for(this)
  }

  decodeLog(input: LogToDecode) {
    const parsed = Event_LogMessagePublished.parse(input.log)
    if (!parsed) return

    const network = NETWORKS.find((n) => n.chain === input.tx.chain)
    if (!network) {
      this.logger.warn('Network not configured', { chain: input.tx.chain })
      return
    }

    return LogMessagePublished.create(input.tx, {
      payload: parsed.payload,
      sequence: parsed.sequence.toString(),
      wormholeChainId: network.wormholeChainId,
      sender: parsed.sender,
    })
  }
}
