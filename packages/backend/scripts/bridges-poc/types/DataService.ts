export class DataService {
  getUnmatchedMessages<T>(messagingProtocol: string): T[] {
    return []
  }

  getUnmatchedTransfers<T>(app: string): T[] {
    return []
  }

  deleteUnmatchedMessages(
    messages: { messagingProtocol: string; id: string }[],
  ) {}

  deleteUnmatchedTransfers(transfers: { app: string; id: string }[]) {}
}
