import { PacketDelivered, PacketSent } from './layerzero-v2'
import {
  StargateV2BusDriven,
  StargateV2OFTReceived,
  StargateV2OFTSentBusRode,
} from './stargate'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  BridgeTransfer,
  MatchResult,
} from './types'

export class StargateV2BusPlugin implements BridgePlugin {
  name = 'stargate-v2-bus'
  chains = ['ethereum', 'arbitrum', 'base']

  match(busDriven: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!StargateV2BusDriven.checkType(busDriven)) {
      return
    }

    const packetSent = db.find(PacketSent, { guid: busDriven.args.guid })
    if (!packetSent) {
      return
    }

    const packetDelivered = db.find(PacketDelivered, {
      guid: busDriven.args.guid,
    })
    if (!packetDelivered) {
      return
    }

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
      if (!oftSentBusRode) {
        return
      }

      oftSentBusRodeBatch.push(oftSentBusRode)
    }

    const transfers: BridgeTransfer[] = []
    for (const oftSentBusRode of oftSentBusRodeBatch) {
      const matchedOftReceived = oftReceivedBatch.find(
        (o) =>
          // Bus is driven only for a single token
          // It is an edge case to have duplicate receivers in the same Bus
          o.args.receiver.toLowerCase() ===
          oftSentBusRode.args.receiver.toLowerCase(),
      )
      if (!matchedOftReceived) {
        return
      }

      transfers.push({
        type: 'stargate-v2-bus.App',
        events: [oftSentBusRode, matchedOftReceived],
        outbound: {
          event: ticket,
          token: {
            address: ticket.args.tokenAddress,
            amount: ticket.args.amountSentLD.toString(),
          },
        },
        inbound: {
          event: received,
          token: {
            address: received.args.tokenAddress,
            amount: received.args.amountReceivedLD.toString(),
          },
        },
      })
    }

    return {
      messages: [
        {
          type: 'layerzero-v2.Message',
          outbound: packetSent,
          inbound: packetDelivered,
        },
      ],
      transfers,
    }
  }
}
