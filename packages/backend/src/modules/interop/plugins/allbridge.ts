/*
allbridge is a simple swap service that performs three steps:
 1. User deposist tokens and message (hash) is sent from SRC to DST
 2. On DST message is received
 3. On DST message is executed and tokens are withdrawn

  Technically an "artificial" VUSD token is being transferred but conceptually we treat it as a swap
  as VUSD is not used outside of Allbridge
 */

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

export const ALLBRDIGE_NETWORKS = defineNetworks('allbridge', [
  { allBridgeChainId: 6, chain: 'arbitrum' },
  { allBridgeChainId: 9, chain: 'base' },
])

export const MessageSent = createInteropEventType<{
  message: `0x${string}`
  $dstChain: string
}>('allbridge.MessageSent')

export const TokensSent = createInteropEventType<{
  amount: number
  receiveToken: `0x${string}`
  $dstChain: string
}>('allbridge.TokensSent')

export const MessageReceived = createInteropEventType<{
  message: `0x${string}`
  $srcChain: string
}>('allbridge.MessageReceived')

export const TokensReceived = createInteropEventType<{
  amount: number
  message: `0x${string}`
  $srcChain: string
}>('allbridge.TokensReceived')

export class AllbridgePlugIn implements InteropPlugin {
  name = 'allbridge'

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      return [
        MessageSent.create(input.ctx, {
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
        MessageReceived.create(input.ctx, {
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
      return [
        TokensSent.create(input.ctx, {
          amount: Number(tokensSent.amount),
          receiveToken: tokensSent.receiveToken,
          $dstChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            Number(tokensSent.destinationChainId),
          ),
        }),
      ]
    }

    const tokensReceived = parseTokensReceived(input.log, null)
    if (tokensReceived) {
      return [
        TokensReceived.create(input.ctx, {
          amount: Number(tokensReceived.amount),
          message: tokensReceived.message,
          $srcChain: findChain(
            ALLBRDIGE_NETWORKS,
            (x) => x.allBridgeChainId,
            /* srcChain is the first byte of the message */
            Number.parseInt(tokensReceived.message.slice(2, 4), 16),
          ),
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
  match(delivery: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (TokensReceived.checkType(delivery)) {
      const messageReceived = db.find(MessageReceived, {
        message: delivery.args.message,
      })
      if (!messageReceived) {
        return
      }

      const messageSent = db.find(MessageSent, {
        message: delivery.args.message,
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
          app: 'allbridgeswap',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        }),
        Result.Transfer('allbridgeswap.Transfer', {
          srcEvent: tokensSent,
          srcAmount: BigInt(tokensSent.args.amount.toString()),
          dstEvent: delivery,
          dstAmount: BigInt(delivery.args.amount.toString()),
        }),
      ]
    }
  }
}
