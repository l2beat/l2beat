import type { DataService } from '../../types/DataService'
import type { MatcherOutput } from '../../types/Matcher'
import type { TokenService } from '../../types/TokenService'
import type {
  Wormhole_Inbound,
  Wormhole_Outbound,
} from '../../types/UnmatchedMessage'
import type {
  Portal_Inbound,
  Portal_Outbound,
} from '../../types/UnmatchedTransfer.'

export async function matcher(
  dataService: DataService,
  tokenService: TokenService,
): Promise<MatcherOutput> {
  const unmatchedMessages =
    dataService.getUnmatchedMessages<[Wormhole_Outbound, Wormhole_Inbound]>(
      'wormhole',
    )

  const unmatchedTransfers =
    dataService.getUnmatchedTransfers<[Portal_Outbound, Portal_Inbound]>(
      'portal',
    )

  const result: MatcherOutput = {
    transfers: [],
    messages: [],
  }

  const toDelete: {
    unmatchedMessages: { messagingProtocol: string; id: string }[]
    unmatchedTransfers: { app: string; id: string }[]
  } = {
    unmatchedMessages: [],
    unmatchedTransfers: [],
  }

  const outbounds = unmatchedTransfers.filter(
    (t): t is Portal_Outbound => t.type === 'Portal_Outbound',
  )

  for (const outbound of outbounds) {
    const inbound = unmatchedTransfers.find(
      (t): t is Portal_Inbound =>
        t.type === 'Portal_Inbound' && t.id === outbound.id,
    )

    const outboundMessage = unmatchedMessages.find(
      (m): m is Wormhole_Outbound =>
        m.type === 'Wormhole_Outbound' && m.id === outbound.wormholeMessageId,
    )

    const inboundMessage = unmatchedMessages.find(
      (m): m is Wormhole_Inbound =>
        m.type === 'L2BEAT_SYNTHETIC_Wormhole_Inbound' &&
        m.id === inbound?.wormholeMessageId,
    )

    if (inbound && inboundMessage && outboundMessage) {
      result.messages.push({
        id: inboundMessage.id,
        messagingProtocol: 'wormhole',
        associated: [
          {
            app: 'portal',
            transferId: outbound.id,
          },
        ],

        originChain: outboundMessage.originChain,
        originTxHash: outboundMessage.txHash,
        originTimestamp: outboundMessage.timestamp,
        originType: outboundMessage.type,

        destinationChain: inboundMessage.destinationChain,
        destinationTxHash: inboundMessage.txHash,
        destinationTimestamp: inboundMessage.timestamp,
        destinationType: inboundMessage.type,
      })

      const { symbol, amount, valueUsd } = await tokenService.calculateValue(
        inbound.destinationChain,
        outbound.destinationToken,
        outbound.destinationAmount,
        inbound.timestamp,
      )

      result.transfers.push({
        id: outbound.id,
        app: outbound.app,
        associated: [
          {
            messagingProtocol: inboundMessage.messagingProtocol,
            messageId: inboundMessage.id,
          },
        ],

        originChain: outbound.originChain,
        originTx: outbound.txHash,
        originTimestamp: outbound.timestamp,
        originAmount: outbound.originAmount,

        destinationChain: inbound.destinationChain,
        destinationTx: inbound.txHash,
        destinationTimestamp: inbound.timestamp,
        destinationToken: outbound.destinationToken,
        destinationAmount: outbound.destinationAmount,

        token: symbol,
        amount: amount,
        valueUsd: valueUsd,
      })

      toDelete.unmatchedMessages.push({
        messagingProtocol: outboundMessage.messagingProtocol,
        id: outboundMessage.id,
      })
      toDelete.unmatchedMessages.push({
        messagingProtocol: inboundMessage.messagingProtocol,
        id: inboundMessage.id,
      })
      toDelete.unmatchedTransfers.push({
        app: outbound.app,
        id: outbound.id,
      })
      toDelete.unmatchedTransfers.push({
        app: inbound.app,
        id: inbound.id,
      })
    }
  }

  dataService.deleteUnmatchedMessages(toDelete.unmatchedMessages)
  dataService.deleteUnmatchedTransfers(toDelete.unmatchedTransfers)

  return result
}
