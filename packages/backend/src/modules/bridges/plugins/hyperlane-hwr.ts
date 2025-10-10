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

/**
 * This plugin tracks Hyperlane Warp Route tokens, adapters and wrappers (OFT equivalent).
 * examples: HypERC20, HypXERC20, HypERC20Collateral, HypNative(partial)
 * TODO: native token HWR only emit at the source
 */

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
      const messageId = findDispatchMessageId(input, sentTransferRemote)
      if (!messageId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(sentTransferRemote.destination),
      )

      return HwrTransferSent.create(input.ctx, {
        messageId,
        $dstChain,
        destination: Number(sentTransferRemote.destination),
        recipient: Address32.from(sentTransferRemote.recipient),
        amount: sentTransferRemote.amount.toString(),
        tokenAddress: Address32.from(input.log.address),
      })
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

      return HwrTransferReceived.create(input.ctx, {
        messageId,
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
        srcAmount: hwrSent.args.amount,
        dstEvent: event,
        dstTokenAddress: event.args.tokenAddress, // TODO: not necessarily the token address, can be an adapter or wrapper
        dstAmount: event.args.amount,
      }),
    ]
  }
}

function findDispatchMessageId(
  input: LogToCapture,
  sentTransferRemote: NonNullable<ReturnType<typeof parseSentTransferRemote>>,
): `0x${string}` | undefined {
  const currentLogIndex = input.log.logIndex
  if (currentLogIndex == null) return undefined
  const senderAddress = input.log.address.toLowerCase()

  for (let i = input.txLogs.length - 1; i >= 0; i--) {
    const txLog = input.txLogs[i]
    if (txLog.logIndex == null || txLog.logIndex >= currentLogIndex) continue

    const dispatch = parseDispatch(txLog, null)
    if (!dispatch) continue
    if (dispatch.sender.toLowerCase() !== senderAddress) continue
    if (Number(dispatch.destination) !== Number(sentTransferRemote.destination))
      continue

    const messageId = findDispatchIdAfter(input.txLogs, txLog.logIndex)
    if (!messageId) continue
    return messageId
  }
  return undefined
}

function findDispatchIdAfter(
  logs: LogToCapture['txLogs'],
  fromLogIndex: number,
): `0x${string}` | undefined {
  for (const candidate of logs) {
    if (candidate.logIndex == null || candidate.logIndex <= fromLogIndex)
      continue
    const dispatchId = parseDispatchId(candidate, null)
    if (!dispatchId) continue
    return dispatchId.messageId as `0x${string}`
  }
  return undefined
}

function findProcessMessageId(
  input: LogToCapture,
  receivedTransferRemote: NonNullable<
    ReturnType<typeof parseReceivedTransferRemote>
  >,
): `0x${string}` | undefined {
  const currentLogIndex = input.log.logIndex
  if (currentLogIndex == null) return undefined
  const recipientAddress = input.log.address.toLowerCase()

  for (let i = input.txLogs.length - 1; i >= 0; i--) {
    const txLog = input.txLogs[i]
    if (txLog.logIndex == null || txLog.logIndex >= currentLogIndex) continue

    const process = parseProcess(txLog, null)
    if (!process) continue
    if (process.recipient.toLowerCase() !== recipientAddress) continue
    if (Number(process.origin) !== Number(receivedTransferRemote.origin))
      continue

    const processId = findProcessIdAfter(input.txLogs, txLog.logIndex)
    if (!processId) continue
    return processId
  }
  return undefined
}

function findProcessIdAfter(
  logs: LogToCapture['txLogs'],
  fromLogIndex: number,
): `0x${string}` | undefined {
  for (const candidate of logs) {
    if (candidate.logIndex == null || candidate.logIndex <= fromLogIndex)
      continue
    const processId = parseProcessId(candidate, null)
    if (!processId) continue
    return processId.messageId as `0x${string}`
  }
  return undefined
}
