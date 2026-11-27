import { DOT_SEPARATOR } from '~/utils/dotSeparator'

/** The "STATS" label with the time window, and the chain scope when given. */
export function StatsCardHeader({ scope }: { scope?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <span className="font-bold text-label-value-12 uppercase">Stats</span>
      <span className="font-medium text-label-value-12 text-secondary">
        Last 24h
        {scope && (
          <>
            {DOT_SEPARATOR}
            {scope}
          </>
        )}
      </span>
    </div>
  )
}
