import { Address32 } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
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
import { WormholeConfig } from './wormhole/wormhole.config'
import { LogMessagePublished } from './wormhole/wormhole.plugin'

const parseLogTransferRedeemed = createEventParser(
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress,uint64 indexed sequence)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export const TransferRedeemed = createInteropEventType<{
  sequence: bigint
  $srcChain: string
  srcWormholeChainId: number
  sender: string
  srcTokenAddress?: Address32 | undefined
  srcAmount?: bigint | undefined
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements InteropPlugin {
  name = 'wormhole-token-bridge'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    const parsed = parseLogTransferRedeemed(input.log, null)
    if (!parsed) return
    const nextLog = input.txLogs.find(
      // biome-ignore lint/style/noNonNullAssertion: It's there
      (x) => x.logIndex === input.log.logIndex! + 1,
    )
    const transfer = nextLog && parseTransfer(nextLog, null)

    return [
      TransferRedeemed.create(input, {
        sequence: parsed.sequence,
        $srcChain: findChain(
          wormholeNetworks,
          (x) => x.wormholeChainId,
          parsed.emitterChainId,
        ),
        srcTokenAddress: nextLog && Address32.from(nextLog.address),
        srcAmount: transfer?.value,
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
          app: 'wormhole-tokenbridge',
          srcEvent: logMessagePublished,
          dstEvent: transferRedeemed,
        }),
        Result.Transfer('wormhole-tokenbridge.Transfer', {
          srcEvent: logMessagePublished,
          dstEvent: transferRedeemed,
          srcTokenAddress: transferRedeemed.args.srcTokenAddress,
          srcAmount: transferRedeemed.args.srcAmount,
        }),
      ]
    }
  }
}
