/*
CCIP is a messaging and token transfer protocol. This plugin handles:
  - v1.0-v1.5: per-lane contracts (separate EVM2EVMOnRamp/EVM2EVMOffRamp for every SRC-DST pair)
  - v1.6.0+:   per-chain contracts with chain selectors in event data
    - Outbound: CCIPMessageSent(uint64 destChainSelector, uint64 sequenceNumber, message)
    - Inbound:  ExecutionStateChanged(uint64 sourceChainSelector, uint64 sequenceNumber, bytes32 messageId, ...)
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

/*
 CCIP v1.0-v1.5 events (per-lane EVM2EVMOnRamp/EVM2EVMOffRamp):

 event CCIPSendRequested(Internal.EVM2EVMMessage message);

  struct EVM2EVMMessage {
    uint64 sourceChainSelector; // ────────╮ the chain selector of the source chain, note: not chainId
    address sender; // ────────────────────╯ sender address on the source chain
    address receiver; // ──────────────────╮ receiver address on the destination chain
    uint64 sequenceNumber; // ─────────────╯ sequence number, not unique across lanes
    uint256 gasLimit; //                     user supplied maximum gas amount available for dest chain execution
    bool strict; // ───────────────────────╮ DEPRECATED
    uint64 nonce; //                       │ nonce for this lane for this sender, not unique across senders/lanes
    address feeToken; // ──────────────────╯ fee token
    uint256 feeTokenAmount; //               fee token amount
    bytes data; //                           arbitrary data payload supplied by the message sender
    Client.EVMTokenAmount[] tokenAmounts; // array of tokens and amounts to transfer
    bytes[] sourceTokenData; //              array of token data, one per token
    bytes32 messageId; //                    a hash of the message data
  }

    struct EVMTokenAmount {
    address token; // token address on the local chain.
    uint256 amount; // Amount of tokens.
  }

    enum MessageExecutionState {
    UNTOUCHED,
    IN_PROGRESS,
    SUCCESS,
    FAILURE
  }
  event ExecutionStateChanged(uint64 indexed sequenceNumber, bytes32 indexed messageId, Internal.MessageExecutionState state, bytes returnData);
*/

const CCIPSendRequestedLog =
  'event CCIPSendRequested((uint64 sourceChainSelector, address sender, address receiver, uint64 sequenceNumber, uint256 gasLimit, bool strict, uint64 nonce, address feeToken, uint256 feeTokenAmount, bytes data, (address token, uint256 amount)[] tokenAmounts, bytes[] sourceTokenData, bytes32 messageId) message)'
const parseCCIPSendRequested = createEventParser(CCIPSendRequestedLog)

const executionStateChangedLog =
  'event ExecutionStateChanged(uint64 indexed sequenceNumber, bytes32 indexed messageId, uint8 state, bytes returnData)'
const parseExecutionStateChanged = createEventParser(executionStateChangedLog)

// CCIP v1.6+ event signatures (per-chain contracts)
const CCIPMessageSentLog =
  'event CCIPMessageSent(uint64 indexed destChainSelector, uint64 indexed sequenceNumber, ((bytes32 messageId, uint64 sourceChainSelector, uint64 destChainSelector, uint64 sequenceNumber, uint64 nonce) header, address sender, bytes data, bytes receiver, bytes extraArgs, address feeToken, uint256 feeTokenAmount, uint256 feeValueJuels, (address sourcePoolAddress, bytes destTokenAddress, bytes extraData, uint256 amount, bytes destGasAmount)[] tokenAmounts) message)'
const parseCCIPMessageSent = createEventParser(CCIPMessageSentLog)

const executionStateChangedV16Log =
  'event ExecutionStateChanged(uint64 indexed sourceChainSelector, uint64 indexed sequenceNumber, bytes32 indexed messageId, bytes32 messageHash, uint8 state, bytes returnData, uint256 gasUsed)'
const parseExecutionStateChangedV16 = createEventParser(
  executionStateChangedV16Log,
)

