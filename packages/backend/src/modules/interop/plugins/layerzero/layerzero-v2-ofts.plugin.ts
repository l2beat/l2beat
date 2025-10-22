import {
  Address32,
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import {
  createLayerZeroGuid,
  decodePacket,
  LAYERZERO_NETWORKS,
  PacketDelivered,
  PacketSent,
  parsePacketDelivered,
  parsePacketSent,
} from './layerzero-v2.plugin'

export const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
export const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

const OFTSentPacketSent = createInteropEventType<{
  $dstChain: string
  guid: string
  amountSentLD: number
  amountReceivedLD: number
  tokenAddress: Address32
}>('layerzero-v2.PacketOFTSent')

const OFTReceivedPacketDelivered = createInteropEventType<{
  $srcChain: string
  guid: string
  amountReceivedLD: number
  tokenAddress: Address32
}>('layerzero-v2.PacketOFTDelivered')

export class LayerZeroV2OFTsPlugin implements InteropPlugin {
  name = 'layerzero-v2-ofts'

  capture(input: LogToCapture) {
    const network = LAYERZERO_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const oftSent = parseOFTSent(input.log, null)
    if (oftSent) {
      const previousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 1,
      )
      if (previousLog) {
        const packetSent = parsePacketSent(previousLog, [network.address])
        if (packetSent) {
          const packet = decodePacket(packetSent.encodedPayload)
          if (packet) {
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
            return OFTSentPacketSent.create(input.ctx, {
              $dstChain,
              guid,
              amountSentLD: Number(oftSent.amountSentLD),
              amountReceivedLD: Number(oftSent.amountReceivedLD),
              tokenAddress: Address32.from(input.log.address),
            })
          }
        }
      }
    }

    const oftReceived = parseOFTReceived(input.log, null)
    if (oftReceived) {
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      if (nextLog) {
        const packetDelivered = parsePacketDelivered(nextLog, [network.address])
        if (packetDelivered) {
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
          return OFTReceivedPacketDelivered.create(input.ctx, {
            $srcChain,
            guid,
            amountReceivedLD: Number(oftReceived.amountReceivedLD),
            // TODO: OFT log emitter is not always the token contract (needs effects)
            tokenAddress: Address32.from(input.log.address),
          })
        }
      }
    }
  }

  matchTypes = [OFTReceivedPacketDelivered]
  match(
    oftReceivedPacketDelivered: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OFTReceivedPacketDelivered.checkType(oftReceivedPacketDelivered))
      return

    const guid = oftReceivedPacketDelivered.args.guid

    const oftSentPacketSent = db.find(OFTSentPacketSent, { guid })
    if (!oftSentPacketSent) return

    const packetSent = db.find(PacketSent, { guid })
    if (!packetSent) return

    const packetDelivered = db.find(PacketDelivered, { guid })
    if (!packetDelivered) return

    return [
      Result.Message('layerzero-v2.Message', {
        app: 'oftv2',
        srcEvent: packetSent,
        dstEvent: packetDelivered,
      }),
      Result.Transfer('oftv2.Transfer', {
        srcEvent: oftSentPacketSent,
        srcAmount: oftSentPacketSent.args.amountSentLD.toString(),
        srcTokenAddress: oftSentPacketSent.args.tokenAddress,
        dstEvent: oftReceivedPacketDelivered,
        dstAmount: oftReceivedPacketDelivered.args.amountReceivedLD.toString(),
        // TODO: OFT log emitter is not always the token contract (needs effects)
        dstTokenAddress: oftReceivedPacketDelivered.args.tokenAddress,
      }),
    ]
  }
}
