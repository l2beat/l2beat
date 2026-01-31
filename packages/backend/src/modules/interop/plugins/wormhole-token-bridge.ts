import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'
import { LogMessagePublished } from './wormhole/wormhole.plugin'

const transferRedeemedLog =
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress,uint64 indexed sequence)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseLogTransferRedeemed = createEventParser(transferRedeemedLog)

const parseTransfer = createEventParser(transferLog)

export const TransferRedeemed = createInteropEventType<{
  sequence: bigint
  $srcChain: string
  srcWormholeChainId: number
  sender: EthereumAddress
  dstTokenAddress?: Address32 | undefined
  dstAmount?: bigint | undefined
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements InteropPluginResyncable {
  readonly name = 'wormhole-token-bridge'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(WormholeConfig) ?? []
    const tokenBridgeAddresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (!network.tokenBridge) continue
      try {
        tokenBridgeAddresses.push(
          ChainSpecificAddress.fromLong(network.chain, network.tokenBridge),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: transferRedeemedLog,
        includeTxEvents: [transferLog],
        addresses: tokenBridgeAddresses,
      },
    ]
  }

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
          srcTokenAddress: logMessagePublished.args.srcTokenAddress,
          srcAmount: logMessagePublished.args.srcAmount,
          dstTokenAddress: transferRedeemed.args.dstTokenAddress,
          dstAmount: transferRedeemed.args.dstAmount,
        }),
      ]
    }
  }
}
