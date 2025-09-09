import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzerov2'
import { StargateV2OFTReceived } from './stargatev2taxi'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'

// Stargate v2 Pool events (OFT)
const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)

const parseBusDriven = createEventParser(
  'event BusDriven(uint32 dstEid, uint72 startTicketId, uint8 numPassengers, bytes32 guid)',
)

const parseBusRode = createEventParser(
  'event BusRode(uint32 dstEid, uint72 ticketId, uint80 fare, bytes passenger)',
)

const NETWORKS = [
  {
    chain: 'ethereum',
    nativePool: EthereumAddress('0x77b2043768d28E9C9aB44E1aBfC95944bcE57931'),
    usdcPool: EthereumAddress('0xc026395860Db2d07ee33e05fE50ed7bD583189C7'),
    tokenMessaging: EthereumAddress(
      '0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980',
    ),
  },
  {
    chain: 'arbitrum',
    nativePool: EthereumAddress('0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F'),
    usdcPool: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
    tokenMessaging: EthereumAddress(
      '0x6E3d884C96d640526F273C61dfcF08915eBd7e2B',
    ),
  },
  {
    chain: 'base',
    nativePool: EthereumAddress('0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7'),
    usdcPool: EthereumAddress('0x27a16dc786820B16E5c9028b75B99F6f604b5d26'),
    tokenMessaging: EthereumAddress(
      '0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47',
    ),
  },
]

const GUID_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export const StargateV2BusRode = createBridgeEventType<{
  ticketId: number
  receiver: string
}>('stargatev2.BusRode')

export const StargateV2BusDriven = createBridgeEventType<{
  startTicketId: number
  numPassengers: number
  guid: string
}>('stargatev2.BusDriven')

export class StargateV2BusPlugin implements BridgePlugin {
  name = 'stargatev2bus'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const network = NETWORKS.find((b) => b.chain === input.ctx.chain)
    if (!network) {
      // TODO: warn
      return
    }

    const oftSent = parseOFTSent(input.log, [
      network.nativePool,
      network.usdcPool,
    ])
    if (oftSent) {
      if (oftSent.guid === GUID_ZERO) {
        const busRode = input.txLogs.find((l) =>
          parseBusRode(l, [network.tokenMessaging]),
        )

        if (busRode) {
          const ticketId = parseBusRode(busRode, null)?.ticketId
          assert(ticketId)
          const passenger = parseBusRode(busRode, null)?.passenger
          assert(passenger)

          const decoded = decodeBusPassenger(passenger)

          return StargateV2BusRode.create(input.ctx, {
            ticketId: Number(ticketId),
            receiver: decoded.receiver,
          })
        }
      }
    }

    const busDriven = parseBusDriven(input.log, [network.tokenMessaging])
    if (busDriven) {
      return StargateV2BusDriven.create(input.ctx, {
        startTicketId: Number(busDriven.startTicketId),
        numPassengers: busDriven.numPassengers,
        guid: busDriven.guid,
      })
    }
  }

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
          o.args.receiver.toLowerCase() === ticket.args.receiver.toLowerCase(),
      )
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

// Decode passenger bytes per encodePacked(uint16, bytes32, uint64, bool)
function decodeBusPassenger(passengerBytes: string) {
  const bytes = passengerBytes.toLowerCase()
  if (bytes.length < 88)
    throw new Error(`Passenger bytes too short: ${bytes.length}`)
  const assetId = Number.parseInt(bytes.slice(2, 6), 16)
  const receiver = '0x' + bytes.slice(6, 70)
  const amountSD = BigInt('0x' + bytes.slice(70, 86))
  const nativeDrop = Number.parseInt(bytes.slice(86, 88), 16) !== 0
  return {
    assetId: String(assetId),
    receiver: `0x${receiver.slice(-40)}`,
    amountSD,
    nativeDrop: nativeDrop ? 'true' : 'false',
  } as const
}
