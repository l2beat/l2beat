import { UnixTime } from '@l2beat/shared-pure'

export type Layer2FinalityConfig =
  | {
      type: 'OPStack'
      lag: number
    }
  // We require the minTimestamp to be set for all types that will be processed in FinalityIndexer
  | {
      type: 'Linea' | 'zkSyncEra' | 'zkSyncLite'
      minTimestamp: UnixTime
      lag: number
    }

export type FinalityType = Layer2FinalityConfig['type']
