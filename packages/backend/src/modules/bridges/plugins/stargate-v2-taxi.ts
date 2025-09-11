import { PacketDelivered, PacketSent } from './layerzero-v2'
import { StargateV2OFTReceived, StargateV2OFTSentTaxi } from './stargate'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'

export class StargateV2TaxiPlugin implements BridgePlugin {
  name = 'stargate-v2-taxi'
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
          type: 'layerzero-v2.Message',
          outbound: packetSent,
          inbound: packetDelivered,
        },
      ],
      transfers: [
        {
          type: 'stargate-v2-taxi.App',
          events: [event, oftReceived],
          outbound: {
            tx: event.ctx,
            tokenAddress: event.args.tokenAddress,
            amount: event.args.amountSentLD.toString(),
          },
          inbound: {
            tx: oftReceived.ctx,
            tokenAddress: oftReceived.args.tokenAddress,
            amount: oftReceived.args.amountReceivedLD.toString(),
          },
        },
      ],
    }
  }
}
