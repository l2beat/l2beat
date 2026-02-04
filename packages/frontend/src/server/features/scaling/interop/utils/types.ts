import type { InteropDurationSplit } from '@l2beat/config'
import type { InteropBridgeType } from '@l2beat/shared-pure'

export type TokenData = {
  id: string
  symbol: string
  iconUrl: string
  volume: number | null
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number | null
}

export type ChainData = {
  id: string
  name: string
  iconUrl: string
  volume: number
  transferCount: number
  avgDuration: AverageDuration | null
  avgValue: number
}

export type SingleAverageDuration = {
  type: 'single'
  duration: number
}

export type SplitAverageDuration = {
  type: 'split'
  in: {
    label: string
    duration: number | null
  }
  out: {
    label: string
    duration: number | null
  }
}

export type UnknownAverageDuration = {
  type: 'unknown'
}

export type AverageDuration =
  | SingleAverageDuration
  | SplitAverageDuration
  | UnknownAverageDuration

/** Two-level map: projectId -> bridgeType -> durationSplit config */
export type DurationSplitMap = Map<
  string,
  Map<InteropBridgeType, NonNullable<InteropDurationSplit>>
>
