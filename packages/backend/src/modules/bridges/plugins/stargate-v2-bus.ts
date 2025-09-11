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

    const oftReceived = db.findAll(StargateV2OFTReceived, {
      guid: busDriven.args.guid,
    })

    const token = oftReceived[0].args.token
    const destinationEid = oftReceived[0].args.destinationEid

    const oftSents = []

    for (
      let i = busDriven.args.startTicketId;
      i < busDriven.args.startTicketId + busDriven.args.numPassengers;
      i++
    ) {
      const oftSent = db.find(StargateV2OFTSentBusRode, {
        ticketId: i,
        destinationEid: destinationEid,
        token: token,
      })
      if (!oftSent) {
        return
      }

      oftSents.push(oftSent)
    }

    const transfers: BridgeTransfer[] = []
    for (const ticket of oftSents) {
      const received = oftReceived.find(
        (o) =>
          // Bus is driven only for a single token
          // It is an edge case to have duplicate receivers in the same Bus
          o.args.receiver.toLowerCase() === ticket.args.receiver.toLowerCase(),
      )
      if (!received) {
        return
      }

      transfers.push({
        type: 'stargate-v2-bus.App',
        events: [ticket, received],
        outbound: {
          tx: ticket.ctx,
          tokenAddress: ticket.args.tokenAddress,
          amount: ticket.args.amountSentLD.toString(),
        },
        inbound: {
          tx: received.ctx,
          tokenAddress: received.args.tokenAddress,
          amount: received.args.amountReceivedLD.toString(),
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
