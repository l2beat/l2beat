import type { CompiledReview } from '../../../../types'
import { getLatestActivityTimestamp } from '../activityTimestamp'

interface TimestampsFooterProps {
  review: CompiledReview
}

export function TimestampsFooter({ review }: TimestampsFooterProps) {
  const latestActivity = getLatestActivityTimestamp(review)
  return (
    <div className="bg-bg-card border border-border rounded-lg px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-0">
      <TimestampItem
        label="Published"
        iso={review.publishedAt}
        showRelative={false}
        secondary={
          review.lastModified
            ? `last modified ${formatDate(review.lastModified)}`
            : undefined
        }
      />
      <Divider />
      <TimestampItem
        label="Latest activity"
        iso={latestActivity}
        showRelative
        emptyFallback="Not monitored"
      />
      <Divider />
      <TimestampItem
        label="On-chain data"
        iso={review.compiledAt}
        showRelative
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="hidden sm:block h-8 w-px bg-border mx-6" aria-hidden="true" />
  )
}

function TimestampItem({
  label,
  iso,
  showRelative,
  secondary,
  emptyFallback,
}: {
  label: string
  iso: string | null
  showRelative: boolean
  secondary?: string
  emptyFallback?: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
        {label}
      </p>
      {iso ? (
        <p className="font-mono text-[13px] text-text-primary">
          {formatDate(iso)}
          {showRelative && (
            <span className="text-text-muted"> ({timeAgo(iso)})</span>
          )}
          {secondary && (
            <span className="text-text-muted"> ({secondary})</span>
          )}
        </p>
      ) : (
        <p className="font-mono text-[13px] text-text-muted">
          {emptyFallback ?? '—'}
        </p>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function timeAgo(isoString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000,
  )
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}
