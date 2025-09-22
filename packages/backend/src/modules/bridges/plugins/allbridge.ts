/* 
allbridge is a simple swap service that performs three steps:
 1. User deposist tokens and message (hash) is sent from SRC to DST
 2. On DST message is received
 3. On DST message is executed and tokens are withdrawn

  Technically an "artificial" VUSD token is being transferred but conceptually we treat it as a swap
  as VUSD is not used outside of Allbridge
 */

import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
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

export const MessageSent = createBridgeEventType<{
  message: `0x${string}`
  $dstChain: string
}>('allbridge.MessageSent')

export const TokensSent = createBridgeEventType<{
  amount: number
  receiveToken: `0x${string}`
}>('allbridge.TokensSent')

export const MessageReceived = createBridgeEventType<{
  message: `0x${string}`
  $srcChain: string
}>('allbridge.MessageReceived')

export const TokensReceived = createBridgeEventType<{
  amount: number
  message: `0x${string}`
}>('allbridge.TokensReceived')

export class AllbridgePlugIn implements BridgePlugin {
  name = 'allbridge'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      /* dstChain is the second byte of the message */
      const secondByte = messageSent.message.slice(4, 6)
      const dstChain =
        ALLBRDIGE_NETWORKS.find(
          (x) => x.allBridgeChainId === Number.parseInt(secondByte, 16),
        )?.chain ?? `AB_${secondByte}`
      return MessageSent.create(input.ctx, {
        message: messageSent.message,
        $dstChain: dstChain,
      })
    }

    const messageReceived = parseMessageReceived(input.log, null)
    if (messageReceived) {
      /* srcChain is the second byte of the message */
      const firstByte = messageReceived.message.slice(2, 4)
      const srcChain =
        ALLBRDIGE_NETWORKS.find(
          (x) => x.allBridgeChainId === Number.parseInt(firstByte, 16),
        )?.chain ?? `AB_${firstByte}`
      return MessageReceived.create(input.ctx, {
        message: messageReceived.message,
        $srcChain: srcChain,
      })
    }
    const tokensSent = parseTokensSent(input.log, null)
    if (tokensSent) {
      return TokensSent.create(input.ctx, {
        amount: Number(tokensSent.amount),
        receiveToken: tokensSent.receiveToken,
      })
    }

    const tokensReceived = parseTokensReceived(input.log, null)
    if (tokensReceived) {
      return TokensReceived.create(input.ctx, {
        amount: Number(tokensReceived.amount),
        message: tokensReceived.message,
      })
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
  match(delivery: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
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
        Result.Message('allbridge.Message.allbridgeswap', [
          messageSent,
          messageReceived,
        ]),
        Result.Transfer('allbridge.Swap', {
          srcEvent: tokensSent,
          srcAmount: tokensSent.args.amount.toString(),
          dstEvent: delivery,
          dstAmount: delivery.args.amount.toString(),
        }),
      ]
    }
  }
}
