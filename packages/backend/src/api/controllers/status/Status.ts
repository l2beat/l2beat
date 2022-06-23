import { UnixTime } from '@l2beat/common'

export interface Status {
  timestamp: UnixTime | undefined
  isSynced: boolean
}

export function fromTimestamp(timestamp: UnixTime | undefined): Status {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')
  const isSynced = Boolean(timestamp?.equals(now))
  return {
    timestamp,
    isSynced,
  }
}
