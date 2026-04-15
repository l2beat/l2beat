import type { CompiledReview } from '../../../../types'

interface TimestampsFooterProps {
  review: CompiledReview
}

export function TimestampsFooter({ review }: TimestampsFooterProps) {
  return (
    <div className="bg-bg-card border border-border rounded-lg px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-0">
      <TimestampItem
        label="Published"
        iso={review.publishedAt}
        showRelative={false}
      />
      <Divider />
      <TimestampItem
        label="Last updated"
        iso={review.updatedAt}
        showRelative
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
}: {
  label: string
  iso: string
  showRelative: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
        {label}
      </p>
      <p className="font-mono text-[13px] text-text-primary">
        {new Date(iso).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
        {showRelative && (
          <span className="text-text-muted"> ({timeAgo(iso)})</span>
        )}
      </p>
    </div>
  )
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
