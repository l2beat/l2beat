import { PacketDelivered, PacketSent } from './layerzerov2'
import {
  StargateV2BusDriven,
  StargateV2BusRode,
  StargateV2OFTReceived,
} from './stargate'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'

export class StargateV2BusPlugin implements BridgePlugin {
  name = 'stargatev2bus'
  chains = ['ethereum', 'arbitrum', 'base']

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!StargateV2BusDriven.checkType(event)) {
      return
    }

    const tickets = []

    for (
      let i = event.args.startTicketId;
      i < event.args.startTicketId + event.args.numPassengers;
      i++
    ) {
      const ticket = db.find(StargateV2BusRode, { ticketId: i })
      if (!ticket) {
        return
      }
      tickets.push(ticket)
    }

    const packetSent = db.find(PacketSent, { guid: event.args.guid })
    if (!packetSent) {
      return
    }

    const packetDelivered = db.find(PacketDelivered, { guid: event.args.guid })
    if (!packetDelivered) {
      return
    }

    const oftReceived = db.findAll(StargateV2OFTReceived, {
      guid: event.args.guid,
    })

    const transfers = []
    for (const ticket of tickets) {
      const received = oftReceived.find(
        (o) =>
          // TODO: refactor to make this matching more robust
          o.args.receiver.toLowerCase() === ticket.args.receiver.toLowerCase(),
      )
      // TODO: additionally match by associated message (incl guid)
      if (!received) {
        return
      }

      transfers.push({
        type: 'stargatev2bus.App',
        events: [ticket],
        outbound: { tx: ticket.ctx },
        inbound: { tx: received.ctx },
      })
    }

    return {
      messages: [
        {
          type: 'layerzerov2.Message',
          outbound: packetSent,
          inbound: packetDelivered,
        },
      ],
      transfers,
    }
  }
}
