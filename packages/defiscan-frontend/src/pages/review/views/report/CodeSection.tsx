import type { CompiledReview } from '../../../../types'

const LENS_BASE_URL =
  'https://defiscan-v2-backend-prod-pzz23.ondigitalocean.app/ui/p'

interface CodeSectionProps {
  review: CompiledReview
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

export function CodeSection({ review }: CodeSectionProps) {
  const lensUrl = `${LENS_BASE_URL}/${review.metadata.protocolSlug}`

  return (
    <div className="space-y-3">
      <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
        See the protocol on{' '}
        <a
          href={lensUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-purple-600 hover:text-purple-700 underline underline-offset-2 transition-colors"
        >
          Lens
        </a>
        .
      </p>
      <p className="text-sm text-text-muted">
        Data last updated {timeAgo(review.compiledAt)}.
      </p>
    </div>
  )
}
