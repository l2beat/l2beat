import { UnixTime } from '@l2beat/shared-pure'
import { useEffect, useState } from 'react'
import { formatAge } from '~/utils/formatAge'

/** Ticks every second. Renders nothing on the server, see `useNow` */
export function TimeAgo({ timestamp }: { timestamp: number }) {
  const now = useNow()
  if (now === undefined) return null
  return <>{formatAge(now - timestamp)}</>
}

/**
 * The time, ticking every second. Undefined on the server and until
 * hydration, as the server's clock would not match the visitor's
 */
export function useNow(): UnixTime | undefined {
  const [now, setNow] = useState<UnixTime>()
  useEffect(() => {
    setNow(UnixTime.now())
    const interval = setInterval(() => setNow(UnixTime.now()), 1000)
    return () => clearInterval(interval)
  }, [])
  return now
}
