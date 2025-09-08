import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createEventType,
  type LogToDecode,
  type Plugin,
} from './types'

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

const NETWORKS = [
  { wormholeChainId: 2, chain: 'ethereum' },
  { wormholeChainId: 23, chain: 'arbitrum' },
  { wormholeChainId: 30, chain: 'base' },
]

export const LogMessagePublished = createEventType<{
  payload: `0x${string}`
  sequence: string
  wormholeChainId: number
  sender: EthereumAddress
  txHash: string
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements Plugin {
  name = 'wormhole'

  constructor(private logger: Logger) {
    this.logger = logger.for(this)
  }

  decode(input: LogToDecode) {
    // TODO: whitelist
    const parsed = parseLogMessagePublished(input.log, null)
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
      sender: EthereumAddress(parsed.sender),
      txHash: input.tx.hash,
    })
  }
}
