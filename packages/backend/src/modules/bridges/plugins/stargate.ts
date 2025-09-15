import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
} from './types'

const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
export const StargateV2OFTSentBusRode = createBridgeEventType<{
  guid: string
  emitter: EthereumAddress
  token: string
  ticketId: number
  receiver: string
  destinationEid: number
  tokenAddress: EthereumAddress | 'native'
  amountSentLD: string
  amountReceivedLD: string
  amountSD: string
}>('stargatev2.OFTSentBus')

export const StargateV2OFTSentTaxi = createBridgeEventType<{
  guid: string
  amountSentLD: string
  amountReceivedLD: string
  tokenAddress: EthereumAddress | 'native'
}>('stargatev2.OFTSentTaxi')

const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)
export const StargateV2OFTReceived = createBridgeEventType<{
  guid: string
  receiver: string
  emitter: EthereumAddress
  token: string
  tokenAddress: EthereumAddress | 'native'
  destinationEid: number
  amountReceivedLD: string
}>('stargatev2.OFTReceived')

const parseBusDriven = createEventParser(
  'event BusDriven(uint32 dstEid, uint72 startTicketId, uint8 numPassengers, bytes32 guid)',
)
export const StargateV2BusDriven = createBridgeEventType<{
  startTicketId: number
  numPassengers: number
  guid: string
  destinationEid: number
}>('stargatev2.BusDriven')

const parseBusRode = createEventParser(
  'event BusRode(uint32 dstEid, uint72 ticketId, uint80 fare, bytes passenger)',
)

const NETWORKS = [
  {
    chain: 'ethereum',
    eid: 30101,
    nativePool: {
      address: EthereumAddress('0x77b2043768d28E9C9aB44E1aBfC95944bcE57931'),
      tokenAddress: 'native' as const,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0xc026395860Db2d07ee33e05fE50ed7bD583189C7'),
      tokenAddress: EthereumAddress(
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      ),
      token: 'USDC',
    },
    tokenMessaging: EthereumAddress(
      '0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980',
    ),
  },
  {
    chain: 'arbitrum',
    eid: 30110,
    nativePool: {
      address: EthereumAddress('0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F'),
      tokenAddress: 'native' as const,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
      tokenAddress: EthereumAddress(
        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      ),
      token: 'USDC',
    },
    tokenMessaging: EthereumAddress(
      '0x6E3d884C96d640526F273C61dfcF08915eBd7e2B',
    ),
  },
  {
    chain: 'base',
    eid: 30184,
    nativePool: {
      address: EthereumAddress('0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7'),
      tokenAddress: 'native' as const,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0x27a16dc786820B16E5c9028b75B99F6f604b5d26'),
      tokenAddress: EthereumAddress(
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      ),
      token: 'USDC',
    },
    tokenMessaging: EthereumAddress(
      '0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47',
    ),
  },
]

const GUID_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class StargatePlugin implements BridgePlugin {
  name = 'stargate'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const network = NETWORKS.find((b) => b.chain === input.ctx.chain)
    if (!network) {
      return
    }

    const oftSent = parseOFTSent(input.log, [
      network.nativePool.address,
      network.usdcPool.address,
    ])
    if (oftSent) {
      const pool = [network.nativePool, network.usdcPool].find(
        (t) => t.address === EthereumAddress(input.log.address),
      )
      if (!pool) {
        return
      }
      if (oftSent.guid === GUID_ZERO) {
        const busRodeLog = input.txLogs.find((l) => parseBusRode(l, null))
        if (busRodeLog) {
          const busRode = parseBusRode(busRodeLog, [network.tokenMessaging])
          const passenger = busRode && decodeBusPassenger(busRode.passenger)

          if (busRode && passenger) {
            return StargateV2OFTSentBusRode.create(input.ctx, {
              guid: oftSent.guid,
              ticketId: Number(busRode.ticketId),
              receiver: passenger.receiver,
              emitter: EthereumAddress(input.log.address),
              token: pool.token,
              destinationEid: oftSent.dstEid,
              tokenAddress: pool.tokenAddress,
              amountSentLD: oftSent.amountSentLD.toString(),
              amountReceivedLD: oftSent.amountReceivedLD.toString(),
              amountSD: passenger.amountSD.toString(),
            })
          }
        }
      }
      return StargateV2OFTSentTaxi.create(input.ctx, {
        guid: oftSent.guid,
        amountSentLD: oftSent.amountSentLD.toString(),
        amountReceivedLD: oftSent.amountReceivedLD.toString(),
        tokenAddress: pool.tokenAddress,
      })
    }

    const oftReceived = parseOFTReceived(input.log, [
      network.nativePool.address,
      network.usdcPool.address,
    ])
    if (oftReceived) {
      const pool = [network.nativePool, network.usdcPool].find(
        (t) => t.address === EthereumAddress(input.log.address),
      )
      if (!pool) {
        return
      }
      const destinationEid = NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )?.eid
      if (!destinationEid) {
        return
      }
      return StargateV2OFTReceived.create(input.ctx, {
        guid: oftReceived.guid,
        receiver: oftReceived.toAddress,
        emitter: EthereumAddress(input.log.address),
        token: pool.token,
        tokenAddress: pool.tokenAddress,
        destinationEid,
        amountReceivedLD: oftReceived.amountReceivedLD.toString(),
      })
    }

    const busDriven = parseBusDriven(input.log, [network.tokenMessaging])
    if (busDriven) {
      return StargateV2BusDriven.create(input.ctx, {
        startTicketId: Number(busDriven.startTicketId),
        numPassengers: busDriven.numPassengers,
        guid: busDriven.guid,
        destinationEid: busDriven.dstEid,
      })
    }
  }
}

// Decode passenger bytes per encodePacked(uint16, bytes32, uint64, bool)
// https://etherscan.io/address/0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980#code#F39#L6
// https://etherscan.io/address/0x6d6620eFa72948C5f68A3C8646d58C00d3f4A980#code#F39#L39
export function decodeBusPassenger(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const assetId = reader.readUint16()
    const receiver = EthereumAddress(reader.readAddress())
    const amountSD = reader.readUint64()
    const nativeDrop = reader.readUint8() !== 0
    return {
      assetId,
      receiver,
      amountSD,
      nativeDrop,
    }
  } catch {
    return undefined
  }
}
