import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
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
} from './types'

/**
 * This plugin tracks Hyperlane Warp Route tokens, adapters and wrappers (OFT equivalent).
 * examples: HypERC20, HypXERC20, HypERC20Collateral, HypNative(partial)
 * TODO: native token HWR only emit at the source
 */

export const parseSentTransferRemote = createEventParser(
  'event SentTransferRemote(uint32 indexed destination, bytes32 indexed recipient, uint256 amount)',
)

const parseReceivedTransferRemote = createEventParser(
  'event ReceivedTransferRemote(uint32 indexed origin, bytes32 indexed recipient, uint256 amount)',
)

const HwrTransferSent = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  destination: number
  recipient: Address32
  amount: string
  tokenAddress: Address32
}>('hyperlane-hwr.TransferSent')

const HwrTransferReceived = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
  origin: number
  recipient: Address32
  amount: string
  tokenAddress: Address32
}>('hyperlane-hwr.TransferReceived')

export class HyperlaneHwrPlugin implements InteropPlugin {
  name = 'hyperlane-hwr'

  capture(input: LogToCapture) {
    const sentTransferRemote = parseSentTransferRemote(input.log, null)
    if (sentTransferRemote) {
      const messageId = findDispatchMessageId(input, sentTransferRemote)
      if (!messageId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(sentTransferRemote.destination),
      )

      return [
        HwrTransferSent.create(input.ctx, {
          messageId,
          $dstChain,
          destination: Number(sentTransferRemote.destination),
          recipient: Address32.from(sentTransferRemote.recipient),
          amount: sentTransferRemote.amount.toString(),
          tokenAddress: Address32.from(input.log.address),
        }),
      ]
    }

    const receivedTransferRemote = parseReceivedTransferRemote(input.log, null)
    if (receivedTransferRemote) {
      const messageId = findProcessMessageId(input, receivedTransferRemote)
      if (!messageId) return

      const $srcChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(receivedTransferRemote.origin),
      )

      return [
        HwrTransferReceived.create(input.ctx, {
          messageId,
          $srcChain,
          origin: Number(receivedTransferRemote.origin),
          recipient: Address32.from(receivedTransferRemote.recipient),
          amount: receivedTransferRemote.amount.toString(),
          tokenAddress: Address32.from(input.log.address),
        }),
      ]
    }
  }

  matchTypes = [HwrTransferReceived]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!HwrTransferReceived.checkType(event)) return

    const hwrSent = db.find(HwrTransferSent, {
      messageId: event.args.messageId,
    })
    if (!hwrSent) return

    const dispatch = db.find(Dispatch, {
      messageId: event.args.messageId,
    })
    if (!dispatch) {
      return
    }

    const process = db.find(Process, {
      messageId: event.args.messageId,
    })
    if (!process) {
      return
    }

    return [
      Result.Message('hyperlane.Message', {
        app: 'hwr',
        srcEvent: dispatch,
        dstEvent: process,
      }),
      Result.Transfer('hyperlaneHwr.Transfer', {
        srcEvent: hwrSent,
        srcTokenAddress: hwrSent.args.tokenAddress,
        srcAmount: BigInt(hwrSent.args.amount),
        dstEvent: event,
        dstTokenAddress: event.args.tokenAddress, // TODO: not necessarily the token address, can be an adapter or wrapper
        dstAmount: BigInt(event.args.amount),
      }),
    ]
  }
}

export function findDispatchMessageId(
  input: LogToCapture,
  sentTransferRemote: NonNullable<ReturnType<typeof parseSentTransferRemote>>,
): `0x${string}` | undefined {
  const currentLogIndex = input.log.logIndex
  if (currentLogIndex == null) return
  const senderAddress = input.log.address.toLowerCase()

  for (let i = input.txLogs.length - 1; i >= 0; i--) {
    const txLog = input.txLogs[i]
    if (txLog.logIndex == null || txLog.logIndex >= currentLogIndex) continue

    const dispatch = parseDispatch(txLog, null)
    if (!dispatch) continue
    if (dispatch.sender.toLowerCase() !== senderAddress) return
    // TODO: edge case logs
    if (Number(dispatch.destination) !== Number(sentTransferRemote.destination))
      return

    const nextLog = input.txLogs[i + 1]
    const dispatchId = nextLog && parseDispatchId(nextLog, null)
    if (!dispatchId) continue
    return dispatchId.messageId
  }
  return
}

function findProcessMessageId(
  input: LogToCapture,
  receivedTransferRemote: NonNullable<
    ReturnType<typeof parseReceivedTransferRemote>
  >,
): `0x${string}` | undefined {
  const currentLogIndex = input.log.logIndex
  if (currentLogIndex == null) return
  const recipientAddress = input.log.address.toLowerCase()

  for (let i = input.txLogs.length - 1; i >= 0; i--) {
    const txLog = input.txLogs[i]
    if (txLog.logIndex == null || txLog.logIndex >= currentLogIndex) continue

    const process = parseProcess(txLog, null)
    if (!process) continue
    if (process.recipient.toLowerCase() !== recipientAddress) return
    if (Number(process.origin) !== Number(receivedTransferRemote.origin)) return

    const nextLog = input.txLogs.find(
      // biome-ignore lint/style/noNonNullAssertion: It's there
      (x) => x.logIndex === txLog.logIndex! + 1,
    )
    const processId = nextLog && parseProcessId(nextLog, null)
    if (!processId) return
    return processId.messageId
  }
  return
}
