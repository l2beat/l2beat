import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createLayerZeroGuid,
  decodePacket,
} from '../../bridges/utils/layerzero'
import {
  createEventParser,
  createEventType,
  type Event,
  type EventDb,
  type LogToDecode,
  type MatchResult,
  type Plugin,
} from './types'

const parsePacketSent = createEventParser(
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
)

const parsePacketDelivered = createEventParser(
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
)

const NETWORKS = [
  {
    chainId: 1,
    eid: 30101,
    chain: 'ethereum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chain: 'arbitrum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chain: 'base',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
]

export const PacketSent = createEventType<{
  guid: string
}>('layerzerov2.PacketSent')

export const PacketDelivered = createEventType<{
  guid: string
}>('layerzerov2.PacketDelivered')

export class LayerZeroV2Plugin implements Plugin {
  name = 'layerzerov2'

  constructor(private logger: Logger) {
    this.logger = logger.for(this)
  }

  decode(input: LogToDecode) {
    const packetSent = parsePacketSent(input.log)

    if (packetSent) {
      const packet = decodePacket(packetSent.encodedPayload)

      if (packet) {
        const guid = createLayerZeroGuid(
          packet.header.nonce,
          packet.header.srcEid,
          packet.header.sender,
          packet.header.dstEid,
          packet.header.receiver,
        )

        return PacketSent.create(input.tx, { guid })
      }
      this.logger.warn('Failed to decode packet', { tx: input.tx.hash })
    }

    const packetDelivered = parsePacketDelivered(input.log)

    if (packetDelivered) {
      const endpoint = NETWORKS.find((n) => n.chain === input.tx.chain)

      if (!endpoint) {
        this.logger.warn('Network not configured', {
          chain: input.tx.chain,
        })
        return
      }

      const guid = createLayerZeroGuid(
        packetDelivered.origin.nonce,
        packetDelivered.origin.srcEid,
        packetDelivered.origin.sender,
        endpoint.eid,
        packetDelivered.receiver,
      )

      return PacketDelivered.create(input.tx, { guid })
    }
  }

  match(event: Event, db: EventDb): MatchResult | undefined {
    if (!PacketDelivered.checkType(event)) {
      return
    }

    const outboundEvent = db.find(PacketSent, {
      guid: event.args.guid,
    })
    if (!outboundEvent) {
      return
    }

    return {
      message: {
        type: 'layerzerov2.Message',
        inbound: event,
        outbound: outboundEvent,
      },
    }
  }
}
