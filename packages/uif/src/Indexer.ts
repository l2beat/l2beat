export interface Subscription {
  unsubscribe(): void
}

export interface UpdateEvent {
  type: 'update'
  height: number
}

export interface Indexer {
  subscribe(child: Indexer): Subscription
  notifyInvalidated(child: Indexer, to: number): void
  notifyReady(child: Indexer): void
  notifyWaiting(parent: Indexer): void
  notifyUpdate(parent: Indexer, safeHeight: number): void
  start(): Promise<void>
}
