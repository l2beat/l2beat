import { Effect } from './Effect'

export interface BaseIndexerState {
  height: number
  parentHeights: number[]
  status: 'idle' | 'updating' | 'invalidating' | 'errored' 
}

export type StateAndEffects = [BaseIndexerState, Effect[]]
