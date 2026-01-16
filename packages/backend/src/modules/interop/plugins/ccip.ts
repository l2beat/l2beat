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
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

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
TokenPool events emitted when tokens are released or minted on destination chain.
These are more reliable than Transfer events as they're CCIP-specific and avoid
capturing internal mint operations (e.g., USDC burn/mint pattern).

CCIP v1.6.1+ (ReleasedOrMinted - unified event):
  https://docs.chain.link/ccip/api-reference/evm/v1.6.1/token-pool#releasedorminted
  event ReleasedOrMinted(uint64 indexed remoteChainSelector, address token, address sender, address recipient, uint256 amount)
  - Token address is included in event data
  - `sender` is the offRamp address (msg.sender calling the pool)

CCIP v1.5.x - v1.6.0 (Released/Minted - separate events):
  https://docs.chain.link/ccip/api-reference/evm/v1.6.0/token-pool#minted
  https://docs.chain.link/ccip/api-reference/evm/v1.5.1/token-pool
  event Released(address indexed sender, address indexed recipient, uint256 amount)
  event Minted(address indexed sender, address indexed recipient, uint256 amount)
  - Token address must be extracted from the preceding Transfer event
  - Event order: Transfer -> Released/Minted -> ExecutionStateChanged
  - `sender` is the offRamp address
*/

// v1.6.1+ TokenPool event (has token address in event data)
const releasedOrMintedLog =
  'event ReleasedOrMinted(uint64 indexed remoteChainSelector, address token, address sender, address recipient, uint256 amount)'
const parseReleasedOrMinted = createEventParser(releasedOrMintedLog)

// v1.5.x - v1.6.0 TokenPool events (token address from preceding Transfer event)
const releasedLog =
  'event Released(address indexed sender, address indexed recipient, uint256 amount)'
const parseReleased = createEventParser(releasedLog)

const mintedLog =
  'event Minted(address indexed sender, address indexed recipient, uint256 amount)'
const parseMinted = createEventParser(mintedLog)

// Standard ERC20 Transfer event to extract token address for v1.5 events
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const parseTransfer = createEventParser(transferLog)

export const CCIPSendRequested = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  token: Address32
  amount: bigint
  index: number // Position in tokenAmounts array for matching
}>('ccip.CCIPSendRequested')

export const ExecutionStateChanged = createInteropEventType<{
  messageId: `0x${string}`
  state: number
  $srcChain: string
  // Token data from ReleasedOrMinted events (one per token in the message)
  dstTokens?: { address: Address32; amount: bigint }[]
}>('ccip.ExecutionStateChanged')

interface CcipNetwork {
  chain: string
  outboundLanes: Record<string, ChainSpecificAddress>
  inboundLanes: Record<string, ChainSpecificAddress>
}

// Future reference: https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
const CCIP_NETWORKS = defineNetworks<CcipNetwork>('ccip', [
  {
    chain: 'base',
    outboundLanes: {
      arbitrum: ChainSpecificAddress(
        'base:0x9D0ffA76C7F82C34Be313b5bFc6d42A72dA8CA69',
      ),
      ethereum: ChainSpecificAddress(
        'base:0x56b30A0Dcd8dc87Ec08b80FA09502bAB801fa78e',
      ),
    },
    inboundLanes: {
      arbitrum: ChainSpecificAddress(
        'base:0x7D38c6363d5E4DFD500a691Bc34878b383F58d93',
      ),
      ethereum: ChainSpecificAddress(
        'base:0xCA04169671A81E4fB8768cfaD46c347ae65371F1',
      ),
    },
  },
  {
    chain: 'arbitrum',
    outboundLanes: {
      base: ChainSpecificAddress(
        'arb1:0xc1b6287A3292d6469F2D8545877E40A2f75CA9a6',
      ),
      ethereum: ChainSpecificAddress(
        'arb1:0x67761742ac8A21Ec4D76CA18cbd701e5A6F3Bef3',
      ),
    },
    inboundLanes: {
      base: ChainSpecificAddress(
        'arb1:0xb62178f8198905D0Fa6d640Bdb188E4E8143Ac4b',
      ),
      ethereum: ChainSpecificAddress(
        'arb1:0x91e46cc5590A4B9182e47f40006140A7077Dec31',
      ),
    },
  },
  {
    chain: 'ethereum',
    outboundLanes: {
      arbitrum: ChainSpecificAddress(
        'eth:0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284',
      ),
      base: ChainSpecificAddress(
        'eth:0xb8a882f3B88bd52D1Ff56A873bfDB84b70431937',
      ),
    },
    inboundLanes: {
      arbitrum: ChainSpecificAddress(
        'eth:0xdf615eF8D4C64d0ED8Fd7824BBEd2f6a10245aC9',
      ),
      base: ChainSpecificAddress(
        'eth:0x6B4B6359Dd5B47Cdb030E5921456D2a0625a9EbD',
      ),
    },
  },
])

