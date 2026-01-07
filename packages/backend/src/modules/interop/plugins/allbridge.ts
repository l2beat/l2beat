/*
allbridge is a simple swap service that performs three steps:
 1. User deposist tokens and message (hash) is sent from SRC to DST
 2. On DST message is received
 3. On DST message is executed and tokens are withdrawn

  Technically an "artificial" VUSD token is being transferred but conceptually we treat it as a swap
  as VUSD is not used outside of Allbridge
 */

import { Address32 } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

/*
event MessageSent(bytes32 indexed message)
event TokensSent(uint256 amount, bytes32 recipient, uint256 destinationChainId, bytes32 receiveToken, uint256 nonce, uint8 messenger)
event MessageReceived(bytes32 indexed message)
event TokensReceived(uint256 amount, bytes32 recipient, uint256 nonce, uint8 messenger, bytes32 message)

TODO: The main problem to solve here is that we don't have an info on a source token, we might need to track srcToken --> Vtoken swap via
   SwappedToVUSD event. We also have SwappedFromVUSD on the destination but this does not really add any extra info.
*/

const parseMessageSent = createEventParser(
  'event MessageSent(bytes32 indexed message)',
)

const parseTokensSent = createEventParser(
  'event TokensSent(uint256 amount, bytes32 recipient, uint256 destinationChainId, bytes32 receiveToken, uint256 nonce, uint8 messenger)',
)

const parseMessageReceived = createEventParser(
  'event MessageReceived(bytes32 indexed message)',
)

const parseTokensReceived = createEventParser(
  'event TokensReceived(uint256 amount, bytes32 recipient, uint256 nonce, uint8 messenger, bytes32 message)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export const ALLBRDIGE_NETWORKS = defineNetworks('allbridge', [
  { allBridgeChainId: 6, chain: 'arbitrum' },
  { allBridgeChainId: 9, chain: 'base' },
])

export const MessageSent = createInteropEventType<{
  message: `0x${string}`
  $dstChain: string
}>('allbridge.MessageSent')

export const TokensSent = createInteropEventType<{
  amount: bigint
  receiveToken: `0x${string}`
  $dstChain: string
  srcTokenAddress?: Address32
  srcAmount?: bigint
}>('allbridge.TokensSent')

export const MessageReceived = createInteropEventType<{
  message: `0x${string}`
  $srcChain: string
}>('allbridge.MessageReceived')

export const TokensReceived = createInteropEventType<{
  amount: bigint
  message: `0x${string}`
  $srcChain: string
  dstTokenAddress?: Address32
  dstAmount?: bigint
}>('allbridge.TokensReceived')

export class AllbridgePlugIn implements InteropPlugin {
  name = 'allbridge'

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      return [
        MessageSent.create(input, {
          message: messageSent.message,
          $dstChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            /* dstChain is the second byte of the message */
            Number.parseInt(messageSent.message.slice(4, 6), 16),
          ),
        }),
      ]
    }

    const messageReceived = parseMessageReceived(input.log, null)
    if (messageReceived) {
      return [
        MessageReceived.create(input, {
          message: messageReceived.message,
          $srcChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            /* srcChain is the first byte of the message */
            Number.parseInt(messageReceived.message.slice(2, 4), 16),
          ),
        }),
      ]
    }
    const tokensSent = parseTokensSent(input.log, null)
    if (tokensSent) {
      // Find Transfer event in any preceding logs
      let srcTokenAddress: Address32 | undefined
      let srcAmount: bigint | undefined

      for (
        let offset = 1;
        // biome-ignore lint/style/noNonNullAssertion: It's there
        offset <= input.log.logIndex!;
        offset++
      ) {
        const precedingLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! - offset,
        )
        if (!precedingLog) break

        const transfer = parseTransfer(precedingLog, null)
        if (transfer) {
          srcTokenAddress = Address32.from(precedingLog.address)
          srcAmount = transfer.value
          break
        }
      }
      return [
        TokensSent.create(input, {
          amount: tokensSent.amount,
          receiveToken: tokensSent.receiveToken,
          $dstChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            Number(tokensSent.destinationChainId),
          ),
          srcTokenAddress,
          srcAmount,
        }),
      ]
    }

    const tokensReceived = parseTokensReceived(input.log, null)
    if (tokensReceived) {
      let dstTokenAddress: Address32 | undefined
      let dstAmount: bigint | undefined

      for (
        let offset = 1;
        // biome-ignore lint/style/noNonNullAssertion: It's there
        offset <= input.log.logIndex!;
        offset++
      ) {
        const precedingLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! - offset,
        )
        if (!precedingLog) break

        const transfer = parseTransfer(precedingLog, null)
        if (transfer) {
          dstTokenAddress = Address32.from(precedingLog.address)
          dstAmount = transfer.value
          break
        }
      }
      return [
        TokensReceived.create(input, {
          amount: tokensReceived.amount,
          message: tokensReceived.message,
          $srcChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            /* srcChain is the first byte of the message */
            Number.parseInt(tokensReceived.message.slice(2, 4), 16),
          ),
          dstTokenAddress,
          dstAmount,
        }),
      ]
    }
  }
  /* Matching logic:
  1. Start with TokenReceived on a destination
  2. Find tx with MessageReceived with the same message hash on a destination
  3. Find tx with MessageSent with the same message hash on a source
  4. Find tx with TokensSent in the same tx as MessageSent on a source
  5. Generate Message and Transfer results
  */

  matchTypes = [TokensReceived]
  match(
    tokensReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (TokensReceived.checkType(tokensReceived)) {
      const messageReceived = db.find(MessageReceived, {
        message: tokensReceived.args.message,
      })
      if (!messageReceived) {
        return
      }

      const messageSent = db.find(MessageSent, {
        message: tokensReceived.args.message,
      })
      if (!messageSent) {
        return
      }

      const tokensSent = db.find(TokensSent, {
        sameTxAfter: messageSent,
      })
      if (!tokensSent) {
        return
      }

      return [
        Result.Message('allbridge.Message', {
          app: 'allbridge',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        }),
        Result.Transfer('allbridge.Transfer', {
          srcEvent: tokensSent,
          srcTokenAddress: tokensSent.args.srcTokenAddress,
          srcAmount: tokensSent.args.srcAmount,
          dstEvent: tokensReceived,
          dstAmount: tokensReceived.args.dstAmount,
          dstTokenAddress: tokensReceived.args.dstTokenAddress,
        }),
      ]
    }
  }
}
