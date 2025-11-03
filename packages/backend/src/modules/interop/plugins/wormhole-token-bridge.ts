import {
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { LogMessagePublished, WORMHOLE_NETWORKS } from './wormhole'

const parseLogTransferRedeemed = createEventParser(
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress,uint64 indexed sequence)',
)

export const TransferRedeemed = createInteropEventType<{
  sequence: string
  $srcChain: string
  srcWormholeChainId: number
  sender: string
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements InteropPlugin {
  name = 'wormhole-token-bridge'

  capture(input: LogToCapture) {
    const parsed = parseLogTransferRedeemed(input.log, null)
    if (!parsed) return

    return [
      TransferRedeemed.create(input.ctx, {
        sequence: parsed.sequence.toString(),
        $srcChain: findChain(
          WORMHOLE_NETWORKS,
          (x) => x.wormholeChainId,
          parsed.emitterChainId,
        ),
        srcWormholeChainId: parsed.emitterChainId,
        sender: parsed.emitterAddress,
      }),
    ]
  }

  matchTypes = [TransferRedeemed]
  match(
    transferRedeemed: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (TransferRedeemed.checkType(transferRedeemed)) {
      // TODO: we should match by sequence + emitter/sender address (wormhole proto), not assume there is only one emitter per chain of LogMessagePublished
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: transferRedeemed.args.sequence,
        wormholeChainId: transferRedeemed.args.srcWormholeChainId,
      })
      if (!logMessagePublished) {
        return
      }

      return [
        Result.Message('wormhole.Message', {
          app: 'wormhole-token-bridge',
          srcEvent: logMessagePublished,
          dstEvent: transferRedeemed,
        }),
        // TODO: Add transfer
      ]
    }
  }
}
