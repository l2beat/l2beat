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
  notifyInvalidated(parent: Indexer, to: number): void
  notifyWaiting(parent: Indexer): void
  notifyUpdate(parent: Indexer, safeHeight: number): void
  start(): Promise<void>
}