/*
TokenPool events emitted when tokens are locked/burned on source chain
and released/minted on destination chain.

CCIP v1.6.1+ (unified events):
  Source: LockedOrBurned(uint64 indexed remoteChainSelector, address token, address sender, uint256 amount)
  Dest:   ReleasedOrMinted(uint64 indexed remoteChainSelector, address token, address sender, address recipient, uint256 amount)
  - Token address is included in event data
  - To determine lock vs burn / release vs mint, check the preceding Transfer event:
    - Transfer to 0x0 = burn, Transfer from 0x0 = mint

CCIP v1.5.x - v1.6.0 (separate events):
  Source: Locked(address indexed sender, uint256 amount) / Burned(address indexed sender, uint256 amount)
  Dest:   Released(address indexed sender, address indexed recipient, uint256 amount) / Minted(...)
  - Token address must be extracted from the preceding Transfer event
  - Event order: Transfer -> Locked/Burned/Released/Minted
*/

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dead'

// Check if an address is a burn destination (0x0 or 0xdead)
function isBurnAddress(address: string): boolean {
  const normalized = address.toLowerCase()
  return normalized === ZERO_ADDRESS || normalized === DEAD_ADDRESS
}

// Source-side TokenPool events (v1.5.x - v1.6.0)
const lockedLog = 'event Locked(address indexed sender, uint256 amount)'
const parseLockedEvent = createEventParser(lockedLog)

const burnedLog = 'event Burned(address indexed sender, uint256 amount)'
const parseBurnedEvent = createEventParser(burnedLog)

// Source-side unified event (v1.6.1+)
const lockedOrBurnedLog =
  'event LockedOrBurned(uint64 indexed remoteChainSelector, address token, address sender, uint256 amount)'
const parseLockedOrBurned = createEventParser(lockedOrBurnedLog)

// Destination-side TokenPool events (v1.5.x - v1.6.0)
const releasedLog =
  'event Released(address indexed sender, address indexed recipient, uint256 amount)'
const parseReleased = createEventParser(releasedLog)

const mintedLog =
  'event Minted(address indexed sender, address indexed recipient, uint256 amount)'
const parseMinted = createEventParser(mintedLog)

// Destination-side unified event (v1.6.1+)
const releasedOrMintedLog =
  'event ReleasedOrMinted(uint64 indexed remoteChainSelector, address token, address sender, address recipient, uint256 amount)'
const parseReleasedOrMinted = createEventParser(releasedOrMintedLog)

// Standard ERC20 Transfer event
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const parseTransfer = createEventParser(transferLog)

// CCTP DepositForBurn - used to detect when CCIP delegates to CCTP for USDC transfers
const depositForBurnLog =
  'event DepositForBurn(uint64 indexed nonce, address indexed burnToken, uint256 amount, address indexed depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)'
const parseDepositForBurn = createEventParser(depositForBurnLog)

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
  // Token data from ReleasedOrMinted events (one per token in the message)
  dstTokens?: { address: Address32; amount: bigint; wasMinted: boolean }[]
}>('ccip.ExecutionStateChanged')

/**
 * Find the Transfer event immediately preceding a TokenPool event with matching amount.
 * Returns the Transfer event details including token address and from/to addresses.
 */
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

/**
 * Find Transfer event for a specific token address (for fee-on-transfer tokens
 * where amounts don't match exactly).
 */
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

export class CCIPPlugin implements InteropPluginResyncable {
  readonly name = 'ccip'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(CCIPConfig)?.networks ?? []

    const outboundAddresses: ChainSpecificAddress[] = []
    const inboundAddresses: ChainSpecificAddress[] = []
    const v16OutboundAddresses: ChainSpecificAddress[] = []
    const v16InboundAddresses: ChainSpecificAddress[] = []

