import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'
import { LogMessagePublished, NETWORKS } from './wormhole'

const parseLogTransferRedeemed = createEventParser(
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress,uint64 indexed sequence)',
)

export const TransferRedeemed = createBridgeEventType<{
  sequence: string
  srcWormholeChainId: string
  sender: string
  txHash: string
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements BridgePlugin {
  name = 'wormholeTokenBridge'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const parsed = parseLogTransferRedeemed(input.log, null)
    if (!parsed) return

    return TransferRedeemed.create(input.ctx, {
      sequence: parsed.sequence.toString(),
      srcWormholeChainId:
        NETWORKS.find(
          (n) => n.wormholeChainId === Number(parsed.emitterChainId),
        )?.chain || '???',
      sender: parsed.emitterAddress,
      txHash: input.ctx.txHash,
    })
  }

  match(
    transferRedeemed: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (TransferRedeemed.checkType(transferRedeemed)) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: transferRedeemed.args.sequence,
        wormholeChainId: transferRedeemed.args.srcWormholeChainId,
      })
      if (!logMessagePublished) {
        return
      }

      return {
        messages: [
          {
            type: 'WormholeTokenBridge.BRIDGE',
            outbound: logMessagePublished,
            inbound: transferRedeemed,
          },
        ],
      }
    }
  }
}
