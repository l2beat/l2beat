/*
CCIP (Chainlink Cross-Chain Interoperability Protocol) plugin.

Supports two contract architectures:
- v1.0–v1.5: Per-lane contracts (separate OnRamp/OffRamp per source-destination pair)
- v1.6+:     Per-chain contracts (single OnRamp/OffRamp per chain, chain selectors in event data)

And two TokenPool event formats:
- v1.5–v1.6.0: Separate Locked/Burned/Released/Minted events
- v1.6.1+:     Unified LockedOrBurned/ReleasedOrMinted events
*/

import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
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
} from '../types'
import { CCIPConfig } from './ccip.config'

// --- Messaging events (v1.0–v1.5, per-lane) ---

const ccipSendRequestedLog =
  'event CCIPSendRequested((uint64 sourceChainSelector, address sender, address receiver, uint64 sequenceNumber, uint256 gasLimit, bool strict, uint64 nonce, address feeToken, uint256 feeTokenAmount, bytes data, (address token, uint256 amount)[] tokenAmounts, bytes[] sourceTokenData, bytes32 messageId) message)'
const parseCCIPSendRequested = createEventParser(ccipSendRequestedLog)

const executionStateChangedLog =
  'event ExecutionStateChanged(uint64 indexed sequenceNumber, bytes32 indexed messageId, uint8 state, bytes returnData)'
const parseExecutionStateChanged = createEventParser(executionStateChangedLog)

// --- Messaging events (v1.6+, per-chain) ---

const ccipMessageSentLog =
  'event CCIPMessageSent(uint64 indexed destChainSelector, uint64 indexed sequenceNumber, ((bytes32 messageId, uint64 sourceChainSelector, uint64 destChainSelector, uint64 sequenceNumber, uint64 nonce) header, address sender, bytes data, bytes receiver, bytes extraArgs, address feeToken, uint256 feeTokenAmount, uint256 feeValueJuels, (address sourcePoolAddress, bytes destTokenAddress, bytes extraData, uint256 amount, bytes destGasAmount)[] tokenAmounts) message)'
const parseCCIPMessageSent = createEventParser(ccipMessageSentLog)

const executionStateChangedV16Log =
  'event ExecutionStateChanged(uint64 indexed sourceChainSelector, uint64 indexed sequenceNumber, bytes32 indexed messageId, bytes32 messageHash, uint8 state, bytes returnData, uint256 gasUsed)'
const parseExecutionStateChangedV16 = createEventParser(
  executionStateChangedV16Log,
)

// --- TokenPool events: source side ---

// v1.5–v1.6.0 (token address inferred from preceding Transfer event)
const lockedLog = 'event Locked(address indexed sender, uint256 amount)'
const parseLockedEvent = createEventParser(lockedLog)

const burnedLog = 'event Burned(address indexed sender, uint256 amount)'
const parseBurnedEvent = createEventParser(burnedLog)

// v1.6.1+ (token address in event data)
const lockedOrBurnedLog =
  'event LockedOrBurned(uint64 indexed remoteChainSelector, address token, address sender, uint256 amount)'
const parseLockedOrBurned = createEventParser(lockedOrBurnedLog)

// --- TokenPool events: destination side ---

// v1.5–v1.6.0 (token address inferred from preceding Transfer event)
const releasedLog =
  'event Released(address indexed sender, address indexed recipient, uint256 amount)'
const parseReleased = createEventParser(releasedLog)

const mintedLog =
  'event Minted(address indexed sender, address indexed recipient, uint256 amount)'
const parseMinted = createEventParser(mintedLog)

// v1.6.1+ (token address in event data)
const releasedOrMintedLog =
  'event ReleasedOrMinted(uint64 indexed remoteChainSelector, address token, address sender, address recipient, uint256 amount)'
const parseReleasedOrMinted = createEventParser(releasedOrMintedLog)

// --- Auxiliary events ---

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const parseTransfer = createEventParser(transferLog)

// Detects when CCIP delegates USDC transfers to Circle's CCTP
const depositForBurnLog =
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)'
const parseDepositForBurn = createEventParser(depositForBurnLog)

// --- Interop event types ---

export const CCIPSendRequested = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  token?: Address32
  amount?: bigint
  index?: number
  wasBurned?: boolean
  isCctpBacked?: boolean
}>('ccip.CCIPSendRequested')

