// TODO: find better examples
// TODO: add intent protocol

import { Address32 } from '@l2beat/shared-pure'
import {
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

const parseMessageWithTransfer = createEventParser(
  'event MessageWithTransfer(address indexed sender, address receiver, uint256 dstChainId, address bridge, bytes32 srcTransferId, bytes message, uint256 fee)',
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
  { celerChainId: 10, chain: 'optimism' },
  { celerChainId: 8453, chain: 'base' },
  { celerChainId: 56, chain: 'bsc' },
  { celerChainId: 137, chain: 'polygonpos' },
  { celerChainId: 324, chain: 'zksync2' },
  { celerChainId: 59144, chain: 'linea' },
  { celerChainId: 196, chain: 'xlayer' },
])

export const CelerMessage = createInteropEventType<{
  receiver: Address32
  $dstChain: string
  message: `0x${string}`
  wraps?: Address32
}>('celer.Message', { direction: 'outgoing' })

export const CelerExecuted = createInteropEventType<{
  msgType: number
  msgId: `0x${string}` // hash of a message
  status: number
  $srcChain: string
  srcTxHash: string
}>('celer.Executed', { direction: 'incoming' })

export const CelerSent = createInteropEventType<{
  transferId: string
  token: Address32
  amount: bigint
  $dstChain: string
}>('celer.Send', { direction: 'outgoing' })

export const CelerRelay = createInteropEventType<{
  transferId: string
  token: Address32
  amount: bigint
  srcTransferId: string
  $srcChain: string
}>('celer.Relay', { direction: 'incoming' })

export class CelerPlugIn implements InteropPlugin {
  readonly name = 'celer'

  capture(input: LogToCapture) {
    const message = parseMessage(input.log, null)
    if (message) {
      return [
        CelerMessage.create(input, {
          receiver: Address32.from(message.receiver),
          $dstChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(message.dstChainId),
          ),
          message: message.message,
        }),
      ]
    }

    const messageWithTransfer = parseMessageWithTransfer(input.log, null)
    if (messageWithTransfer) {
      return [
        CelerMessage.create(input, {
          receiver: Address32.from(messageWithTransfer.receiver),
          $dstChain: findChain(
            CELER_NETWORKS,
            (x) => x.celerChainId,
            Number(messageWithTransfer.dstChainId),
          ),
          message: messageWithTransfer.message,
          wraps: Address32.from(messageWithTransfer.bridge),
        }),
      ]
    }

    const executed = parseExecuted(input.log, null)
    if (executed) {
      return [
        CelerExecuted.create(input, {
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
        CelerSent.create(input, {
          transferId: sent.transferId,
          token: Address32.from(sent.token),
          amount: sent.amount,
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
        CelerRelay.create(input, {
          transferId: relay.transferId,
          token: Address32.from(relay.token),
          amount: relay.amount,
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
      // celer sometimes wraps cctp, canonical bridges, anything with a token
      const app = message.args.wraps ? 'wrappingForeignTransfer' : 'unknown'
      return [
        Result.Message('celer.Message', {
          app,
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
        Result.Message('celer.Message', {
          app: 'cBridge',
          srcEvent: sent,
          dstEvent: delivery,
        }),
        Result.Transfer('celer.Transfer', {
          srcEvent: sent,
          srcTokenAddress: sent.args.token,
          srcAmount: sent.args.amount,
          srcWasBurned: false,
          dstEvent: delivery,
          dstTokenAddress: delivery.args.token,
          dstAmount: delivery.args.amount,
          dstWasMinted: false,
          bridgeType: 'nonMinting',
        }),
      ]
    }
  }
}
