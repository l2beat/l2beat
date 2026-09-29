import type { UnixTime } from '@l2beat/shared-pure'
import type {
  OssificationChangeType,
  ProjectOssificationContract,
} from '../types'

export interface OssificationInput {
  now: UnixTime
  contracts: ProjectOssificationContract[]
  changes: OssificationChange[]
  resets: number[]
  observedSince: number
}

export interface OssificationChange {
  timestamp: number
  type: OssificationChangeType
  updateId?: string
  earliest?: number
}
