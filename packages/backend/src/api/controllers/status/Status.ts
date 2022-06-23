import { UnixTime } from '@l2beat/common'

export interface Status {
  name: string
  timestamp: UnixTime | undefined
  value: string | undefined
  isSynced: boolean
}
