export type SubscriptionCallback = (event: UpdateEvent) => void

export interface Subscription {
  unsubscribe(): void
}

export interface UpdateEvent {
  type: 'update'
  height: number
}

export interface Indexer {
  subscribe(callback: SubscriptionCallback): Subscription
  start(): Promise<void>
}
