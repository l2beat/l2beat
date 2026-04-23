/**
 * Hyperlane Warp Route (HWR) tokens, adapters and wrappers (OFT equivalent)
 * also tracks xERC20 that send via Hyperlane AMB
 * examples: HypERC20, HypXERC20, HypERC20Collateral, HypNative
 * OMNICHAIN
 */

import { Address32 } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import type { TokenMap } from '../engine/match/TokenMap'
import {
  Dispatch,
  dispatchIdLog,
  dispatchLog,
  Process,
  parseDispatch,
  parseDispatchId,
  parseProcess,
  parseProcessId,
  processIdLog,
  processLog,
} from './hyperlane'
import { findHyperlaneChain, HyperlaneConfig } from './hyperlane.config'
import { getBridgeType } from './layerzero/layerzero-v2-ofts.plugin'
import { findParsedAround, type ParsedTransferLog } from './logScan'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

export const sentTransferRemoteLog =
  'event SentTransferRemote(uint32 indexed destination, bytes32 indexed recipient, uint256 amount)'
export const parseSentTransferRemote = createEventParser(sentTransferRemoteLog)

const receivedTransferRemoteLog =
  'event ReceivedTransferRemote(uint32 indexed origin, bytes32 indexed recipient, uint256 amount)'
const parseReceivedTransferRemote = createEventParser(receivedTransferRemoteLog)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
export const parseTransfer = createEventParser(transferLog)

const depositForBurnCCTPv1Log =
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)'
const parseDepositForBurnCCTPv1 = createEventParser(depositForBurnCCTPv1Log)
const depositForBurnCCTPv2Log =
  'event DepositForBurn(address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller, uint256 maxFee, uint32 indexed minFinalityThreshold, bytes hookData)'
const parseDepositForBurnCCTPv2 = createEventParser(depositForBurnCCTPv2Log)

const hwrTxEventSignatures = [
  dispatchLog,
  dispatchIdLog,
  processLog,
  processIdLog,
  transferLog,
  depositForBurnCCTPv1Log,
  depositForBurnCCTPv2Log,
]

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

export class HyperlaneHwrPlugin implements InteropPluginResyncable {
  readonly name = 'hyperlane-hwr'

  constructor(
    private configs: InteropConfigStore,
    private oneSidedChains: string[] = [],
  ) {}

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: sentTransferRemoteLog,
        includeTxEvents: hwrTxEventSignatures,
        includeTx: true,
        addresses: '*',
      },
      {
        type: 'event',
        signature: receivedTransferRemoteLog,
        includeTxEvents: hwrTxEventSignatures,
        includeTx: true,
        addresses: '*',
      },
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(HyperlaneConfig) ?? []

    if (input.tx.kind !== 'canonical') {
      return
    }

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

      const $dstChain = findHyperlaneChain(
        networks,
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

      const $srcChain = findHyperlaneChain(
        networks,
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

  matchTypes = [HwrTransferSent, HwrTransferReceived]
  match(
    event: InteropEvent,
    db: InteropEventDb,
    tokenMap: TokenMap,
  ): MatchResult | undefined {
    if (HwrTransferReceived.checkType(event)) {
      const hwrSent = db.find(HwrTransferSent, {
        messageId: event.args.messageId,
      })
      if (!hwrSent) {
        // The CCTP-wrapped send path is only detectable on the source side, so
        // destination-only one-sided receives are best-effort HWR transfers.
        const srcChain = event.args.$srcChain
        if (!srcChain || !this.oneSidedChains.includes(srcChain)) return

        return [
          Result.Transfer('hyperlaneHwr.Transfer', {
            srcChain,
            dstEvent: event,
            dstTokenAddress: event.args.tokenAddress,
            dstAmount: event.args.amount,
            dstWasMinted: event.args.minted,
          }),
        ]
      }

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
        tokenMap,
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

    if (!HwrTransferSent.checkType(event)) return

    const hwrReceived = db.find(HwrTransferReceived, {
      messageId: event.args.messageId,
    })
    if (hwrReceived || event.args.cctp) return

    const dstChain = event.args.$dstChain
    if (!dstChain || !this.oneSidedChains.includes(dstChain)) return

    return [
      Result.Transfer('hyperlaneHwr.Transfer', {
        srcEvent: event,
        srcTokenAddress: event.args.tokenAddress,
        srcAmount: event.args.amount,
        srcWasBurned: event.args.burned,
        dstChain,
      }),
    ]
  }
}

// meson has a different version of this that normalizes amounts (for unknown decimal situations)
// 1. exclude xERC20 lockbox mint+burn pairs (same token, same amount)
// 2. smallest amount delta, then zero-address mint/burn among same-value matches, then log index distance
export function findBestTransferLog(
  logs: LogToCapture['txLogs'],
  targetAmount: bigint,
  startLogIndex: number,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  const transfers: { parsed: ParsedTransferLog; logIndex: number | null }[] = []
  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (!transfer) continue
    transfers.push({
      parsed: {
        logAddress: Address32.from(log.address),
        from: Address32.from(transfer.from),
        to: Address32.from(transfer.to),
        value: transfer.value,
      },
      logIndex: log.logIndex,
    })
  }

  // Exclude mint+burn pairs of the same token and amount (xERC20 lockbox pattern).
  // When a token is minted from 0x0 then immediately burned to 0x0, the pair is
  // intermediary and should not be picked over the real transfer.
  const cancelled = new Set<number>()
  for (let i = 0; i < transfers.length; i++) {
    if (cancelled.has(i)) continue
    const a = transfers[i].parsed
    if (a.from !== Address32.ZERO) continue
    for (let j = i + 1; j < transfers.length; j++) {
      if (cancelled.has(j)) continue
      const b = transfers[j].parsed
      if (
        b.to === Address32.ZERO &&
        b.logAddress === a.logAddress &&
        b.value === a.value
      ) {
        cancelled.add(i)
        cancelled.add(j)
        break
      }
    }
  }

  let closestMatch: ParsedTransferLog | undefined
  let closestDelta: bigint | undefined
  let closestDistance: number | undefined

  for (let i = 0; i < transfers.length; i++) {
    if (cancelled.has(i)) continue
    const { parsed, logIndex } = transfers[i]

    const delta = absDiff(parsed.value, targetAmount)
    const distance =
      logIndex === null
        ? Number.POSITIVE_INFINITY
        : Math.abs(logIndex - startLogIndex)

    if (closestDelta === undefined || delta < closestDelta) {
      closestDelta = delta
      closestDistance = distance
      closestMatch = parsed
      continue
    }

    if (delta > closestDelta) continue

    if (
      closestMatch &&
      parsed.value === closestMatch.value &&
      isMintOrBurnTransfer(parsed) !== isMintOrBurnTransfer(closestMatch)
    ) {
      if (isMintOrBurnTransfer(parsed)) {
        closestDistance = distance
        closestMatch = parsed
      }
      continue
    }

    if (closestDistance === undefined || distance < closestDistance) {
      closestDistance = distance
      closestMatch = parsed
    }
  }

  return { transfer: closestMatch, hasTransfer: transfers.length > 0 }
}

function absDiff(value: bigint, target: bigint): bigint {
  return value >= target ? value - target : target - value
}

function isMintOrBurnTransfer(transfer: ParsedTransferLog): boolean {
  return transfer.from === Address32.ZERO || transfer.to === Address32.ZERO
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
