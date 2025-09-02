import { PacketDelivered, PacketSent } from './layerzerov2'
import {
  createEventParser,
  createEventType,
  type Event,
  type EventDb,
  type LogToDecode,
  type MatchResult,
  type Plugin,
} from './types'

const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)

const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

export const OFTSent = createEventType<{
  guid: string
}>('stargate.OFTSent')

export const OFTReceived = createEventType<{
  guid: string
}>('stargate.OFTReceived')

export class StargatePlugin implements Plugin {
  name = 'stargate'

  decode(input: LogToDecode) {
    const oftSent = parseOFTSent(input.log)

    if (oftSent) {
      return OFTSent.create(input.tx, { guid: oftSent.guid })
    }

    const oftReceived = parseOFTReceived(input.log)

    if (oftReceived) {
      return OFTReceived.create(input.tx, { guid: oftReceived.guid })
    }
  }

  match(event: Event, db: EventDb): MatchResult | undefined {
    if (!OFTReceived.checkType(event)) {
      return
    }

    const outboundEvent = db.find(OFTSent, { guid: event.args.guid })
    if (!outboundEvent) return

    const packetSent = db.find(PacketSent, { guid: event.args.guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, { guid: event.args.guid })
    if (!packetDelivered) return

    return {
      transfer: {
        type: 'stargate.Transfer',
        events: [event, outboundEvent, packetSent, packetDelivered],
        outbound: { tx: outboundEvent.tx },
        inbound: { tx: event.tx },
      },
    }
  }
}