    for (const network of networks) {
      try {
        for (const addr of Object.values(network.outboundLanes)) {
          outboundAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, addr),
          )
        }
        for (const addr of Object.values(network.inboundLanes)) {
          inboundAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, addr),
          )
        }
        if (network.onRamp) {
          v16OutboundAddresses.push(
            ChainSpecificAddress.fromLong(network.chain, network.onRamp),
          )
        }
        if (network.offRamp) {
          v16InboundAddresses.push(
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
        signature: CCIPSendRequestedLog,
        includeTxEvents: [
          lockedLog,
          burnedLog,
          lockedOrBurnedLog,
          transferLog,
          depositForBurnLog,
        ],
        addresses: outboundAddresses,
      },
      {
        type: 'event',
        signature: executionStateChangedLog,
        includeTxEvents: [
          releasedOrMintedLog,
          releasedLog,
          mintedLog,
          transferLog,
        ],
        addresses: inboundAddresses,
      },
      {
        type: 'event',
        signature: CCIPMessageSentLog,
        includeTxEvents: [
          lockedLog,
          burnedLog,
          lockedOrBurnedLog,
          transferLog,
          depositForBurnLog,
        ],
        addresses: v16OutboundAddresses,
      },
      {
        type: 'event',
        signature: executionStateChangedV16Log,
        includeTxEvents: [
          releasedOrMintedLog,
          releasedLog,
          mintedLog,
          transferLog,
        ],
        addresses: v16InboundAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const config = this.configs.get(CCIPConfig)
    if (!config) return
    const { networks, selectorNames } = config

    const network = networks.find((x) => x.chain === input.chain)
    if (!network) return

    const ccipSendRequested = parseCCIPSendRequested(input.log, null)
    if (ccipSendRequested) {
      const outboundLane = EthereumAddress(input.log.address)
      // Check if this event is from one of our outbound lanes
      const dstChainEntry = Object.entries(network.outboundLanes).find(
        ([_, address]) => address === outboundLane,
      )
      if (!dstChainEntry) return

      // Collect source-side lock/burn info from TokenPool events
      // Events are emitted in same order as tokenAmounts[]
      const srcTokenInfo = this.collectSourceTokenInfo(input)

      if (ccipSendRequested.message.tokenAmounts.length === 0) {
        return [
          CCIPSendRequested.create(input, {
            messageId: ccipSendRequested.message.messageId,
            $dstChain: dstChainEntry[0],
          }),
        ]
      }

      return ccipSendRequested.message.tokenAmounts.map((ta, index) =>
        CCIPSendRequested.create(input, {
          messageId: ccipSendRequested.message.messageId,
          token: Address32.from(ta.token),
          amount: ta.amount,
          index,
          $dstChain: dstChainEntry[0],
          wasBurned: srcTokenInfo[index]?.wasBurned,
          isCctpBacked:
            this.isCctpBackedToken(input, ta.token, ta.amount) || undefined,
        }),
      )
    }

    const executionStateChanged = parseExecutionStateChanged(input.log, null)
    if (executionStateChanged) {
      const inboundLane = EthereumAddress(input.log.address)
      // Check if this event is from one of our inbound lanes
      const srcChainEntry = Object.entries(network.inboundLanes).find(
        ([_, address]) => address === inboundLane,
      )
      if (!srcChainEntry) return

      // state 2 = SUCCESS — only capture successful executions.
      // Return [] to claim the log (prevent other plugins from capturing it) but produce no events.
      if (executionStateChanged.state !== 2) return []

      // Collect token release/mint events from TokenPools in the same transaction
      const dstTokens = this.collectDestTokenInfo(
        input,
        parseExecutionStateChanged,
      )

      return [
        ExecutionStateChanged.create(input, {
          messageId: executionStateChanged.messageId,
          state: executionStateChanged.state,
          $srcChain: srcChainEntry[0],
          dstTokens: dstTokens.length > 0 ? dstTokens : undefined,
        }),
      ]
    }

    // --- CCIP v1.6+ per-chain contracts ---

    const ccipMessageSent = parseCCIPMessageSent(input.log, null)
    if (ccipMessageSent) {
      // Verify the log comes from the v1.6 per-chain OnRamp
      if (
        !network.onRamp ||
        EthereumAddress(input.log.address) !== network.onRamp
      )
        return

      const selector = ccipMessageSent.destChainSelector.toString()
      const dstChain =
        selectorNames[selector] ?? `Unknown_${selector}`

      const srcTokenInfo = this.collectSourceTokenInfo(input)

      if (ccipMessageSent.message.tokenAmounts.length === 0) {
        return [
          CCIPSendRequested.create(input, {
            messageId: ccipMessageSent.message.header.messageId,
            $dstChain: dstChain,
          }),
        ]
      }

      return ccipMessageSent.message.tokenAmounts.map((ta, index) => {
        // v1.6 tokenAmounts[].sourcePoolAddress is the pool, not the token.
        // Get the actual token address from the source-side TokenPool events.
        const tokenAddress = srcTokenInfo[index]?.tokenAddress
          ? Address32.from(srcTokenInfo[index].tokenAddress)
          : undefined

        return CCIPSendRequested.create(input, {
          messageId: ccipMessageSent.message.header.messageId,
          token: tokenAddress,
          amount: ta.amount,
          index,
          $dstChain: dstChain,
          wasBurned: srcTokenInfo[index]?.wasBurned,
          isCctpBacked: tokenAddress
            ? this.isCctpBackedToken(
                input,
                tokenAddress.toString(),
                ta.amount,
              ) || undefined
            : undefined,
        })
      })
    }

    const executionStateChangedV16 = parseExecutionStateChangedV16(
      input.log,
      null,
    )
    if (executionStateChangedV16) {
      // Verify the log comes from the v1.6 per-chain OffRamp
      if (
        !network.offRamp ||
        EthereumAddress(input.log.address) !== network.offRamp
      )
        return

      const srcSelector =
        executionStateChangedV16.sourceChainSelector.toString()
      const srcChain =
        selectorNames[srcSelector] ?? `Unknown_${srcSelector}`

      // state 2 = SUCCESS — only capture successful executions.
      if (executionStateChangedV16.state !== 2) return []

      const dstTokens = this.collectDestTokenInfo(
        input,
        parseExecutionStateChangedV16,
      )

      return [
        ExecutionStateChanged.create(input, {
          messageId: executionStateChangedV16.messageId,
          state: executionStateChangedV16.state,
          $srcChain: srcChain,
          dstTokens: dstTokens.length > 0 ? dstTokens : undefined,
        }),
      ]
    }
  }

  /**
   * Detect tokens that are transferred via CCTP (e.g., USDC).
   * When CCIP delegates to CCTP, a DepositForBurn event is emitted in the same tx
   * between the CCIP token pool events and CCIPSendRequested.
   * Only matches DepositForBurn events that appear before our main event
   * and match both token address and amount from tokenAmounts.
   */
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

  /**
   * Collect source-side token info (wasBurned) from TokenPool events.
   * Detects Locked/Burned (v1.5) and LockedOrBurned (v1.6.1+) events.
   * Events are emitted in the same order as tokenAmounts[] in the message.
   */
  private collectSourceTokenInfo(
    input: LogToCapture,
  ): { wasBurned: boolean; tokenAddress?: string }[] {
    const result: { wasBurned: boolean; tokenAddress?: string }[] = []
    const logsBeforeSend = input.txLogs.filter(
      (log) => (log.logIndex ?? 0) < (input.log.logIndex ?? 0),
    )

    // Track which tokens we've processed
    const processedTokens = new Set<string>()

    for (let i = 0; i < logsBeforeSend.length; i++) {
      const log = logsBeforeSend[i]

      // Try v1.5 Locked event (wasBurned = false)
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

      // Try v1.5 Burned event (wasBurned = true)
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

      // Try v1.6.1+ LockedOrBurned event
      const lockedOrBurned = parseLockedOrBurned(log, null)
      if (lockedOrBurned) {
        const tokenAddr = lockedOrBurned.token.toLowerCase()
        if (processedTokens.has(tokenAddr)) continue
        processedTokens.add(tokenAddr)

        // Check if burned by looking at preceding Transfer
        let wasBurned = false
        const transfer = findPrecedingTransfer(
          logsBeforeSend,
          i,
          lockedOrBurned.amount,
        )
        if (transfer) {
          wasBurned = isBurnAddress(transfer.to)
        } else {
          // Fee-on-transfer: check any preceding Transfer for this token
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

  /**
   * Collect destination-side token info (wasMinted) from TokenPool events.
   * Detects Released/Minted (v1.5) and ReleasedOrMinted (v1.6.1+) events.
   * @param boundaryParser - parser for ExecutionStateChanged events to detect
   *   batch boundaries (v1.5 vs v1.6 have different event signatures)
   */
  private collectDestTokenInfo(
    input: LogToCapture,
    boundaryParser: (log: LogToCapture['log'], address: null) => unknown,
  ): { address: Address32; amount: bigint; wasMinted: boolean }[] {
    const result: { address: Address32; amount: bigint; wasMinted: boolean }[] =
      []
    const currentLogIndex = input.log.logIndex ?? 0

    // In batched deliveries, multiple ExecutionStateChanged events share one tx.
    // Only scan logs between the previous ExecutionStateChanged and this one
    // to avoid picking up token events from other messages in the batch.
    const prevExecutionLogIndex = input.txLogs
      .filter(
        (log) =>
          (log.logIndex ?? 0) < currentLogIndex &&
          boundaryParser(log, null) !== undefined,
      )
      .reduce((max, log) => Math.max(max, log.logIndex ?? 0), -1)

    const logsBeforeExecution = input.txLogs.filter(
      (log) =>
        (log.logIndex ?? 0) > prevExecutionLogIndex &&
        (log.logIndex ?? 0) < currentLogIndex,
    )

    for (let i = 0; i < logsBeforeExecution.length; i++) {
      const log = logsBeforeExecution[i]

      // Try v1.6+ ReleasedOrMinted event
      const releasedOrMinted = parseReleasedOrMinted(log, null)
      if (releasedOrMinted) {
        // Check if minted by looking at preceding Transfer
        let wasMinted = false
        const transfer = findPrecedingTransfer(
          logsBeforeExecution,
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

      // Try v1.5 Released event (wasMinted = false)
      const released = parseReleased(log, null)
      if (released) {
        const transfer = findPrecedingTransfer(
          logsBeforeExecution,
          i,
          released.amount,
        )
        if (transfer) {
          result.push({
            address: Address32.from(transfer.tokenAddress),
            amount: released.amount,
            wasMinted: false,
          })
        }
        continue
      }

      // Try v1.5 Minted event (wasMinted = true)
      const minted = parseMinted(log, null)
      if (minted) {
        const transfer = findPrecedingTransfer(
          logsBeforeExecution,
          i,
          minted.amount,
        )
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
    if (ExecutionStateChanged.checkType(delivery)) {
      const ccipSendRequests = db.findAll(CCIPSendRequested, {
        messageId: delivery.args.messageId,
      })

      if (ccipSendRequests.length === 0) return

      const result: MatchResult = []
      const dstTokens = delivery.args.dstTokens ?? []

      // Match by index position - tokenAmounts[] and ReleasedOrMinted events
      // are emitted in the same order
      for (let i = 0; i < dstTokens.length; i++) {
        const dstToken = dstTokens[i]
        const matched = ccipSendRequests.find((req) => req.args.index === i)
        if (matched) {
          // Skip transfer if token is CCTP-backed (handled by CCTP plugin)
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
      }

      const hasTokenTransfer = ccipSendRequests.some(
        (req) => req.args.token !== undefined,
      )
      result.push(
        Result.Message('ccip.Message', {
          app: hasTokenTransfer ? 'CCIP Token Transfer' : 'unknown',
          srcEvent: ccipSendRequests[0],
          dstEvent: delivery,
        }),
      )
      return result
    }
  }
}