/**
 * Find the token address from the Transfer event immediately preceding a Released/Minted event.
 * In v1.5 TokenPools, the event order is: Transfer -> Released/Minted
 */
function findPrecedingTransferToken(
  logs: LogToCapture['txLogs'],
  currentIndex: number,
  amount: bigint,
): string | undefined {
  // Look backwards from the current log to find a matching Transfer event
  for (let j = currentIndex - 1; j >= 0; j--) {
    const prevLog = logs[j]
    const transfer = parseTransfer(prevLog, null)
    if (transfer && transfer.value === amount) {
      // The token address is the contract that emitted the Transfer event
      return prevLog.address
    }
  }
  return undefined
}

export class CCIPPlugIn implements InteropPluginResyncable {
  readonly name = 'ccip'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: CCIPSendRequestedLog,
        addresses: CCIP_NETWORKS.flatMap((n) => Object.values(n.outboundLanes)),
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
        addresses: CCIP_NETWORKS.flatMap((n) => Object.values(n.inboundLanes)),
      },
    ]
  }

  capture(input: LogToCapture) {
    const network = CCIP_NETWORKS.find((x) => x.chain === input.chain)
    if (!network) return

    const ccipSendRequested = parseCCIPSendRequested(input.log, null)
    if (ccipSendRequested) {
      const outboundLane = EthereumAddress(input.log.address)
      return ccipSendRequested.message.tokenAmounts.map((ta, index) =>
        CCIPSendRequested.create(input, {
          messageId: ccipSendRequested.message.messageId,
          token: Address32.from(ta.token),
          amount: ta.amount,
          index,
          $dstChain:
            Object.entries(network.outboundLanes).find(
              ([_, address]) =>
                ChainSpecificAddress.address(address) === outboundLane,
            )?.[0] ?? `Unknown_${outboundLane}`,
        }),
      )
    }

    const executionStateChanged = parseExecutionStateChanged(input.log, null)
    if (executionStateChanged) {
      const inboundLane = EthereumAddress(input.log.address)

      // Collect token release/mint events from TokenPools in the same transaction
      // These are emitted in the same order as tokenAmounts[] in the source message
      // Support multiple event formats: ReleasedOrMinted (v1.6+), Released/Minted (v1.5)
      const dstTokens: { address: Address32; amount: bigint }[] = []
      const logsBeforeExecution = input.txLogs.filter(
        (log) => (log.logIndex ?? 0) < (input.log.logIndex ?? 0),
      )

      for (let i = 0; i < logsBeforeExecution.length; i++) {
        const log = logsBeforeExecution[i]

        // Try v1.6+ ReleasedOrMinted event (has token address in event data)
        const releasedOrMinted = parseReleasedOrMinted(log, null)
        if (releasedOrMinted) {
          dstTokens.push({
            address: Address32.from(releasedOrMinted.token),
            amount: releasedOrMinted.amount,
          })
          continue
        }

        // Try v1.5 Released event (token address from preceding Transfer event)
        const released = parseReleased(log, null)
        if (released) {
          // Find the Transfer event immediately before this Released event
          const tokenAddress = findPrecedingTransferToken(
            logsBeforeExecution,
            i,
            released.amount,
          )
          if (tokenAddress) {
            dstTokens.push({
              address: Address32.from(tokenAddress),
              amount: released.amount,
            })
          }
          continue
        }

        // Try v1.5 Minted event (token address from preceding Transfer event)
        const minted = parseMinted(log, null)
        if (minted) {
          // Find the Transfer event immediately before this Minted event
          const tokenAddress = findPrecedingTransferToken(
            logsBeforeExecution,
            i,
            minted.amount,
          )
          if (tokenAddress) {
            dstTokens.push({
              address: Address32.from(tokenAddress),
              amount: minted.amount,
            })
          }
        }
      }

      return [
        ExecutionStateChanged.create(input, {
          messageId: executionStateChanged.messageId,
          state: executionStateChanged.state,
          $srcChain:
            Object.entries(network.inboundLanes).find(
              ([_, address]) =>
                ChainSpecificAddress.address(address) === inboundLane,
            )?.[0] ?? `Unknown_${inboundLane}`,
          dstTokens: dstTokens.length > 0 ? dstTokens : undefined,
        }),
      ]
    }
  }

  matchTypes = [ExecutionStateChanged]
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ExecutionStateChanged.checkType(delivery)) {
      const ccipSendRequests = db.findAll(CCIPSendRequested, {
        messageId: delivery.args.messageId,
      })

      if (ccipSendRequests.length === 0) return
      if (delivery.args.state !== 2) return // Only match successful executions

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
              dstTokenAddress: dstToken.address,
              dstAmount: dstToken.amount,
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
