import { EthereumAddress } from '@l2beat/shared-pure'
import { PacketDelivered, PacketSent } from './layerzerov2'
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

const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

const NETWORKS = [
  {
    chain: 'ethereum',
    nativePool: EthereumAddress('0x77b2043768d28E9C9aB44E1aBfC95944bcE57931'),
    usdcPool: EthereumAddress('0xc026395860Db2d07ee33e05fE50ed7bD583189C7'),
  },
  {
    chain: 'arbitrum',
    nativePool: EthereumAddress('0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F'),
    usdcPool: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
  },
  {
    chain: 'base',
    nativePool: EthereumAddress('0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7'),
    usdcPool: EthereumAddress('0x27a16dc786820B16E5c9028b75B99F6f604b5d26'),
  },
]

const GUID_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export const StargateV2OFTSent = createBridgeEventType<{
  guid: string
}>('stargatev2.OFTSent')

export const StargateV2OFTReceived = createBridgeEventType<{
  guid: string
  receiver: string
}>('stargatev2.OFTReceived')

export class StargateV2TaxiPlugin implements BridgePlugin {
  name = 'stargatev2taxi'
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
        return // passenger waiting for a bus
      }

      return StargateV2OFTSent.create(input.ctx, {
        guid: oftSent.guid,
      })
    }

    const oftReceived = parseOFTReceived(input.log, [
      network.nativePool,
      network.usdcPool,
    ])
    if (oftReceived) {
      // TODO: this will also capture for the bus
      return StargateV2OFTReceived.create(input.ctx, {
        guid: oftReceived.guid,
        receiver: oftReceived.toAddress,
      })
    }
  }

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!StargateV2OFTSent.checkType(event)) {
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
