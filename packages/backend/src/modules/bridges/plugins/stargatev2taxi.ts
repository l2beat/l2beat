import { PacketDelivered, PacketSent } from './layerzerov2'
import { StargateV2OFTReceived, StargateV2OFTSentTaxi } from './stargate'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'

export class StargateV2TaxiPlugin implements BridgePlugin {
  name = 'stargatev2taxi'
  chains = ['ethereum', 'arbitrum', 'base']

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!StargateV2OFTSentTaxi.checkType(event)) {
      return
    }

    const oftReceived = db.find(StargateV2OFTReceived, {
      guid: event.args.guid,
    })
    if (!oftReceived) {
      return
    }

    const packetSent = db.find(PacketSent, { guid: event.args.guid })
    if (!packetSent) {
      return
    }

    const packetDelivered = db.find(PacketDelivered, { guid: event.args.guid })
    if (!packetDelivered) {
      return
    }

    return {
      messages: [
        {
          type: 'layerzerov2.Message',
          outbound: packetSent,
          inbound: packetDelivered,
        },
        {
          type: 'stargatev2taxi.App',
          outbound: event,
          inbound: oftReceived,
        },
      ],
    }
  }
}
