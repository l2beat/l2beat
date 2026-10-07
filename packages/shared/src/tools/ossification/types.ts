import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface OssificationHistory {
  contracts: OssificationContract[]
  changes: OssificationChange[]
  /** Moments new code entered the perimeter without a change: deployments,
   *  initializations and perimeter joins, none before the project start. */
  arrivals: number[]
  observedSince: number
}

/** Score, change rate and clock timestamps of the critical perimeter,
 *  measured at the time passed to measureOssification. The TVS exposure needs
 *  the database and is added by the frontend. */
export interface OssificationResult {
  /** 0-100: the share of recorded code-bug exploits (published, versioned
   *  incident dataset, see ossificationCurve.json) whose exploited code was
   *  younger than this perimeter's age. 0 while any critical contract is
   *  unverified. */
  score: number
  /** score as a 0..1 fraction; 0 gates exposure when unverified */
  maturity: number
  /** Start of the current clock, the unchanged period: the youngest contract
   *  clock, so the newest reset, or the launch when nothing was reset since. */
  projectClockStart: number
  /** Start of the first clock, once per project: the end of the rollout at
   *  the start of observation. Earlier arrivals assembled the perimeter. No
   *  clock starts before it. */
  launch: number
  /** Timestamp of the last critical change, absent if none ever */
  lastCriticalChange?: number
  /** 24h-clustered critical change events per year, trailing window */
  criticalChangesPerYear: number
  clusteredEventCount: number
  windowSeconds: number
  /** 24h-clustered timestamps of every critical change, ascending */
  criticalChanges: number[]
  /** 24h-clustered timestamps of every reset of the clock after the launch,
   *  ascending: critical changes plus arrivals after the launch. */
  resets: number[]
  /** Youngest clock first, each clock bounded by the launch. */
  contracts: OssificationContract[]
  criticalUpdates: OssificationCriticalUpdate[]
}

export interface OssificationContract {
  name: string
  address: ChainSpecificAddress
  isVerified: boolean
  /** Start of the battle-tested clock: last critical change, or deployment
   *  if the contract never changed. A measured clock does not start before
   *  the launch. */
  ossifyingSince: number
  codeChangeCount: number
  stateChangeCount: number
}

export interface OssificationChange {
  timestamp: number
  type: OssificationChangeType
  updateId?: string
  earliest?: number
}

export type OssificationChangeType = 'code' | 'state'

export interface OssificationCriticalUpdate {
  /** Discovery update id, shared with diffHistory.md and discoveryUpdates. */
  id: string
  type: OssificationChangeType
}
