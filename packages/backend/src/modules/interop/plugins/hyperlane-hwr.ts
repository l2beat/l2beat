/**
 * Hyperlane Warp Route (HWR) tokens, adapters and wrappers (OFT equivalent)
 * also tracks xERC20 that send via Hyperlane AMB
 * examples: HypERC20, HypXERC20, HypERC20Collateral, HypNative
 * OMNICHAIN
 */

import type { AbstractTokenRecord } from '@l2beat/database'
import { Address32, type ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  Dispatch,
  HYPERLANE_NETWORKS,
  Process,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
} from './hyperlane'
import { getBridgeType } from './layerzero/layerzero-v2-ofts.plugin'
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
      const transferMatch = findBestTransferLog(
        input.txLogs,
        depositForBurn?.amount ?? sentTransferRemote.amount,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
      )
      const amountWhenNoTransfer = input.tx.value ?? 0n
      if (depositForBurn) {
        return [
          HwrTransferSent.create(input, {
            messageId,
            $dstChain,
            amount: depositForBurn.amount,
            destination: Number(sentTransferRemote.destination),
            recipient: Address32.from(depositForBurn.mintRecipient),
            tokenAddress:
              transferMatch.transfer?.logAddress ??
              Address32.from(depositForBurn.burnToken),
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
          amount: pickTransferAmount(
            sentTransferRemote.amount,
            transferMatch,
            amountWhenNoTransfer,
          ),
          tokenAddress: transferMatch.transfer?.logAddress ?? Address32.NATIVE,
          cctp: false,
          burned: transferMatch.transfer
            ? transferMatch.transfer.to === Address32.ZERO
            : false,
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

      const transferMatch = findBestTransferLog(
        input.txLogs,
        receivedTransferRemote.amount,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
      )
      const amountWhenNoTransfer = input.tx.value ?? 0n
      const dstTokenData = transferMatch.transfer
        ? {
            address: transferMatch.transfer.logAddress,
            minted: transferMatch.transfer.from === Address32.ZERO,
          }
        : undefined

      return [
        HwrTransferReceived.create(input, {
          messageId,
          $srcChain,
          origin: Number(receivedTransferRemote.origin),
          recipient: Address32.from(receivedTransferRemote.recipient),
          amount: pickTransferAmount(
            receivedTransferRemote.amount,
            transferMatch,
            amountWhenNoTransfer,
          ),
          tokenAddress: dstTokenData?.address ?? Address32.NATIVE,
          minted: dstTokenData?.minted ?? false,
        }),
      ]
    }
  }

  matchTypes = [HwrTransferReceived]
  match(
    event: InteropEvent,
    db: InteropEventDb,
    deployedToAbstractMap: Map<ChainSpecificAddress, AbstractTokenRecord>,
  ): MatchResult | undefined {
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

    // bridgeType block
    const srcTokenAddress = hwrSent.args.tokenAddress
    const dstTokenAddress = event.args.tokenAddress
    const srcWasBurned = hwrSent.args.burned
    const dstWasMinted = event.args.minted
    const bridgeType = getBridgeType({
      srcTokenAddress,
      dstTokenAddress,
      srcWasBurned,
      dstWasMinted,
      srcChain: hwrSent.ctx.chain,
      dstChain: event.ctx.chain,
      deployedToAbstractMap,
      isNonMintingDefault: false,
    })

    return [
      Result.Message('hyperlane.Message', {
        app: 'hwr',
        srcEvent: dispatch,
        dstEvent: process,
      }),
      Result.Transfer('hyperlaneHwr.Transfer', {
        srcEvent: hwrSent,
        srcTokenAddress,
        srcAmount: hwrSent.args.amount,
        dstEvent: event,
        dstTokenAddress,
        dstAmount: event.args.amount,
        srcWasBurned,
        dstWasMinted,
        bridgeType,
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

export type ParsedTransferLog = {
  logAddress: Address32
  from: Address32
  to: Address32
  value: bigint
}

// meson has a different version of this that normalizes amounts (for unknown decimal situations)
function findBestTransferLog(
  logs: LogToCapture['txLogs'],
  targetAmount: bigint,
  startLogIndex: number,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  let closestMatch: ParsedTransferLog | undefined
  let closestDelta: bigint | undefined
  let closestDistance: number | undefined
  let hasTransfer = false

  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (!transfer) continue

    hasTransfer = true
    const parsed: ParsedTransferLog = {
      logAddress: Address32.from(log.address),
      from: Address32.from(transfer.from),
      to: Address32.from(transfer.to),
      value: transfer.value,
    }

    const delta = absDiff(transfer.value, targetAmount)
    const distance =
      log.logIndex === null
        ? Number.POSITIVE_INFINITY
        : Math.abs(log.logIndex - startLogIndex)

    if (
      closestDelta === undefined ||
      delta < closestDelta ||
      (delta === closestDelta &&
        (closestDistance === undefined || distance < closestDistance))
    ) {
      closestDelta = delta
      closestDistance = distance
      closestMatch = parsed
    }
  }

  return { transfer: closestMatch, hasTransfer }
}

function absDiff(value: bigint, target: bigint): bigint {
  return value >= target ? value - target : target - value
}

function pickTransferAmount(
  targetAmount: bigint,
  transferMatch: { transfer?: ParsedTransferLog; hasTransfer: boolean },
  amountWhenNoTransfer: bigint,
): bigint {
  if (!transferMatch.hasTransfer) return amountWhenNoTransfer
  const transferValue = transferMatch.transfer?.value
  if (transferValue !== undefined && transferValue !== targetAmount) {
    return transferValue
  }
  return targetAmount
}
