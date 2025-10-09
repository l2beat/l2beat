import {
  HYPERLANE_NETWORKS,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import {
  Address32,
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

const parseSentTransferRemote = createEventParser(
  'event SentTransferRemote(uint32 indexed destination, bytes32 indexed recipient, uint256 amount)',
)

const parseReceivedTransferRemote = createEventParser(
  'event ReceivedTransferRemote(uint32 indexed origin, bytes32 indexed recipient, uint256 amount)',
)

export const HwrTransferSent = createBridgeEventType<{
  messageId: `0x${string}`
  $dstChain: string
  destination: number
  recipient: Address32
  amount: string
  tokenAddress: Address32
}>('hyperlane-hwr.TransferSent')

export const HwrTransferReceived = createBridgeEventType<{
  messageId: `0x${string}`
  $srcChain: string
  origin: number
  recipient: Address32
  amount: string
  tokenAddress: Address32
}>('hyperlane-hwr.TransferReceived')

export class HyperlaneHwrPlugin implements BridgePlugin {
  name = 'hyperlane-hwr'

  capture(input: LogToCapture) {
    const sentTransferRemote = parseSentTransferRemote(input.log, null)
    if (sentTransferRemote) {
      const matchingDispatch = findMatchingDispatch(input, sentTransferRemote)
      if (!matchingDispatch) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(sentTransferRemote.destination),
      )

      return HwrTransferSent.create(input.ctx, {
        messageId: matchingDispatch.messageId,
        $dstChain,
        destination: Number(sentTransferRemote.destination),
        recipient: Address32.from(sentTransferRemote.recipient),
        amount: sentTransferRemote.amount.toString(),
        tokenAddress: Address32.from(input.log.address),
      })
    }

    const receivedTransferRemote = parseReceivedTransferRemote(input.log, null)
    if (receivedTransferRemote) {
      const matchingProcess = findMatchingProcess(input, receivedTransferRemote)
      if (!matchingProcess) return

      const $srcChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(receivedTransferRemote.origin),
      )

      return HwrTransferReceived.create(input.ctx, {
        messageId: matchingProcess.messageId,
        $srcChain,
        origin: Number(receivedTransferRemote.origin),
        recipient: Address32.from(receivedTransferRemote.recipient),
        amount: receivedTransferRemote.amount.toString(),
        tokenAddress: Address32.from(input.log.address),
      })
    }
  }

  matchTypes = [HwrTransferReceived]
  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!HwrTransferReceived.checkType(event)) return

    const hwrSent = db.find(HwrTransferSent, {
      messageId: event.args.messageId,
    })
    if (!hwrSent) return

    return [
      Result.Transfer('hyperlaneHwr.Transfer', {
        srcEvent: hwrSent,
        srcTokenAddress: hwrSent.args.tokenAddress,
        srcAmount: hwrSent.args.amount,
        dstEvent: event,
        dstTokenAddress: event.args.tokenAddress,
        dstAmount: event.args.amount,
      }),
    ]
  }
}

function findMatchingDispatch(
  input: LogToCapture,
  sentTransferRemote: NonNullable<ReturnType<typeof parseSentTransferRemote>>,
):
  | {
      messageId: `0x${string}`
    }
  | undefined {
  const senderAddress = input.log.address.toLowerCase()
  for (const txLog of input.txLogs) {
    const dispatch = parseDispatch(txLog, null)
    if (!dispatch) continue
    if (dispatch.sender.toLowerCase() !== senderAddress) continue
    if (Number(dispatch.destination) !== Number(sentTransferRemote.destination))
      continue
    if (txLog.logIndex == null) continue
    const currentIndex = txLog.logIndex
    let messageId: `0x${string}` | undefined
    for (const candidate of input.txLogs) {
      if (candidate.logIndex == null) continue
      if (candidate.logIndex <= currentIndex) continue
      const dispatchId = parseDispatchId(candidate, null)
      if (!dispatchId) continue
      messageId = dispatchId.messageId as `0x${string}`
      break
    }
    if (!messageId) continue
    return { messageId }
  }
  return undefined
}

function findMatchingProcess(
  input: LogToCapture,
  receivedTransferRemote: NonNullable<
    ReturnType<typeof parseReceivedTransferRemote>
  >,
):
  | {
      messageId: `0x${string}`
    }
  | undefined {
  const recipientAddress = input.log.address.toLowerCase()
  for (const txLog of input.txLogs) {
    const process = parseProcess(txLog, null)
    if (!process) continue
    if (process.recipient.toLowerCase() !== recipientAddress) continue
    if (Number(process.origin) !== Number(receivedTransferRemote.origin))
      continue
    if (txLog.logIndex == null) continue
    const currentLogIndex = txLog.logIndex
    const nextLog = input.txLogs.find((x) => x.logIndex === currentLogIndex + 1)
    if (!nextLog) continue
    const processId = parseProcessId(nextLog, null)
    if (!processId) continue
    const messageId = processId.messageId as `0x${string}`
    return { messageId }
  }
  return undefined
}
