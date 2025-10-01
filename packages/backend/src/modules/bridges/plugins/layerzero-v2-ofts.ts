import { EthereumAddress } from '@l2beat/shared-pure'
import { createLayerZeroGuid, decodePacket } from './layerzero-v2'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parsePacketSent = createEventParser(
  'event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)',
)

const parsePacketDelivered = createEventParser(
  'event PacketDelivered((uint32 srcEid,bytes32 sender, uint64 nonce) origin, address receiver)',
)

const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

export const PacketOFTSent = createBridgeEventType<{
  $dstChain: string
  guid: string
  amountSentLD: number
  amountReceivedLD: number
}>('layerzero-v2.PacketOFTSent')

export const PacketOFTDelivered = createBridgeEventType<{
  $srcChain: string
  guid: string
  amountReceivedLD: number
}>('layerzero-v2.PacketOFTDelivered')

const LAYERZERO_NETWORKS = defineNetworks('layerzero', [
  {
    chainId: 1,
    eid: 30101,
    chain: 'ethereum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 42161,
    eid: 30110,
    chain: 'arbitrum',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 8453,
    eid: 30184,
    chain: 'base',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
  {
    chainId: 10,
    eid: 30111,
    chain: 'optimism',
    address: EthereumAddress('0x1a44076050125825900e736c501f859c50fE728c'),
  },
])

export class LayerZeroV2OFTsPlugin implements BridgePlugin {
  name = 'layerzero-v2-ofts'

  capture(input: LogToCapture) {
    const network = LAYERZERO_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const packetSent = parsePacketSent(input.log, [network.address])
    if (packetSent) {
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      const oftSent = nextLog && parseOFTSent(nextLog, null)
      if (!oftSent) return
      const packet = decodePacket(packetSent.encodedPayload)
      if (!packet) return

      const guid = createLayerZeroGuid(
        packet.header.nonce,
        packet.header.srcEid,
        packet.header.sender,
        packet.header.dstEid,
        packet.header.receiver,
      )
      const $dstChain = findChain(
        LAYERZERO_NETWORKS,
        (x) => x.eid,
        packet.header.dstEid,
      )
      return PacketOFTSent.create(input.ctx, {
        $dstChain,
        guid,
        amountSentLD: Number(oftSent.amountSentLD),
        amountReceivedLD: Number(oftSent.amountReceivedLD),
      })
    }

    const packetDelivered = parsePacketDelivered(input.log, [network.address])
    if (packetDelivered) {
      const previousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 1,
      )
      const oftReceived = previousLog && parseOFTReceived(previousLog, null)
      if (!oftReceived) return
      const guid = createLayerZeroGuid(
        packetDelivered.origin.nonce,
        packetDelivered.origin.srcEid,
        packetDelivered.origin.sender,
        network.eid,
        packetDelivered.receiver,
      )
      const $srcChain = findChain(
        LAYERZERO_NETWORKS,
        (x) => x.eid,
        packetDelivered.origin.srcEid,
      )
      return PacketOFTDelivered.create(input.ctx, {
        $srcChain,
        guid,
        amountReceivedLD: Number(oftReceived.amountReceivedLD),
      })
    }
  }

  matchTypes = [PacketOFTDelivered]
  match(
    packetOFTDelivered: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!PacketOFTDelivered.checkType(packetOFTDelivered)) return
    const packetOFTSent = db.find(PacketOFTSent, {
      guid: packetOFTDelivered.args.guid,
    })
    if (!packetOFTSent) return
    return [
      Result.Message('layerzero-v2.Message', [
        packetOFTSent,
        packetOFTDelivered,
      ]),
      Result.Transfer('oftv2.Transfer', {
        srcEvent: packetOFTSent,
        srcAmount: packetOFTSent.args.amountSentLD.toString(),
        dstEvent: packetOFTDelivered,
        dstAmount: packetOFTDelivered.args.amountReceivedLD.toString(),
      }),
    ]
  }
}
