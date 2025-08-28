import { assert } from '@l2beat/shared-pure'
import type { MatcherOutput } from '../../types/Matcher'
import type { TokenService } from '../../types/TokenService'
import type { UnmatchedMessage } from '../../types/UnmatchedMessage'
import type { UnmatchedTransfer } from '../../types/UnmatchedTransfer.'

export async function matcher(
  tokenService: TokenService,
): Promise<MatcherOutput> {
  const unmatchedMessages: UnmatchedMessage[] = []
  const unmatchedTransfers: UnmatchedTransfer[] = []

  const result: MatcherOutput = {
    transfers: [],
    messages: [],
  }

  const outbounds = unmatchedTransfers.filter(
    (u) => u.app === 'portal' && u.type === 'LogMessagePublished',
  )

  for (const outbound of outbounds) {
    const inbound = unmatchedTransfers.find(
      (t) =>
        t.app === 'portal' &&
        t.type === 'TransferRedeemed' &&
        t.id === outbound.id,
    )

    const outboundMessage = unmatchedMessages.find(
      (m) =>
        m.messagingProtocol === 'wormhole' &&
        m.id === outbound.id &&
        m.type === 'LogMessagePublished',
    )

    const inboundMessage = unmatchedMessages.find(
      (m) =>
        m.messagingProtocol === 'wormhole' &&
        m.id === outbound.id &&
        m.type === 'L2BEAT_SYNTHETIC_TransferRedeemed',
    )

    if (inbound && inboundMessage && outboundMessage) {
      assert(
        outboundMessage.originChain,
        `${outboundMessage.txHash}: originChain should be defined`,
      )
      assert(
        inboundMessage.destinationChain,
        `${inboundMessage.txHash}: destinationChain should be defined`,
      )

      result.messages.push({
        id: inboundMessage.id,
        messagingProtocol: 'wormhole',
        app: 'portal',

        originChain: outboundMessage.originChain,
        originTxHash: outboundMessage.txHash,
        originTimestamp: outboundMessage.timestamp,
        originType: outboundMessage.type,

        destinationChain: inboundMessage.destinationChain,
        destinationTxHash: inboundMessage.txHash,
        destinationTimestamp: inboundMessage.timestamp,
        destinationType: inboundMessage.type,
      })

      assert(
        outbound.originChain,
        `${outbound.txHash}: originChain should be defined`,
      )
      assert(
        inbound.destinationChain,
        `${inbound.txHash}: destinationChain should be defined`,
      )

      assert(
        inbound.destinationAmount,
        `${inbound.txHash}: destinationAmount should be defined`,
      )
      assert(
        inbound.destinationToken,
        `${inbound.txHash}: destinationToken should be defined`,
      )

      const { symbol, amount, valueUsd } = await tokenService.calculateValue(
        inbound.destinationChain,
        inbound.destinationToken,
        inbound.destinationAmount,
        inbound.timestamp,
      )

      result.transfers.push({
        id: outbound.id,
        app: outbound.app,

        originChain: outbound.originChain,
        originTx: outbound.txHash,
        originTimestamp: outbound.timestamp,
        // originToken?: string
        originAmount: outbound.originAmount,

        destinationChain: inbound.destinationChain,
        destinationTx: inbound.txHash,
        destinationTimestamp: inbound.timestamp,
        destinationToken: inbound.destinationToken,
        destinationAmount: inbound.destinationAmount,

        token: symbol,
        amount: amount,
        valueUsd: valueUsd,
      })
    }
  }

  // add deletion mechanism

  return result
}
