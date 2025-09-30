import { PacketDelivered, PacketSent } from './layerzero-v2'
import { StargateV2OFTReceived, StargateV2OFTSentTaxi } from './stargate'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  type MatchResult,
  Result,
} from './types'

export class StargateV2TaxiPlugin implements BridgePlugin {
  name = 'stargate-v2-taxi'

  matchTypes = [StargateV2OFTSentTaxi]
  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!StargateV2OFTSentTaxi.checkType(event)) return

    const oftReceived = db.find(StargateV2OFTReceived, {
      guid: event.args.guid,
    })
    if (!oftReceived) return

    const packetSent = db.find(PacketSent, { guid: event.args.guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, { guid: event.args.guid })
    if (!packetDelivered) return

    return [
      Result.Message('layerzero-v2.Message', [packetSent, packetDelivered]),
      Result.Transfer('stargate-v2-taxi.Transfer', {
        srcEvent: event,
        srcTokenAddress: event.args.tokenAddress,
        srcAmount: event.args.amountSentLD.toString(),
        dstEvent: oftReceived,
        dstTokenAddress: oftReceived.args.tokenAddress,
        dstAmount: oftReceived.args.amountReceivedLD.toString(),
      }),
    ]
  }
}
