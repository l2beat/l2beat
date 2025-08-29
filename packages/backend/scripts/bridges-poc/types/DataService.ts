export class DataService {
  getUnmatchedMessages<T extends unknown[]>(messagingProtocol: string): T {
    return [] as unknown as T
  }

  getUnmatchedTransfers<T extends unknown[]>(app: string): T {
    return [] as unknown as T
  }

  deleteUnmatchedMessages(
    messages: { messagingProtocol: string; id: string }[],
  ) {}

  deleteUnmatchedTransfers(transfers: { app: string; id: string }[]) {}
}
