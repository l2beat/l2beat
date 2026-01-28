/*
CCIP is a messaging and token transfer protocol. This plugin matches messages. Further
research is required regarding message delivery - in this version only message execution is matched.
The dst chain on SRC must be determined by the contract address that emitted the event as separate
contracts are set up for every SRC-DST pair on each chain
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
 event CCIPSendRequested(Internal.EVM2EVMMessage message);

   /// @notice The cross chain message that gets committed to EVM chains.
  /// @dev RMN depends on this struct, if changing, please notify the RMN maintainers.
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

export const CCIPSendRequested = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  token: Address32
  amount: bigint
  index: number // Position in tokenAmounts array for matching
  wasBurned?: boolean // Whether the source token was burned (vs locked)
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
    const networks = this.configs.get(CCIPConfig) ?? []

    const outboundAddresses: ChainSpecificAddress[] = []
    const inboundAddresses: ChainSpecificAddress[] = []

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
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: CCIPSendRequestedLog,
        includeTxEvents: [lockedLog, burnedLog, lockedOrBurnedLog, transferLog],
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
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(CCIPConfig)
    if (!networks) return

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

      return ccipSendRequested.message.tokenAmounts.map((ta, index) =>
        CCIPSendRequested.create(input, {
          messageId: ccipSendRequested.message.messageId,
          token: Address32.from(ta.token),
          amount: ta.amount,
          index,
          $dstChain: dstChainEntry[0],
          wasBurned: srcTokenInfo[index]?.wasBurned,
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

      // Collect token release/mint events from TokenPools in the same transaction
      const dstTokens = this.collectDestTokenInfo(input)

      return [
        ExecutionStateChanged.create(input, {
          messageId: executionStateChanged.messageId,
          state: executionStateChanged.state,
          $srcChain: srcChainEntry[0],
          dstTokens: dstTokens.length > 0 ? dstTokens : undefined,
        }),
      ]
    }
  }

  /**
   * Collect source-side token info (wasBurned) from TokenPool events.
   * Detects Locked/Burned (v1.5) and LockedOrBurned (v1.6.1+) events.
   * Events are emitted in the same order as tokenAmounts[] in the message.
   */
  private collectSourceTokenInfo(
    input: LogToCapture,
  ): { wasBurned: boolean }[] {
    const result: { wasBurned: boolean }[] = []
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
          result.push({ wasBurned: false })
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
          result.push({ wasBurned: true })
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
        result.push({ wasBurned })
      }
    }

    return result
  }

  /**
   * Collect destination-side token info (wasMinted) from TokenPool events.
   * Detects Released/Minted (v1.5) and ReleasedOrMinted (v1.6.1+) events.
   */
  private collectDestTokenInfo(
    input: LogToCapture,
  ): { address: Address32; amount: bigint; wasMinted: boolean }[] {
    const result: { address: Address32; amount: bigint; wasMinted: boolean }[] =
      []
    const logsBeforeExecution = input.txLogs.filter(
      (log) => (log.logIndex ?? 0) < (input.log.logIndex ?? 0),
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
      if (delivery.args.state !== 2) {
        // Only match successful executions
        return [Result.Ignore([delivery])]
      }

      const result: MatchResult = []
      const dstTokens = delivery.args.dstTokens ?? []

      // Match by index position - tokenAmounts[] and ReleasedOrMinted events
      // are emitted in the same order
      for (let i = 0; i < dstTokens.length; i++) {
        const dstToken = dstTokens[i]
        const matched = ccipSendRequests.find((req) => req.args.index === i)
        if (matched) {
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

      result.push(
        Result.Message('ccip.Message', {
          app: 'CCIP Token Transfer',
          srcEvent: ccipSendRequests[0],
          dstEvent: delivery,
        }),
      )
      return result
    }
  }
}
