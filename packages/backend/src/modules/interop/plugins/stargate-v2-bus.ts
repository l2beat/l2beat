import { PacketDelivered, PacketSent } from './layerzero/layerzero-v2.plugin'
import {
  StargateV2BusDriven,
  StargateV2OFTReceived,
  StargateV2OFTSentBusRode,
} from './stargate'
import {
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type MatchResult,
  Result,
} from './types'

export class StargateV2BusPlugin implements InteropPlugin {
  name = 'stargate-v2-bus'

  matchTypes = [StargateV2BusDriven]
  match(busDriven: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!StargateV2BusDriven.checkType(busDriven)) return

    const packetSent = db.find(PacketSent, { guid: busDriven.args.guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, {
      guid: busDriven.args.guid,
    })
    if (!packetDelivered) return

    const oftReceivedBatch = db.findAll(StargateV2OFTReceived, {
      guid: busDriven.args.guid,
    })

    // a batch is always for a single token and destinationEid
    const token = oftReceivedBatch[0].args.token
    const destinationEid = oftReceivedBatch[0].args.destinationEid

    const oftSentBusRodeBatch = []

    for (
      let i = busDriven.args.startTicketId;
      i < busDriven.args.startTicketId + busDriven.args.numPassengers;
      i++
    ) {
      const oftSentBusRode = db.find(StargateV2OFTSentBusRode, {
        ticketId: i,
        destinationEid: destinationEid,
        token: token,
      })
      if (!oftSentBusRode) return
      oftSentBusRodeBatch.push(oftSentBusRode)
    }

    const result: MatchResult = [
      Result.Message('layerzero-v2.Message', {
        app: 'stargate-v2-bus',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
    ]
    for (const oftSentBusRode of oftSentBusRodeBatch) {
      const matchedOftReceived = oftReceivedBatch.find(
        (o) =>
          // Bus is driven only for a single token
          // It is an edge case to have duplicate receivers in the same Bus
          o.args.receiver.toLowerCase() ===
          oftSentBusRode.args.receiver.toLowerCase(),
      )
      if (!matchedOftReceived) return
      result.push(
        Result.Transfer('stargate-v2-bus.Transfer', {
          srcEvent: oftSentBusRode,
          srcTokenAddress: oftSentBusRode.args.tokenAddress,
          srcAmount: oftSentBusRode.args.amountSentLD.toString(),
          dstEvent: matchedOftReceived,
          dstTokenAddress: matchedOftReceived.args.tokenAddress,
          dstAmount: matchedOftReceived.args.amountReceivedLD.toString(),
        }),
      )
    }
    return result
  }
}