export const ExecutionStateChanged = createInteropEventType<{
  messageId: `0x${string}`
  state: number
  $srcChain: string
  dstTokens?: { address: Address32; amount: bigint; wasMinted: boolean }[]
}>('ccip.ExecutionStateChanged')

// --- Transfer event helpers ---

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

function isBurnAddress(address: string): boolean {
  const normalized = address.toLowerCase()
  return normalized === ZERO_ADDRESS || normalized === DEAD_ADDRESS
}

// Find the closest preceding Transfer event with a matching amount.
// Used to get the token address and determine lock vs burn / release vs mint.
function findPrecedingTransfer(
  logs: LogToCapture['txLogs'],
  currentIndex: number,
  amount: bigint,
): { tokenAddress: string; from: string; to: string } | undefined {
  for (let j = currentIndex - 1; j >= 0; j--) {
    const prevLog = logs[j]
    const transfer = parseTransfer(prevLog, null)
    if (transfer && transfer.value === amount) {
      return {
        tokenAddress: prevLog.address,
        from: transfer.from.toLowerCase(),
        to: transfer.to.toLowerCase(),
      }
    }
  }
  return undefined
}

// Fallback for fee-on-transfer tokens where amounts don't match exactly.
// Finds the closest preceding Transfer for a specific token address.
function findPrecedingTransferForToken(
  logs: LogToCapture['txLogs'],
  currentIndex: number,
  tokenAddress: string,
): { from: string; to: string } | undefined {
  const normalizedToken = tokenAddress.toLowerCase()
  for (let j = currentIndex - 1; j >= 0; j--) {
    const prevLog = logs[j]
    if (prevLog.address.toLowerCase() !== normalizedToken) continue
    const transfer = parseTransfer(prevLog, null)
    if (transfer) {
      return {
        from: transfer.from.toLowerCase(),
        to: transfer.to.toLowerCase(),
      }
    }
  }
  return undefined
}

// --- Plugin ---

const SOURCE_TOKEN_POOL_EVENTS = [
  lockedLog,
  burnedLog,
  lockedOrBurnedLog,
  transferLog,
  depositForBurnLog,
]
const DEST_TOKEN_POOL_EVENTS = [
  releasedOrMintedLog,
  releasedLog,
  mintedLog,
  transferLog,
]

export class CCIPPlugin implements InteropPluginResyncable {
  readonly name = 'ccip'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(CCIPConfig)?.networks ?? []

    const v15SendAddresses: ChainSpecificAddress[] = []
    const v15RecvAddresses: ChainSpecificAddress[] = []
    const v16SendAddresses: ChainSpecificAddress[] = []
    const v16RecvAddresses: ChainSpecificAddress[] = []

