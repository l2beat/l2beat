export interface Subscription {
  cancel(): void
}

export interface UpdateEvent {
  type: 'update'
  height: number
}

export interface Indexer {
  subscribe(callback: (event: UpdateEvent) => void): Subscription
  start(): Promise<void>
  getHeight(): number
}
