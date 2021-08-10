import { Pointer } from './Pointer'

export interface ProjectParameter {
  /** Parameter name, e.g. Permissionless */
  name: string
  /** Parameter value, e.g. Yes */
  value: string
  /** Additional information available on demand but hidden initially */
  tooltip?: string
  /** Researchers opinion about the parameter */
  sentiment?: 'bad' | 'good' | 'warning'
  /** Relevant links */
  pointers?: Pointer[]
}
