export interface IndexerState {
  status: 'init' | 'idle' | 'updating' | 'invalidating' | 'errored'
  height: number
  initializedSelf: boolean
  parents: {
    height: number
    initialized: boolean
    waiting: boolean
  }[]
  children: {
    ready: boolean
  }[]
}
