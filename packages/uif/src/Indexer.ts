export interface Subscription {
  unsubscribe(): void
}

export interface UpdateEvent {
  type: 'update'
  height: number
}

export interface Indexer {
  subscribe(child: Indexer): Subscription
  notifyReady(child: Indexer): void
  notifyUpdate(parent: Indexer, height: number): void
  start(): Promise<void>
}