    for (const network of networks) {
      try {
        for (const addr of Object.values(network.outboundLanes)) {
          v15SendAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, addr),
          )
        }
        for (const addr of Object.values(network.inboundLanes)) {
          v15RecvAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, addr),
          )
        }
        if (network.onRamp) {
          v16SendAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, network.onRamp),
          )
        }
        if (network.offRamp) {
          v16RecvAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, network.offRamp),
          )
        }
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: ccipSendRequestedLog,
        includeTxEvents: SOURCE_TOKEN_POOL_EVENTS,
        addresses: v15SendAddresses,
      },
      {
        type: 'event',
        signature: executionStateChangedLog,
        includeTxEvents: DEST_TOKEN_POOL_EVENTS,
        addresses: v15RecvAddresses,
      },
      {
        type: 'event',
        signature: ccipMessageSentLog,
        includeTxEvents: SOURCE_TOKEN_POOL_EVENTS,
        addresses: v16SendAddresses,
      },
      {
        type: 'event',
        signature: executionStateChangedV16Log,
        includeTxEvents: DEST_TOKEN_POOL_EVENTS,
        addresses: v16RecvAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const config = this.configs.get(CCIPConfig)
    if (!config) return
    const { networks, chainSelectorToName } = config

    const network = networks.find((x) => x.chain === input.chain)
    if (!network) return

    // --- v1.5 source: CCIPSendRequested from per-lane OnRamp ---
    const sendRequested = parseCCIPSendRequested(input.log, null)
    if (sendRequested) {
      const dstChainEntry = Object.entries(network.outboundLanes).find(
        ([_, address]) => address === EthereumAddress(input.log.address),
      )
      if (!dstChainEntry) return

      return this.captureSend(input, {
        messageId: sendRequested.message.messageId,
        dstChain: dstChainEntry[0],
        tokenAmounts: sendRequested.message.tokenAmounts,
        tokenAddressFromEvent: true,
      })
    }

    // --- v1.5 destination: ExecutionStateChanged from per-lane OffRamp ---
    const execChanged = parseExecutionStateChanged(input.log, null)
    if (execChanged) {
      const srcChainEntry = Object.entries(network.inboundLanes).find(
        ([_, address]) => address === EthereumAddress(input.log.address),
      )
      if (!srcChainEntry) return

      return this.captureExecution(input, {
        messageId: execChanged.messageId,
        state: execChanged.state,
        srcChain: srcChainEntry[0],
        boundaryParser: parseExecutionStateChanged,
      })
    }

    // --- v1.6 source: CCIPMessageSent from per-chain OnRamp ---
    const messageSent = parseCCIPMessageSent(input.log, null)
    if (messageSent) {
      if (
        !network.onRamp ||
        EthereumAddress(input.log.address) !== network.onRamp
      )
        return

      const selector = messageSent.destChainSelector.toString()
      const dstChain = chainSelectorToName[selector] ?? `Unknown_${selector}`

      return this.captureSend(input, {
        messageId: messageSent.message.header.messageId,
        dstChain,
        tokenAmounts: messageSent.message.tokenAmounts,
        // v1.6 tokenAmounts[].sourcePoolAddress is the pool, not the token.
        // Token address must be resolved from TokenPool events instead.
        tokenAddressFromEvent: false,
      })
    }

    // --- v1.6 destination: ExecutionStateChanged from per-chain OffRamp ---
    const execChangedV16 = parseExecutionStateChangedV16(input.log, null)
    if (execChangedV16) {
      if (
        !network.offRamp ||
        EthereumAddress(input.log.address) !== network.offRamp
      )
        return

      const srcSelector = execChangedV16.sourceChainSelector.toString()
      const srcChain =
        chainSelectorToName[srcSelector] ?? `Unknown_${srcSelector}`

      return this.captureExecution(input, {
        messageId: execChangedV16.messageId,
        state: execChangedV16.state,
        srcChain,
        boundaryParser: parseExecutionStateChangedV16,
      })
    }
  }

  // Shared logic for capturing v1.5 CCIPSendRequested and v1.6 CCIPMessageSent.
  // When tokenAddressFromEvent is true (v1.5), token addresses come from the
  // event's tokenAmounts[].token field. When false (v1.6), they are resolved
  // from TokenPool events because tokenAmounts[].sourcePoolAddress is a pool address.
  private captureSend(
    input: LogToCapture,
    opts: {
      messageId: `0x${string}`
      dstChain: string
      tokenAmounts: readonly { token?: string; amount: bigint }[]
      tokenAddressFromEvent: boolean
    },
  ) {
    const srcTokenInfo = this.collectSourceTokenInfo(input)

    if (opts.tokenAmounts.length === 0) {
      return [
        CCIPSendRequested.create(input, {
          messageId: opts.messageId,
          $dstChain: opts.dstChain,
        }),
      ]
    }

    return opts.tokenAmounts.map((ta, index) => {
      // Raw 20-byte address for CCTP comparison (Address32 zero-pads to 32 bytes)
      const rawTokenAddress = opts.tokenAddressFromEvent
        ? ta.token
        : srcTokenInfo[index]?.tokenAddress

      const tokenAddress = rawTokenAddress
        ? Address32.from(rawTokenAddress)
        : undefined

      return CCIPSendRequested.create(input, {
        messageId: opts.messageId,
        token: tokenAddress,
        amount: ta.amount,
        index,
        $dstChain: opts.dstChain,
        wasBurned: srcTokenInfo[index]?.wasBurned,
        isCctpBacked:
          rawTokenAddress &&
          this.isCctpBackedToken(input, rawTokenAddress, ta.amount)
            ? true
            : undefined,
      })
    })
  }

  // Shared logic for capturing v1.5 and v1.6 ExecutionStateChanged.
  // State 2 = SUCCESS. Non-success states return [] to claim the log
  // (preventing other plugins from matching it) without producing events.
  private captureExecution(
    input: LogToCapture,
    opts: {
      messageId: `0x${string}`
      state: number
      srcChain: string
      boundaryParser: (log: LogToCapture['log'], address: null) => unknown
    },
  ) {
    if (opts.state !== 2) return []

    const dstTokens = this.collectDestTokenInfo(input, opts.boundaryParser)

    return [
      ExecutionStateChanged.create(input, {
        messageId: opts.messageId,
        state: opts.state,
        $srcChain: opts.srcChain,
        dstTokens: dstTokens.length > 0 ? dstTokens : undefined,
      }),
    ]
  }

  // Check if a token transfer was delegated to CCTP (e.g. USDC).
  // Looks for a DepositForBurn event before the CCIP send event
  // matching both token address and amount.
  private isCctpBackedToken(
    input: LogToCapture,
    tokenAddress: string,
    amount: bigint,
  ): boolean {
    const logsBeforeSend = input.txLogs.filter(
      (log) => (log.logIndex ?? 0) < (input.log.logIndex ?? 0),
    )
    for (const log of logsBeforeSend) {
      const depositForBurn = parseDepositForBurn(log, null)
      if (
        depositForBurn &&
        depositForBurn.burnToken.toLowerCase() === tokenAddress.toLowerCase() &&
        depositForBurn.amount === amount
      ) {
        return true
      }
    }
    return false
  }

  // Collect source-side token info from TokenPool events before the send event.
  // Handles both v1.5 (Locked/Burned) and v1.6.1+ (LockedOrBurned) formats.
  // Events appear in the same order as tokenAmounts[] in the message.
  private collectSourceTokenInfo(
    input: LogToCapture,
  ): { wasBurned: boolean; tokenAddress?: string }[] {
    const result: { wasBurned: boolean; tokenAddress?: string }[] = []
    const logsBeforeSend = input.txLogs.filter(
      (log) => (log.logIndex ?? 0) < (input.log.logIndex ?? 0),
    )

    const processedTokens = new Set<string>()

    for (let i = 0; i < logsBeforeSend.length; i++) {
      const log = logsBeforeSend[i]

      // v1.5 Locked (lock & mint pattern — wasBurned = false)
      const locked = parseLockedEvent(log, null)
      if (locked) {
        const transfer = findPrecedingTransfer(logsBeforeSend, i, locked.amount)
        if (
          transfer &&
          !processedTokens.has(transfer.tokenAddress.toLowerCase())
        ) {
          processedTokens.add(transfer.tokenAddress.toLowerCase())
          result.push({
            wasBurned: false,
            tokenAddress: transfer.tokenAddress,
          })
        }
        continue
      }

      // v1.5 Burned (burn & mint pattern — wasBurned = true)
      const burned = parseBurnedEvent(log, null)
      if (burned) {
        const transfer = findPrecedingTransfer(logsBeforeSend, i, burned.amount)
        if (
          transfer &&
          !processedTokens.has(transfer.tokenAddress.toLowerCase())
        ) {
          processedTokens.add(transfer.tokenAddress.toLowerCase())
          result.push({ wasBurned: true, tokenAddress: transfer.tokenAddress })
        }
        continue
      }

      // v1.6.1+ LockedOrBurned (lock vs burn determined from preceding Transfer)
      const lockedOrBurned = parseLockedOrBurned(log, null)
      if (lockedOrBurned) {
        const tokenAddr = lockedOrBurned.token.toLowerCase()
        if (processedTokens.has(tokenAddr)) continue
        processedTokens.add(tokenAddr)

        let wasBurned = false
        const transfer = findPrecedingTransfer(
          logsBeforeSend,
          i,
          lockedOrBurned.amount,
        )
        if (transfer) {
          wasBurned = isBurnAddress(transfer.to)
        } else {
          // Fee-on-transfer fallback: match by token address instead of amount
          const anyTransfer = findPrecedingTransferForToken(
            logsBeforeSend,
            i,
            tokenAddr,
          )
          if (anyTransfer) {
            wasBurned = isBurnAddress(anyTransfer.to)
          }
        }
        result.push({ wasBurned, tokenAddress: lockedOrBurned.token })
      }
    }

    return result
  }

  // Collect destination-side token info from TokenPool events before this
  // ExecutionStateChanged. In batched deliveries (multiple messages in one tx),
  // only scans logs between the previous ExecutionStateChanged and this one
  // to avoid picking up token events from other messages.
  private collectDestTokenInfo(
    input: LogToCapture,
    boundaryParser: (log: LogToCapture['log'], address: null) => unknown,
  ): { address: Address32; amount: bigint; wasMinted: boolean }[] {
    const result: { address: Address32; amount: bigint; wasMinted: boolean }[] =
      []
    const currentLogIndex = input.log.logIndex ?? 0

    // Find the log index of the previous ExecutionStateChanged in this tx
    const prevBoundaryLogIndex = input.txLogs
      .filter(
        (log) =>
          (log.logIndex ?? 0) < currentLogIndex &&
          boundaryParser(log, null) !== undefined,
      )
      .reduce((max, log) => Math.max(max, log.logIndex ?? 0), -1)

    const logsBetween = input.txLogs.filter(
      (log) =>
        (log.logIndex ?? 0) > prevBoundaryLogIndex &&
        (log.logIndex ?? 0) < currentLogIndex,
    )

    for (let i = 0; i < logsBetween.length; i++) {
      const log = logsBetween[i]

      // v1.6.1+ ReleasedOrMinted
      const releasedOrMinted = parseReleasedOrMinted(log, null)
      if (releasedOrMinted) {
        let wasMinted = false
        const transfer = findPrecedingTransfer(
          logsBetween,
          i,
          releasedOrMinted.amount,
        )
        if (transfer) {
          wasMinted = transfer.from === ZERO_ADDRESS
        }
        result.push({
          address: Address32.from(releasedOrMinted.token),
          amount: releasedOrMinted.amount,
          wasMinted,
        })
        continue
      }

      // v1.5 Released (release from pool — wasMinted = false)
      const released = parseReleased(log, null)
      if (released) {
        const transfer = findPrecedingTransfer(logsBetween, i, released.amount)
        if (transfer) {
          result.push({
            address: Address32.from(transfer.tokenAddress),
            amount: released.amount,
            wasMinted: false,
          })
        }
        continue
      }

      // v1.5 Minted (mint new tokens — wasMinted = true)
      const minted = parseMinted(log, null)
      if (minted) {
        const transfer = findPrecedingTransfer(logsBetween, i, minted.amount)
        if (transfer) {
          result.push({
            address: Address32.from(transfer.tokenAddress),
            amount: minted.amount,
            wasMinted: true,
          })
        }
      }
    }

    return result
  }

  matchTypes = [ExecutionStateChanged]

  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!ExecutionStateChanged.checkType(delivery)) return

    const sendRequests = db.findAll(CCIPSendRequested, {
      messageId: delivery.args.messageId,
    })
    if (sendRequests.length === 0) return

    const result: MatchResult = []
    const dstTokens = delivery.args.dstTokens ?? []

    // Match transfers by index — tokenAmounts[] and TokenPool events
    // are emitted in the same order on both source and destination
    for (let i = 0; i < dstTokens.length; i++) {
      const dstToken = dstTokens[i]
      const matched = sendRequests.find((req) => req.args.index === i)
      if (!matched) continue
      // CCTP-backed tokens (e.g. USDC) are handled by the CCTP plugin
      if (matched.args.isCctpBacked) continue
      result.push(
        Result.Transfer('ccip.Transfer', {
          srcEvent: matched,
          dstEvent: delivery,
          srcTokenAddress: matched.args.token,
          srcAmount: matched.args.amount,
          srcWasBurned: matched.args.wasBurned,
          dstTokenAddress: dstToken.address,
          dstAmount: dstToken.amount,
          dstWasMinted: dstToken.wasMinted,
        }),
      )
    }

    const hasTokenTransfer = sendRequests.some(
      (req) => req.args.token !== undefined,
    )
    result.push(
      Result.Message('ccip.Message', {
        app: hasTokenTransfer ? 'CCIP Token Transfer' : 'unknown',
        srcEvent: sendRequests[0],
        dstEvent: delivery,
      }),
    )
    return result
  }
}
