import { Effect } from './Effect'

export interface BaseIndexerState {
  status: 'init' | 'idle' | 'updating' | 'invalidating' | 'errored'
  height: number
  parentHeights: number[]
  initializedSelf: boolean
  initializedParents: boolean[]
}

export type StateAndEffects = [BaseIndexerState, Effect[]]
