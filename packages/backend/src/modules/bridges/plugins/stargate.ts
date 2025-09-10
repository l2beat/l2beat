import type { Logger } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
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
  tokenAddress: EthereumAddress
  amountSentLD: number
  amountReceivedLD: number
  amountSD: number
}>('stargatev2.OFTSentBus')

export const StargateV2OFTSentTaxi = createBridgeEventType<{
  guid: string
  amountSentLD: number
  amountReceivedLD: number
  tokenAddress: EthereumAddress
}>('stargatev2.OFTSentTaxi')

const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)
export const StargateV2OFTReceived = createBridgeEventType<{
  guid: string
  receiver: string
  emitter: EthereumAddress
  token: string
  tokenAddress: EthereumAddress
  destinationEid: number
  amountReceivedLD: number
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
      tokenAddress: EthereumAddress.ZERO,
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
      tokenAddress: EthereumAddress.ZERO,
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
      tokenAddress: EthereumAddress.ZERO,
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

  constructor(private logger: Logger) {}

  capture(input: LogToCapture) {
    const network = NETWORKS.find((b) => b.chain === input.ctx.chain)
    if (!network) {
      this.logger.warn('Network not configured', {
        plugin: this.name,
        ctx: input.ctx,
      })
      return
    }

    return (
      this.parseOftSent(input, network) ||
      this.captureOftReceived(input, network) ||
      this.captureBusDriven(input, network)
    )
  }

  private parseOftSent(
    input: LogToCapture,
    network: (typeof NETWORKS)[number],
  ) {
    const oftSent = parseOFTSent(input.log, [
      network.nativePool.address,
      network.usdcPool.address,
    ])
    const pool = [network.nativePool, network.usdcPool].find(
      (t) => t.address === EthereumAddress(input.log.address),
    )

    if (!pool) {
      return
    }

    if (oftSent && oftSent.guid === GUID_ZERO) {
      const busRodeLog = input.txLogs.find((l) => parseBusRode(l, null))
      if (busRodeLog) {
        const busRode = parseBusRode(busRodeLog, [network.tokenMessaging])

        if (busRode) {
          return StargateV2OFTSentBusRode.create(input.ctx, {
            guid: oftSent.guid,
            ticketId: Number(busRode.ticketId),
            receiver: decodeBusPassenger(busRode.passenger).receiver,
            emitter: EthereumAddress(input.log.address),
            token: pool.token,
            destinationEid: oftSent.dstEid,
            tokenAddress: pool.tokenAddress,
            amountSentLD: Number(oftSent.amountSentLD),
            amountReceivedLD: Number(oftSent.amountReceivedLD),
            amountSD: Number(decodeBusPassenger(busRode.passenger).amountSD),
          })
        }
      }
    }

    if (oftSent) {
      return StargateV2OFTSentTaxi.create(input.ctx, {
        guid: oftSent.guid,
        amountSentLD: Number(oftSent.amountSentLD),
        amountReceivedLD: Number(oftSent.amountReceivedLD),
        tokenAddress: pool.tokenAddress,
      })
    }
  }

  private captureOftReceived(
    input: LogToCapture,
    network: (typeof NETWORKS)[number],
  ) {
    const oftReceived = parseOFTReceived(input.log, [
      network.nativePool.address,
      network.usdcPool.address,
    ])
    if (!oftReceived) {
      return
    }

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
      amountReceivedLD: Number(oftReceived.amountReceivedLD),
    })
  }

  private captureBusDriven(
    input: LogToCapture,
    network: (typeof NETWORKS)[number],
  ) {
    const busDriven = parseBusDriven(input.log, [network.tokenMessaging])
    if (!busDriven) {
      return
    }
    return StargateV2BusDriven.create(input.ctx, {
      startTicketId: Number(busDriven.startTicketId),
      numPassengers: busDriven.numPassengers,
      guid: busDriven.guid,
      destinationEid: busDriven.dstEid,
    })
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
