import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { formatAge } from '~/utils/formatAge'

/**
 * Ticks every second. Renders nothing on the server, whose clock would not
 * match the visitor's at hydration
 */
export function TimeAgo({ timestamp }: { timestamp: number }) {
  const [now, setNow] = useState<number>()
  useEffect(() => {
    setNow(UnixTime.now())
    const interval = setInterval(() => setNow(UnixTime.now()), 1000)
    return () => clearInterval(interval)
  }, [])
  if (now === undefined) return null
  return <>{formatAge(now - timestamp)}</>
}
