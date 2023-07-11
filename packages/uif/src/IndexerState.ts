export interface IndexerState {
  readonly status:
    | 'init'
    | 'idle'
    | 'updating'
    | 'will-invalidate'
    | 'invalidating'
    | 'errored'
  readonly height: number
  readonly targetHeight: number
  readonly safeHeight: number
  readonly initializedSelf: boolean
  readonly parents: {
    readonly height: number
    readonly initialized: boolean
    readonly waiting: boolean
  }[]
  readonly children: {
    readonly ready: boolean
  }[]
}
