import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import {
  parseOFTReceived,
  parseOFTSent,
} from './layerzero/layerzero-v2-ofts.plugin'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropPlugin,
  type LogToCapture,
} from './types'

export const StargateV2OFTSentBusRode = createInteropEventType<{
  guid: string
  emitter: EthereumAddress
  token: string
  ticketId: number
  receiver: string
  destinationEid: number
  tokenAddress: Address32
  amountSentLD: string
  amountReceivedLD: string
  amountSD: string
  $dstChain: string
}>('stargate-v2.OFTSentBus')

export const StargateV2OFTSentTaxi = createInteropEventType<{
  guid: string
  amountSentLD: string
  amountReceivedLD: string
  tokenAddress: Address32
  $dstChain: string
}>('stargate-v2.OFTSentTaxi')

export const StargateV2OFTReceived = createInteropEventType<{
  guid: string
  receiver: string
  emitter: EthereumAddress
  token: string
  tokenAddress: Address32
  destinationEid: number
  amountReceivedLD: string
  $srcChain: string
}>('stargate-v2.OFTReceived')

const parseBusDriven = createEventParser(
  'event BusDriven(uint32 dstEid, uint72 startTicketId, uint8 numPassengers, bytes32 guid)',
)
export const StargateV2BusDriven = createInteropEventType<{
  startTicketId: number
  numPassengers: number
  guid: string
  destinationEid: number
  $dstChain: string
}>('stargate-v2.BusDriven')

const parseBusRode = createEventParser(
  'event BusRode(uint32 dstEid, uint72 ticketId, uint80 fare, bytes passenger)',
)

const STARGATE_NETWORKS = defineNetworks('stargate', [
  {
    chain: 'ethereum',
    eid: 30101,
    nativePool: {
      address: EthereumAddress('0x77b2043768d28E9C9aB44E1aBfC95944bcE57931'),
      tokenAddress: Address32.NATIVE,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0xc026395860Db2d07ee33e05fE50ed7bD583189C7'),
      tokenAddress: Address32.from(
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0x933597a323Eb81cAe705C5bC29985172fd5A3973'),
      tokenAddress: Address32.from(
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      ),
      token: 'USDT',
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
      tokenAddress: Address32.NATIVE,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
      tokenAddress: Address32.from(
        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0'),
      tokenAddress: Address32.from(
        '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      ),
      token: 'USDT',
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
      tokenAddress: Address32.NATIVE,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0x27a16dc786820B16E5c9028b75B99F6f604b5d26'),
      tokenAddress: Address32.from(
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      ),
      token: 'USDC',
    },
    // no usdt
    tokenMessaging: EthereumAddress(
      '0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47',
    ),
  },
  {
    chain: 'optimism',
    eid: 30111,
    nativePool: {
      address: EthereumAddress('0xe8CDF27AcD73a434D661C84887215F7598e7d0d3'),
      tokenAddress: Address32.NATIVE,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0'),
      tokenAddress: Address32.from(
        '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0x19cFCE47eD54a88614648DC3f19A5980097007dD'),
      tokenAddress: Address32.from(
        '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      ),
      token: 'USDT',
    },
    tokenMessaging: EthereumAddress(
      '0xF1fCb4CBd57B67d683972A59B6a7b1e2E8Bf27E6',
    ),
  },
])

const GUID_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class StargatePlugin implements InteropPlugin {
  name = 'stargate'

  capture(input: LogToCapture) {
    const network = STARGATE_NETWORKS.find((b) => b.chain === input.ctx.chain)
    if (!network) {
      return
    }

    const poolAddresses = [
      network.nativePool.address,
      network.usdcPool.address,
      network.usdtPool?.address,
    ].filter((addy): addy is EthereumAddress => !!addy)

    const oftSent = parseOFTSent(input.log, poolAddresses)
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
              $dstChain: findChain(
                STARGATE_NETWORKS,
                (x) => x.eid,
                oftSent.dstEid,
              ),
            })
          }
        }
      }
      return StargateV2OFTSentTaxi.create(input.ctx, {
        guid: oftSent.guid,
        amountSentLD: oftSent.amountSentLD.toString(),
        amountReceivedLD: oftSent.amountReceivedLD.toString(),
        tokenAddress: pool.tokenAddress,
        $dstChain: findChain(STARGATE_NETWORKS, (x) => x.eid, oftSent.dstEid),
      })
    }

    const oftReceived = parseOFTReceived(input.log, poolAddresses)
    if (oftReceived) {
      const pool = [network.nativePool, network.usdcPool].find(
        (t) => t.address === EthereumAddress(input.log.address),
      )
      if (!pool) {
        return
      }
      const destinationEid = STARGATE_NETWORKS.find(
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
        $srcChain: findChain(
          STARGATE_NETWORKS,
          (x) => x.eid,
          oftReceived.srcEid,
        ),
      })
    }

    const busDriven = parseBusDriven(input.log, [network.tokenMessaging])
    if (busDriven) {
      return StargateV2BusDriven.create(input.ctx, {
        startTicketId: Number(busDriven.startTicketId),
        numPassengers: busDriven.numPassengers,
        guid: busDriven.guid,
        destinationEid: busDriven.dstEid,
        $dstChain: findChain(STARGATE_NETWORKS, (x) => x.eid, busDriven.dstEid),
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
    const receiver = Address32.from(reader.readBytes(32))
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
