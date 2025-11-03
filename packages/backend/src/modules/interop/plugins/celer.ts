// TODO: find better examples
// TODO: add intent protocol

import {
  Address32,
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseMessage = createEventParser(
  'event Message(address indexed sender, address receiver, uint256 dstChainId, bytes message, uint256 fee)',
)

const parseExecuted = createEventParser(
  'event Executed(uint8 msgType, bytes32 msgId, uint8 status, address indexed receiver, uint64 srcChainId, bytes32 srcTxHash)',
)

const parseSent = createEventParser(
  'event Send(bytes32 transferId, address sender, address receiver, address token, uint256 amount, uint64 dstChainId, uint64 nonce, uint32 maxSlippage)',
)

const parseRelay = createEventParser(
  'event Relay(bytes32 transferId, address sender, address receiver, address token, uint256 amount, uint64 srcChainId, bytes32 srcTransferId)',
)

export const CELER_NETWORKS = defineNetworks('celer', [
  { celerChainId: 1, chain: 'ethereum' },
  { celerChainId: 42161, chain: 'arbitrum' },
  { celerChainId: 56, chain: 'bsc' },
  { celerChainId: 10, chain: 'optimism' },
  { celerChainId: 8453, chain: 'base' },
])

export const CelerMessage = createInteropEventType<{
  receiver: Address32
  $dstChain: string
  message: `0x${string}`
}>('celer.Message')

export const CelerExecuted = createInteropEventType<{
  msgType: number
  msgId: `0x${string}` // hash of a message
  status: number
  $srcChain: string
  srcTxHash: string
}>('celer.Executed')

export const CelerSent = createInteropEventType<{
  transferId: string
  token: Address32
  amount: string
  $dstChain: string
}>('celer.Send')

export const CelerRelay = createInteropEventType<{
  transferId: string
  token: Address32
  amount: string
  srcTransferId: string
  $srcChain: string
}>('celer.Relay')

export class CelerPlugIn implements InteropPlugin {
  name = 'celer'

  capture(input: LogToCapture) {
    const parsed = parseMessage(input.log, null)
    if (parsed) {
      return [
        CelerMessage.create(input.ctx, {
          receiver: Address32.from(parsed.receiver),
          $dstChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(parsed.dstChainId),
          ),
          message: parsed.message,
        }),
      ]
    }

    const executed = parseExecuted(input.log, null)
    if (executed) {
      return [
        CelerExecuted.create(input.ctx, {
          msgType: Number(executed.msgType),
          msgId: executed.msgId,
          status: Number(executed.status),
          $srcChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(executed.srcChainId),
          ),
          srcTxHash: executed.srcTxHash,
        }),
      ]
    }

    const sent = parseSent(input.log, null)
    if (sent) {
      return [
        CelerSent.create(input.ctx, {
          transferId: sent.transferId,
          token: Address32.from(sent.token),
          amount: sent.amount.toString(),
          $dstChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(sent.dstChainId),
          ),
        }),
      ]
    }

    const relay = parseRelay(input.log, null)
    if (relay) {
      return [
        CelerRelay.create(input.ctx, {
          transferId: relay.transferId,
          token: Address32.from(relay.token),
          amount: relay.amount.toString(),
          srcTransferId: relay.srcTransferId,
          $srcChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(relay.srcChainId),
          ),
        }),
      ]
    }
  }

  matchTypes = [CelerExecuted, CelerRelay]
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (CelerExecuted.checkType(delivery)) {
      // match by srcChain tx hash. TODO: match by message hash in the future
      const message = db.find(CelerMessage, {
        ctx: { txHash: delivery.args.srcTxHash },
      })
      if (!message) return
      return [
        Result.Message('celer.InterchainMessage', {
          app: 'unknown',
          srcEvent: message,
          dstEvent: delivery,
        }),
      ]
    }

    if (CelerRelay.checkType(delivery)) {
      const sent = db.find(CelerSent, {
        transferId: delivery.args.srcTransferId,
      })
      if (!sent) return

      return [
        Result.Message('celer.BridgeTransfer', {
          app: 'celer bridge',
          srcEvent: sent,
          dstEvent: delivery,
        }),
        Result.Transfer('celer.BridgeTransfer', {
          srcEvent: sent,
          srcTokenAddress: sent.args.token,
          srcAmount: BigInt(sent.args.amount),
          dstEvent: delivery,
          dstTokenAddress: delivery.args.token,
          dstAmount: BigInt(delivery.args.amount),
        }),
      ]
    }
  }
}
