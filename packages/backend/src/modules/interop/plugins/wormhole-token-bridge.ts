import { Address32, EthereumAddress } from '@l2beat/shared-pure'
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
  sender: EthereumAddress
  dstTokenAddress?: Address32 | undefined
  dstAmount?: bigint | undefined
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements InteropPlugin {
  readonly name = 'wormhole-token-bridge'

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

    // emitterAddress is bytes32 (Wormhole format), extract last 20 bytes for EthereumAddress
    const senderAddress = EthereumAddress(
      `0x${parsed.emitterAddress.slice(-40)}`,
    )
    return [
      TransferRedeemed.create(input, {
        sequence: parsed.sequence,
        $srcChain: findChain(
          wormholeNetworks,
          (x) => x.wormholeChainId,
          parsed.emitterChainId,
        ),
        dstTokenAddress: nextLog && Address32.from(nextLog.address),
        dstAmount: transfer?.value,
        srcWormholeChainId: parsed.emitterChainId,
        sender: senderAddress,
      }),
    ]
  }

  matchTypes = [TransferRedeemed]
  match(
    transferRedeemed: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (TransferRedeemed.checkType(transferRedeemed)) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: transferRedeemed.args.sequence,
        wormholeChainId: transferRedeemed.args.srcWormholeChainId,
        sender: transferRedeemed.args.sender,
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
          dstTokenAddress: transferRedeemed.args.dstTokenAddress,
          dstAmount: transferRedeemed.args.dstAmount,
        }),
      ]
    }
  }
}
