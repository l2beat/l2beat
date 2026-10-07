import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface OssificationHistory {
  contracts: OssificationContract[]
  /** Critical changes made while their contract was critical, of current and
   *  retired contracts. Each one resets the clock. */
  changes: OssificationChange[]
  /** Deployments and initializations of critical contracts. They only locate
   *  the ossification genesis. */
  deployments: number[]
  /** The project start, or without one the earliest known contract start */
  observedSince: number
}

/** Score, change rate and clock of the critical perimeter at the time passed
 *  to measureOssification. The TVS exposure needs the database and is added
 *  by the frontend. */
export interface OssificationResult {
  /** 0-100: the share of recorded code-bug exploits (published, versioned
   *  incident dataset, see ossificationCurve.json) whose exploited code was
   *  younger than the clock. 0 while any critical contract is unverified. */
  score: number
  /** Start of the clock: the newest critical change, or the genesis */
  clockStart: number
  /** Start of the first clock, once per project */
  genesis: number
  /** 24h-clustered critical changes per year, over the last 3 years or since
   *  the genesis */
  criticalChangesPerYear: number
  /** 24h-clustered critical changes, ascending */
  criticalChanges: number[]
  /** Youngest first */
  contracts: OssificationContract[]
  criticalUpdates: OssificationCriticalUpdate[]
}

export interface OssificationContract {
  name: string
  address: ChainSpecificAddress
  isVerified: boolean
  /** Age of the contract: since its last critical change, its deployment or
   *  the moment it became critical, and never before the genesis. Shown per
   *  contract, not scored. */
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
