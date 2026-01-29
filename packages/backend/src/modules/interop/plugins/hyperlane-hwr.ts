/**
 * Hyperlane Warp Route (HWR) tokens, adapters and wrappers (OFT equivalent)
 * also tracks xERC20 that send via Hyperlane AMB
 * examples: HypERC20, HypXERC20, HypERC20Collateral, HypNative
 * OMNICHAIN
 */
import { Address32 } from '@l2beat/shared-pure'
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

export const parseSentTransferRemote = createEventParser(
  'event SentTransferRemote(uint32 indexed destination, bytes32 indexed recipient, uint256 amount)',
)

const parseReceivedTransferRemote = createEventParser(
  'event ReceivedTransferRemote(uint32 indexed origin, bytes32 indexed recipient, uint256 amount)',
)

export const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

const parseDepositForBurnCCTPv1 = createEventParser(
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)',
)
const parseDepositForBurnCCTPv2 = createEventParser(
  'event DepositForBurn(address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 indexed minFinalityThreshold, bytes hookData)',
)

const HwrTransferSent = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  destination: number
  recipient: Address32
  amount: bigint
  tokenAddress: Address32
  cctp: boolean
  burned: boolean
}>('hyperlane-hwr.TransferSent')

const HwrTransferReceived = createInteropEventType<{
  messageId: `0x${string}`
  $srcChain: string
  origin: number
  recipient: Address32
  amount: bigint
  tokenAddress: Address32
  minted: boolean
}>('hyperlane-hwr.TransferReceived')

export class HyperlaneHwrPlugin implements InteropPlugin {
  readonly name = 'hyperlane-hwr'

  capture(input: LogToCapture) {
    const sentTransferRemote = parseSentTransferRemote(input.log, null)
    if (sentTransferRemote) {
      const senderAddress = input.log.address.toLowerCase()
      const messageId = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (txLog, index) => {
          const dispatch = parseDispatch(txLog, null)
          if (!dispatch) return
          if (dispatch.sender.toLowerCase() !== senderAddress) return
          if (
            Number(dispatch.destination) !==
            Number(sentTransferRemote.destination)
          )
            return

          const nextLog = input.txLogs[index + 1]
          const dispatchId = nextLog && parseDispatchId(nextLog, null)
          return dispatchId?.messageId
        },
      )
      if (!messageId) return

      const $dstChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(sentTransferRemote.destination),
      )

      const matchingTransfer = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (isWithinTolerance(transfer.value, sentTransferRemote.amount))
            return {
              address: Address32.from(log.address),
              burned: Address32.from(transfer.to) === Address32.ZERO,
            }
        },
      )

      const depositForBurn = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          return (
            parseDepositForBurnCCTPv1(log, null) ||
            parseDepositForBurnCCTPv2(log, null)
          )
        },
      )
      if (depositForBurn) {
        return [
          HwrTransferSent.create(input, {
            messageId,
            $dstChain,
            amount: depositForBurn.amount,
            destination: Number(sentTransferRemote.destination),
            recipient: Address32.from(depositForBurn.mintRecipient),
            tokenAddress: matchingTransfer?.address ?? Address32.NATIVE,
            cctp: true,
            burned: true,
          }),
        ]
      }

      return [
        HwrTransferSent.create(input, {
          messageId,
          $dstChain,
          destination: Number(sentTransferRemote.destination),
          recipient: Address32.from(sentTransferRemote.recipient),
          amount: sentTransferRemote.amount,
          tokenAddress: matchingTransfer?.address ?? Address32.NATIVE,
          cctp: false,
          burned: matchingTransfer?.burned ?? false,
        }),
      ]
    }

    const receivedTransferRemote = parseReceivedTransferRemote(input.log, null)
    if (receivedTransferRemote) {
      const recipientAddress = input.log.address.toLowerCase()
      const messageId = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (txLog, index) => {
          const process = parseProcess(txLog, null)
          if (!process) return
          if (process.recipient.toLowerCase() !== recipientAddress) return
          if (Number(process.origin) !== Number(receivedTransferRemote.origin))
            return

          const nextLog = input.txLogs[index + 1]
          const processId = nextLog && parseProcessId(nextLog, null)
          return processId?.messageId
        },
      )
      if (!messageId) return

      const $srcChain = findChain(
        HYPERLANE_NETWORKS,
        (x) => x.chainId,
        Number(receivedTransferRemote.origin),
      )

      const dstTokenAddress = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== receivedTransferRemote.amount) return
          return {
            address: Address32.from(log.address),
            minted: Address32.from(transfer.from) === Address32.ZERO,
          }
        },
      )

      return [
        HwrTransferReceived.create(input, {
          messageId,
          $srcChain,
          origin: Number(receivedTransferRemote.origin),
          recipient: Address32.from(receivedTransferRemote.recipient),
          amount: receivedTransferRemote.amount,
          tokenAddress: dstTokenAddress?.address ?? Address32.NATIVE,
          minted: dstTokenAddress?.minted ?? false,
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

    if (hwrSent.args.cctp) {
      return [
        Result.Message('hyperlane.Message', {
          app: 'cctp',
          srcEvent: hwrSent,
          dstEvent: process,
          extraEvents: [dispatch, event],
        }),
      ]
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
        dstTokenAddress: event.args.tokenAddress,
        dstAmount: event.args.amount,
        srcWasBurned: hwrSent.args.burned,
        dstWasMinted: event.args.minted,
      }),
    ]
  }
}

export function findParsedAround<T>(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  transform: (
    log: LogToCapture['txLogs'][number],
    index: number,
  ) => T | undefined,
): T | undefined {
  const startPos = logs.findIndex((log) => log.logIndex === startLogIndex)
  if (startPos === -1) return

  for (let offset = 0; offset < logs.length; offset++) {
    const forward = startPos + offset
    if (forward < logs.length) {
      const transformed = transform(logs[forward], forward)
      if (transformed) return transformed
    }

    if (offset === 0) continue
    const backward = startPos - offset
    if (backward >= 0) {
      const transformed = transform(logs[backward], backward)
      if (transformed) return transformed
    }
  }
}

const AMOUNT_FEE_TOLERANCE = 500n // yea this is bIpS

function isWithinTolerance(value: bigint, target: bigint): boolean {
  if (target === 0n) return value === 0n
  const delta = (target * AMOUNT_FEE_TOLERANCE) / 10_000n
  return value >= target - delta && value <= target + delta
}
