import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../../../tools/BinaryReader'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { PacketDelivered, PacketSent } from './layerzero/layerzero-v2.plugin'
import {
  parseOFTReceived,
  parseOFTSent,
} from './layerzero/layerzero-v2-ofts.plugin'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropEventType,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

type EventArgs<T extends InteropEventType<unknown>> =
  T extends InteropEventType<infer R> ? R : never
type EventOf<T extends InteropEventType<unknown>> = InteropEvent<EventArgs<T>>

export const StargateV2OFTSentBusRode = createInteropEventType<{
  guid: string
  emitter: EthereumAddress
  token: string
  ticketId: number
  receiver: string
  destinationEid: number
  tokenAddress: Address32
  amountSentLD: bigint
  amountReceivedLD: bigint
  amountSD: bigint
  $dstChain: string
}>('stargate-v2.OFTSentBus')

export const StargateV2OFTSentTaxi = createInteropEventType<{
  guid: string
  amountSentLD: bigint
  amountReceivedLD: bigint
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
  amountReceivedLD: bigint
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

const parseCreditsSent = createEventParser(
  'event CreditsSent(uint32 dstEid, (uint32 srcEid, uint64 amount)[] credits)',
)

const parseCreditsReceived = createEventParser(
  'event CreditsReceived(uint32 srcEid, (uint32 srcEid, uint64 amount)[] credits)',
)

export const STARGATE_NETWORKS = defineNetworks('stargate', [
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
      '0x19cFCE47eD54a88614648DC3f19A5980097007dD',
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
  {
    chain: 'polygonpos',
    eid: 30109,
    usdcPool: {
      address: EthereumAddress('0x9Aa02D4Fae7F58b8E8f34c66E756cC734DAc7fe4'),
      tokenAddress: Address32.from(
        '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7'),
      tokenAddress: Address32.from(
        '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      ),
      token: 'USDT',
    },
    tokenMessaging: EthereumAddress(
      '0x6CE9bf8CDaB780416AD1fd87b318A077D2f50EaC',
    ),
  },
  {
    chain: 'apechain',
    eid: 30312,
    nativePool: {
      address: EthereumAddress('0x28E0f0eed8d6A6a96033feEe8b2D7F32EB5CCc48'),
      tokenAddress: Address32.from(
        '0xf4D9235269a96aaDaFc9aDAe454a0618eBE37949',
      ),
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0x2086f755A6d9254045C257ea3d382ef854849B0f'),
      tokenAddress: Address32.from(
        '0xF1815bd50389c46847f0Bda824eC8da914045D14',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0xEb8d955d8Ae221E5b502851ddd78E6C4498dB4f6'),
      tokenAddress: Address32.from(
        '0x674843C06FF83502ddb4D37c2E09C01cdA38cbc8',
      ),
      token: 'USDT',
    },
    tokenMessaging: EthereumAddress(
      '0xBE574b6219C6D985d08712e90C21A88fd55f1ae8',
    ),
  },
  // zksync2 does not have stargate
  {
    chain: 'abstract',
    eid: 30324,
    nativePool: {
      address: EthereumAddress('0x221F0E1280Ec657503ca55c708105F1e1529527D'),
      tokenAddress: Address32.NATIVE,
      token: 'ETH',
    },
    usdcPool: {
      address: EthereumAddress('0x91a5Fe991ccB876d22847967CEd24dCd7A426e0E'),
      tokenAddress: Address32.from(
        '0x84A71ccD554Cc1b02749b35d22F684CC8ec987e1',
      ),
      token: 'USDC',
    },
    usdtPool: {
      address: EthereumAddress('0x943C484278b8bE05D119DfC73CfAa4c9D8f11A76'),
      tokenAddress: Address32.from(
        '0x0709F39376dEEe2A2dfC94A58EdEb2Eb9DF012bD',
      ),
      token: 'USDT',
    },
    tokenMessaging: EthereumAddress(
      '0x183D6b82680189bB4dB826F739CdC9527D467B25',
    ),
  },
])

const StargateV2CreditsSent = createInteropEventType<{
  $dstChain: string
}>('stargate-v2-credit.CreditsSent')

const StargateV2CreditsReceived = createInteropEventType<{
  $srcChain: string
}>('stargate-v2-credit.CreditsReceived')

const GUID_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export class StargatePlugin implements InteropPlugin {
  readonly name = 'stargate'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const network = STARGATE_NETWORKS.find((b) => b.chain === input.chain)
    if (!network) {
      return
    }

    const poolAddresses = [
      network.nativePool?.address,
      network.usdcPool.address,
      network.usdtPool?.address,
    ].filter((addy): addy is EthereumAddress => !!addy)

    const oftSent = parseOFTSent(input.log, poolAddresses)
    if (oftSent) {
      const pool = [
        network.nativePool,
        network.usdcPool,
        network.usdtPool,
      ].find((t) => t?.address === EthereumAddress(input.log.address))
      if (!pool) {
        return
      }
      if (oftSent.guid === GUID_ZERO) {
        const busRodeLog = input.txLogs.find((l) => parseBusRode(l, null))
        if (busRodeLog) {
          const busRode = parseBusRode(busRodeLog, [network.tokenMessaging])
          const passenger = busRode && decodeBusPassenger(busRode.passenger)
          if (busRode && passenger) {
            return [
              StargateV2OFTSentBusRode.create(input, {
                guid: oftSent.guid,
                ticketId: Number(busRode.ticketId),
                receiver: passenger.receiver,
                emitter: EthereumAddress(input.log.address),
                token: pool.token,
                destinationEid: oftSent.dstEid,
                tokenAddress: pool.tokenAddress,
                amountSentLD: oftSent.amountSentLD,
                amountReceivedLD: oftSent.amountReceivedLD,
                amountSD: passenger.amountSD,
                $dstChain: findChain(
                  STARGATE_NETWORKS,
                  (x) => x.eid,
                  oftSent.dstEid,
                ),
              }),
            ]
          }
        }
      }
      return [
        StargateV2OFTSentTaxi.create(input, {
          guid: oftSent.guid,
          amountSentLD: oftSent.amountSentLD,
          amountReceivedLD: oftSent.amountReceivedLD,
          tokenAddress: pool.tokenAddress,
          $dstChain: findChain(STARGATE_NETWORKS, (x) => x.eid, oftSent.dstEid),
        }),
      ]
    }

    const oftReceived = parseOFTReceived(input.log, poolAddresses)
    if (oftReceived) {
      const pool = [
        network.nativePool,
        network.usdcPool,
        network.usdtPool,
      ].find((t) => t?.address === EthereumAddress(input.log.address))
      if (!pool) {
        return
      }
      const destinationEid = STARGATE_NETWORKS.find(
        (n) => n.chain === input.chain,
      )?.eid
      if (!destinationEid) {
        return
      }
      return [
        StargateV2OFTReceived.create(input, {
          guid: oftReceived.guid,
          receiver: oftReceived.toAddress,
          emitter: EthereumAddress(input.log.address),
          token: pool.token,
          tokenAddress: pool.tokenAddress,
          destinationEid,
          amountReceivedLD: oftReceived.amountReceivedLD,
          $srcChain: findChain(
            STARGATE_NETWORKS,
            (x) => x.eid,
            oftReceived.srcEid,
          ),
        }),
      ]
    }

    const creditsSent = parseCreditsSent(input.log, poolAddresses)
    if (creditsSent) {
      const $dstChain = findChain(
        STARGATE_NETWORKS,
        (x) => x.eid,
        creditsSent.dstEid,
      )
      return [StargateV2CreditsSent.create(input, { $dstChain })]
    }

    const creditsReceived = parseCreditsReceived(input.log, poolAddresses)
    if (creditsReceived) {
      const $srcChain = findChain(
        STARGATE_NETWORKS,
        (x) => x.eid,
        creditsReceived.srcEid,
      )
      return [StargateV2CreditsReceived.create(input, { $srcChain })]
    }

    const busDriven = parseBusDriven(input.log, [network.tokenMessaging])
    if (busDriven) {
      return [
        StargateV2BusDriven.create(input, {
          startTicketId: Number(busDriven.startTicketId),
          numPassengers: busDriven.numPassengers,
          guid: busDriven.guid,
          destinationEid: busDriven.dstEid,
          $dstChain: findChain(
            STARGATE_NETWORKS,
            (x) => x.eid,
            busDriven.dstEid,
          ),
        }),
      ]
    }
  }

  matchTypes = [PacketDelivered]
  match(
    packetDelivered: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!PacketDelivered.checkType(packetDelivered)) return

    const guid = packetDelivered.args.guid
    const packetSent = db.find(PacketSent, { guid })
    if (!packetSent) return

    const busDriven = db.find(StargateV2BusDriven, { guid })
    if (busDriven) {
      const oftReceivedBatch = db.findAll(StargateV2OFTReceived, { guid })
      if (oftReceivedBatch.length === 0) return

      const destinationEid = oftReceivedBatch[0].args.destinationEid
      const oftSentBusRodeBatch: EventOf<typeof StargateV2OFTSentBusRode>[] = []

      for (
        let ticketId = busDriven.args.startTicketId;
        ticketId < busDriven.args.startTicketId + busDriven.args.numPassengers;
        ticketId++
      ) {
        const token =
          oftReceivedBatch[ticketId - busDriven.args.startTicketId].args.token
        const oftSentBusRode = db.find(StargateV2OFTSentBusRode, {
          ticketId,
          destinationEid,
          token,
        })
        if (!oftSentBusRode) return
        oftSentBusRodeBatch.push(oftSentBusRode)
      }

      const result: MatchResult = [
        Result.Message('layerzero-v2.Message', {
          app: 'stargate-v2-bus',
          srcEvent: packetSent,
          dstEvent: packetDelivered,
          extraEvents: [busDriven],
        }),
      ]

      for (const oftSentBusRode of oftSentBusRodeBatch) {
        const passengerReceiver = Address32.cropToEthereumAddress(
          oftSentBusRode.args.receiver as Address32,
        )
        const matchedIndex = oftReceivedBatch.findIndex(
          (o) => o.args.receiver === passengerReceiver,
        )
        if (matchedIndex === -1) return

        const [matchedOftReceived] = oftReceivedBatch.splice(matchedIndex, 1)

        result.push(
          Result.Transfer('stargate-v2-bus.Transfer', {
            srcEvent: oftSentBusRode,
            srcTokenAddress: oftSentBusRode.args.tokenAddress,
            srcAmount: oftSentBusRode.args.amountSentLD,
            dstEvent: matchedOftReceived,
            dstTokenAddress: matchedOftReceived.args.tokenAddress,
            dstAmount: matchedOftReceived.args.amountReceivedLD,
          }),
        )
      }

      return result
    }

    const oftReceived = db.find(StargateV2OFTReceived, { guid })
    if (oftReceived) {
      const oftSentTaxi = db.find(StargateV2OFTSentTaxi, { guid })
      if (!oftSentTaxi) return

      return [
        Result.Message('layerzero-v2.Message', {
          app: 'stargate-v2-taxi',
          srcEvent: packetSent,
          dstEvent: packetDelivered,
        }),
        Result.Transfer('stargate-v2-taxi.Transfer', {
          srcEvent: oftSentTaxi,
          srcTokenAddress: oftSentTaxi.args.tokenAddress,
          srcAmount: oftSentTaxi.args.amountSentLD,
          dstEvent: oftReceived,
          dstTokenAddress: oftReceived.args.tokenAddress,
          dstAmount: oftReceived.args.amountReceivedLD,
        }),
      ]
    }

    const creditsSentBatch: EventOf<typeof StargateV2CreditsSent>[] = []
    let creditsSent = db.find(StargateV2CreditsSent, {
      sameTxBefore: packetSent,
    })
    while (creditsSent) {
      creditsSentBatch.unshift(creditsSent)
      creditsSent = db.find(StargateV2CreditsSent, {
        sameTxBefore: creditsSent,
      })
    }

    const creditsReceivedBatch: EventOf<typeof StargateV2CreditsReceived>[] = []
    let creditsReceived = db.find(StargateV2CreditsReceived, {
      sameTxBefore: packetDelivered,
    })
    while (creditsReceived) {
      creditsReceivedBatch.unshift(creditsReceived)
      creditsReceived = db.find(StargateV2CreditsReceived, {
        sameTxBefore: creditsReceived,
      })
    }

    if (
      creditsSentBatch.length > 0 &&
      creditsSentBatch.length === creditsReceivedBatch.length
    ) {
      return [
        Result.Message('layerzero-v2.Message', {
          app: 'stargate-v2-credit',
          srcEvent: packetSent,
          dstEvent: packetDelivered,
          extraEvents: [...creditsSentBatch, ...creditsReceivedBatch],
        }),
      ]
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
