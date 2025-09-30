import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  type MatchResult,
  Result,
} from './types'

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

export class LayerZeroV2OFTsPlugin implements BridgePlugin {
  name = 'layerzero-v2-ofts'

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
