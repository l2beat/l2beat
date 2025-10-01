import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createLayerZeroGuid,
  decodePacket,
  LAYERZERO_NETWORKS,
  parsePacketDelivered,
  parsePacketSent,
} from './layerzero-v2'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

export const parseOFTSent = createEventParser(
  'event OFTSent(bytes32 indexed guid, uint32 dstEid, address indexed fromAddress, uint256 amountSentLD, uint256 amountReceivedLD)',
)
export const parseOFTReceived = createEventParser(
  'event OFTReceived(bytes32 indexed guid, uint32 srcEid, address indexed toAddress, uint256 amountReceivedLD)',
)

const OFTSentPacketSent = createBridgeEventType<{
  $dstChain: string
  guid: string
  amountSentLD: number
  amountReceivedLD: number
  tokenAddress: EthereumAddress
}>('layerzero-v2.PacketOFTSent')

const OFTReceivedPacketDelivered = createBridgeEventType<{
  $srcChain: string
  guid: string
  amountReceivedLD: number
  tokenAddress: EthereumAddress
}>('layerzero-v2.PacketOFTDelivered')

export class LayerZeroV2OFTsPlugin implements BridgePlugin {
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
              tokenAddress: EthereumAddress(input.log.address),
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
            tokenAddress: EthereumAddress(input.log.address), // TODO: OFT log emitter is not always the token contract (needs effects)
          })
        }
      }
    }
  }

  matchTypes = [OFTReceivedPacketDelivered]
  match(
    oftReceivedPacketDelivered: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!OFTReceivedPacketDelivered.checkType(oftReceivedPacketDelivered))
      return
    const oftSentPacketSent = db.find(OFTSentPacketSent, {
      guid: oftReceivedPacketDelivered.args.guid,
    })
    if (!oftSentPacketSent) return
    return [
      Result.Transfer('oftv2.Transfer', {
        srcEvent: oftSentPacketSent,
        srcAmount: oftSentPacketSent.args.amountSentLD.toString(),
        srcTokenAddress: oftSentPacketSent.args.tokenAddress,
        dstEvent: oftReceivedPacketDelivered,
        dstAmount: oftReceivedPacketDelivered.args.amountReceivedLD.toString(),
        dstTokenAddress: oftReceivedPacketDelivered.args.tokenAddress, // TODO: OFT log emitter is not always the token contract (needs effects)
      }),
    ]
  }
}
