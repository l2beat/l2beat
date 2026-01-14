/*
CCIP is a messaging and token transfer protocol. This plugin matches messages. Further
research is required regarding message delivery - in this version only message execution is matched.
The dst chain on SRC must be determined by the contract address that emitted the event as separate
contracts are set up for every SRC-DST pair on each chain
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
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

const parseCCIPSendRequested = createEventParser(
  'event CCIPSendRequested((uint64 sourceChainSelector, address sender, address receiver, uint64 sequenceNumber, uint256 gasLimit, bool strict, uint64 nonce, address feeToken, uint256 feeTokenAmount, bytes data, (address token, uint256 amount)[] tokenAmounts, bytes[] sourceTokenData, bytes32 messageId) message)',
)

const parseExecutionStateChanged = createEventParser(
  'event ExecutionStateChanged(uint64 indexed sequenceNumber, bytes32 indexed messageId, uint8 state, bytes returnData)',
)

// TokenPool events emitted when tokens are released or minted on destination chain
// These are more reliable than Transfer events as they're CCIP-specific and avoid
// capturing internal mint operations (e.g., USDC burn/mint pattern)

// Newer CCIP TokenPool event
const parseReleasedOrMinted = createEventParser(
  'event ReleasedOrMinted(uint64 indexed srcChainSelector, address token, address offRamp, address recipient, uint256 amount)',
)

// Older CCIP TokenPool event (still used by some pools)
const parseReleased = createEventParser(
  'event Released(address indexed sender, address indexed recipient, uint256 amount)',
)

const parseMinted = createEventParser(
  'event Minted(address indexed sender, address indexed recipient, uint256 amount)',
)

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
  outboundLanes: Record<string, EthereumAddress>
  inboundLanes: Record<string, EthereumAddress>
}

// Future reference: https://docs.chain.link/ccip/directory/mainnet/chain/mainnet
const CCIP_NETWORKS = defineNetworks<CcipNetwork>('ccip', [
  {
    chain: 'base',
    outboundLanes: {
      arbitrum: EthereumAddress('0x9D0ffA76C7F82C34Be313b5bFc6d42A72dA8CA69'),
      ethereum: EthereumAddress('0x56b30A0Dcd8dc87Ec08b80FA09502bAB801fa78e'),
    },
    inboundLanes: {
      arbitrum: EthereumAddress('0x7D38c6363d5E4DFD500a691Bc34878b383F58d93'),
      ethereum: EthereumAddress('0xCA04169671A81E4fB8768cfaD46c347ae65371F1'),
    },
  },
  {
    chain: 'arbitrum',
    outboundLanes: {
      base: EthereumAddress('0xc1b6287A3292d6469F2D8545877E40A2f75CA9a6'),
      ethereum: EthereumAddress('0x67761742ac8A21Ec4D76CA18cbd701e5A6F3Bef3'),
    },
    inboundLanes: {
      base: EthereumAddress('0xb62178f8198905D0Fa6d640Bdb188E4E8143Ac4b'),
      ethereum: EthereumAddress('0x91e46cc5590A4B9182e47f40006140A7077Dec31'),
    },
  },
  {
    chain: 'ethereum',
    outboundLanes: {
      arbitrum: EthereumAddress('0x69eCC4E2D8ea56E2d0a05bF57f4Fd6aEE7f2c284'),
      base: EthereumAddress('0xb8a882f3B88bd52D1Ff56A873bfDB84b70431937'),
    },
    inboundLanes: {
      arbitrum: EthereumAddress('0xdf615eF8D4C64d0ED8Fd7824BBEd2f6a10245aC9'),
      base: EthereumAddress('0x6B4B6359Dd5B47Cdb030E5921456D2a0625a9EbD'),
    },
  },
])

export class CCIPPlugIn implements InteropPlugin {
  readonly name = 'ccip'

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
              ([_, address]) => address === outboundLane,
            )?.[0] ?? `Unknown_${outboundLane}`,
        }),
      )
    }

    const executionStateChanged = parseExecutionStateChanged(input.log, null)
    if (executionStateChanged) {
      const inboundLane = EthereumAddress(input.log.address)

      // Collect token release/mint events from TokenPools in the same transaction
      // These are emitted in the same order as tokenAmounts[] in the source message
      // Support multiple event formats: ReleasedOrMinted (new), Released, Minted (old)
      const dstTokens: { address: Address32; amount: bigint }[] = []
      for (const log of input.txLogs) {
        // Only look at logs before ExecutionStateChanged
        if ((log.logIndex ?? 0) >= (input.log.logIndex ?? 0)) continue

        // Try newer ReleasedOrMinted event (has token address in event data)
        const releasedOrMinted = parseReleasedOrMinted(log, null)
        if (releasedOrMinted) {
          dstTokens.push({
            address: Address32.from(releasedOrMinted.token),
            amount: releasedOrMinted.amount,
          })
          continue
        }

        // Try older Released event (token address is log.address)
        const released = parseReleased(log, null)
        if (released) {
          dstTokens.push({
            address: Address32.from(log.address),
            amount: released.amount,
          })
          continue
        }

        // Try older Minted event (token address is log.address)
        const minted = parseMinted(log, null)
        if (minted) {
          dstTokens.push({
            address: Address32.from(log.address),
            amount: minted.amount,
          })
        }
      }

      return [
        ExecutionStateChanged.create(input, {
          messageId: executionStateChanged.messageId,
          state: executionStateChanged.state,
          $srcChain:
            Object.entries(network.inboundLanes).find(
              ([_, address]) => address === inboundLane,
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
