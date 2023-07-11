export interface IndexerState {
  status: 'init' | 'idle' | 'updating' | 'invalidating' | 'errored'
  height: number
  parentHeights: number[]
  initializedSelf: boolean
  initializedParents: boolean[]
}
