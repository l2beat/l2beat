import { LiveIndicator } from '~/components/LiveIndicator'
import { NextBlock } from '~/pages/blobs/components/live-blobs/NextBlock'
import { formatTimestamp } from '~/utils/dates'
import type { LiveTips } from './useLiveTips'

export function LiveStatus({ live }: { live: LiveTips }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-label-value-14">
      {/* Announced when it changes; the countdown stays out of it */}
      <span role="status" className="flex items-center gap-2 text-primary">
        {live.status === 'live' && (
          <>
            <LiveIndicator />
            Live from Ethereum
          </>
        )}
        {live.status === 'stale' && (
          <>
            <LiveIndicator disabled />
            Not live: last read{' '}
            {formatTimestamp(live.updatedAt, { mode: 'datetime' })}
          </>
        )}
        {live.status === 'none' && 'No estimate right now'}
      </span>
      {live.status === 'live' && <NextBlock hidden={false} />}
    </div>
  )
}
