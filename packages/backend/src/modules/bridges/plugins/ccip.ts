/* 
CCIP is a messaging and token transfer protocol. This plugin matches messages. Further
research is required regarding message delivery - in this version only message execution is matched. 
The dst chain on SRC must be determined by the contract address that emitted the event as separate
contracts are set up for every SRC-DST pair on each chain
*/

import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
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

export const CCIPSendRequested = createBridgeEventType<{
  messageId: `0x${string}`
}>('ccip.CCIPSendRequested')

export const ExecutionStateChanged = createBridgeEventType<{
  messageId: `0x${string}`
  state: number
}>('ccip.ExecutionStateChanged')

export class CCIPPlugIn implements BridgePlugin {
  name = 'ccip'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const ccipSendRequested = parseCCIPSendRequested(input.log, null)
    if (ccipSendRequested)
      return CCIPSendRequested.create(input.ctx, {
        messageId: ccipSendRequested.message.messageId,
      })
    // TODO: extraxt dst chain from contract address

    const executionStateChanged = parseExecutionStateChanged(input.log, null)
    if (executionStateChanged)
      return ExecutionStateChanged.create(input.ctx, {
        messageId: executionStateChanged.messageId,
        state: executionStateChanged.state,
      })
  }

  // TODO: match transfer

  matchtypes = [ExecutionStateChanged]
  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (ExecutionStateChanged.checkType(delivery)) {
      const ccipSendRequested = db.find(CCIPSendRequested, {
        messageId: delivery.args.messageId,
      })

      if (!ccipSendRequested) return
      if (delivery.args.state !== 2) return
      return [Result.Message('ccip.Message', [ccipSendRequested, delivery])]
    }
  }
}
