import type { UnmatchedMessage } from './UnmatchedMessage'
import type { UnmatchedTransfer } from './UnmatchedTransfer.'

export class DataService {
  unmatchedMessages: UnmatchedMessage[] = []
  unmatchedTransfers: UnmatchedTransfer[] = []

  saveUnmatchedMessage(message: UnmatchedMessage) {
    this.unmatchedMessages.push(message)
  }

  saveUnmatchedTransfer(transfer: UnmatchedTransfer) {
    this.unmatchedTransfers.push(transfer)
  }

  getUnmatchedMessages<T>(messagingProtocol: string): T[] {
    return this.unmatchedMessages.filter(
      (m) => m.messagingProtocol === messagingProtocol,
    ) as T[]
  }

  getUnmatchedTransfers<T>(app: string): T[] {
    return this.unmatchedTransfers.filter((t) => t.app === app) as T[]
  }

  deleteUnmatchedMessages(
    messages: { messagingProtocol: string; id: string }[],
  ) {
    const messagesToDelete = new Set(
      messages.map((m) => `${m.messagingProtocol}:${m.id}`),
    )

    this.unmatchedMessages = this.unmatchedMessages.filter(
      (message) =>
        !messagesToDelete.has(`${message.messagingProtocol}:${message.id}`),
    )
  }

  deleteUnmatchedTransfers(transfers: { app: string; id: string }[]) {
    const transfersToDelete = new Set(transfers.map((t) => `${t.app}:${t.id}`))

    this.unmatchedTransfers = this.unmatchedTransfers.filter(
      (transfer) => !transfersToDelete.has(`${transfer.app}:${transfer.id}`),
    )
  }
}
