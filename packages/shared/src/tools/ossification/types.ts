import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface OssificationHistory {
  contracts: OssificationContract[]
  changes: OssificationChange[]
  resets: number[]
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
  /** Start of the unchanged period: the newest deployment or critical change
   *  anywhere in the perimeter. */
  projectClockStart: number
  /** Timestamp of the last critical change, absent if none ever */
  lastCriticalChange?: number
  /** 24h-clustered critical change events per year, trailing window */
  criticalChangesPerYear: number
  clusteredEventCount: number
  windowSeconds: number
  /** 24h-clustered timestamps of every critical change, ascending */
  criticalChanges: number[]
  /** 24h-clustered timestamps of every perimeter reset, ascending: critical
   *  changes plus deployments of critical contracts. */
  perimeterResets: number[]
  /** Youngest clock first. */
  contracts: OssificationContract[]
  criticalUpdates: OssificationCriticalUpdate[]
}

export interface OssificationContract {
  name: string
  address: ChainSpecificAddress
  isVerified: boolean
  /** Start of the battle-tested clock: last critical change, or deployment
   *  if the contract never changed. */
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
