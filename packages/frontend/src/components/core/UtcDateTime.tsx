import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { formatLocalDateTime, formatTimestamp } from '~/utils/dates'

interface Props {
  timestamp: number
}

/**
 * An exact moment, shown in UTC like every time on the site. Hovering shows it
 * in the visitor's own time zone; that part is added after hydration so the
 * server-rendered HTML stays the same for everyone.
 */
export function UtcDateTime({ timestamp }: Props) {
  const [localTime, setLocalTime] = useState<string>()
  useEffect(() => setLocalTime(formatLocalDateTime(timestamp)), [timestamp])

  return (
    <time
      dateTime={UnixTime.toDate(UnixTime(timestamp)).toISOString()}
      title={localTime && `Your time: ${localTime}`}
    >
      {formatTimestamp(timestamp, { mode: 'datetime' })}
    </time>
  )
}
