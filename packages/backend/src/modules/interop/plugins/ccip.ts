/*
CCIP is a messaging and token transfer protocol. This plugin matches messages. Further
research is required regarding message delivery - in this version only message execution is matched.
The dst chain on SRC must be determined by the contract address that emitted the event as separate
contracts are set up for every SRC-DST pair on each chain
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import {
  Address32,
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

export const CCIPSendRequested = createInteropEventType<{
  messageId: `0x${string}`
  $dstChain: string
  tokenAmounts: { token: Address32; amount: string }[]
}>('ccip.CCIPSendRequested')

export const ExecutionStateChanged = createInteropEventType<{
  messageId: `0x${string}`
  state: number
  $srcChain: string
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
  name = 'ccip'

  capture(input: LogToCapture) {
    const network = CCIP_NETWORKS.find((x) => x.chain === input.ctx.chain)
    if (!network) return

    const ccipSendRequested = parseCCIPSendRequested(input.log, null)
    if (ccipSendRequested) {
      const outboundLane = EthereumAddress(input.log.address)
      return [
        CCIPSendRequested.create(input.ctx, {
          messageId: ccipSendRequested.message.messageId,
          tokenAmounts: ccipSendRequested.message.tokenAmounts.map((ta) => ({
            token: Address32.from(ta.token),
            amount: ta.amount.toString(),
          })),
          $dstChain:
            Object.entries(network.outboundLanes).find(
              ([_, address]) => address === outboundLane,
            )?.[0] ?? `Unknown_${outboundLane}`,
        }),
      ]
    }

    const executionStateChanged = parseExecutionStateChanged(input.log, null)
    if (executionStateChanged) {
      const inboundLane = EthereumAddress(input.log.address)
      return [
        ExecutionStateChanged.create(input.ctx, {
          messageId: executionStateChanged.messageId,
          state: executionStateChanged.state,
          $srcChain:
            Object.entries(network.inboundLanes).find(
              ([_, address]) => address === inboundLane,
            )?.[0] ?? `Unknown_${inboundLane}`,
        }),
      ]
    }
  }

  // TODO: match transfer
  // TODO: If the token is USDC, transfer should not be double-counted

  matchTypes = [ExecutionStateChanged]
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ExecutionStateChanged.checkType(delivery)) {
      const ccipSendRequested = db.find(CCIPSendRequested, {
        messageId: delivery.args.messageId,
      })

      if (!ccipSendRequested) return
      if (delivery.args.state !== 2) return
      // For each token in token amounts create add TRANSFER to the Result
      const result: MatchResult = []
      for (const tokenAmount of ccipSendRequested.args.tokenAmounts) {
        result.push(
          Result.Transfer('ccip.Transfer', {
            srcEvent: ccipSendRequested,
            dstEvent: delivery,
            srcTokenAddress: tokenAmount.token,
            srcAmount: BigInt(tokenAmount.amount),
            dstTokenAddress: tokenAmount.token,
            dstAmount: BigInt(tokenAmount.amount),
          }),
        )
      }
      result.push(
        Result.Message('ccip.Message', {
          app: 'CCIP Token Transfer',
          srcEvent: ccipSendRequested,
          dstEvent: delivery,
        }),
      )
      return result
    }
  }
}
