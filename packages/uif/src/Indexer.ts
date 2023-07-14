export interface UpdateEvent {
  type: 'update'
  height: number
}

export interface Indexer {
  subscribe(child: Indexer): void
  notifyReady(child: Indexer): void
  notifyUpdate(parent: Indexer, safeHeight: number): void
  start(): Promise<void>
}
