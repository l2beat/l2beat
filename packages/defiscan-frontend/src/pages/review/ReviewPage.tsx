import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { TYPE_LABELS } from '../../components/ProtocolTypeBadge'
import { ShareButton } from '../../components/ShareButton'
import { type ViewMode, ViewModeToggle } from '../../components/ViewModeToggle'
import { useReview } from '../../data/hooks'

const ReportView = lazy(() =>
  import('./views/report/ReportView').then((m) => ({ default: m.ReportView })),
)
const ExplorerView = lazy(() =>
  import('./views/explorer/ExplorerView').then((m) => ({
    default: m.ExplorerView,
  })),
)
const ActivityView = lazy(() =>
  import('./views/ActivityView').then((m) => ({
    default: m.ActivityView,
  })),
)

function isValidView(v: string | null): v is ViewMode {
  return v === 'report' || v === 'explorer' || v === 'activity'
}

export function ReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: review, isLoading, error } = useReview(slug ?? '')
  const [searchParams, setSearchParams] = useSearchParams()

  const viewParam = searchParams.get('view')
  const view: ViewMode = isValidView(viewParam) ? viewParam : 'report'
  const [forceExpanded, setForceExpanded] = useState(false)

  function handleViewChange(mode: ViewMode) {
    setSearchParams({ view: mode }, { replace: true })
  }

  const handleExportPdf = useCallback(() => {
    setForceExpanded(true)
    // Use requestAnimationFrame to ensure state is flushed before printing
    requestAnimationFrame(() => {
      window.print()
    })
  }, [])

  // Reset forceExpanded after print dialog closes
  useEffect(() => {
    function onAfterPrint() {
      setForceExpanded(false)
    }
    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-bg-muted" />
          <div className="h-4 w-96 rounded bg-bg-muted" />
          <div className="h-48 rounded-2xl bg-bg-muted" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-bg-muted" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="font-semibold text-lg text-red-900">
            Failed to load review
          </h2>
          <p className="mt-2 text-red-700 text-sm">
            The review data for this protocol could not be loaded.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block font-medium text-purple-600 hover:text-purple-800"
          >
            Back to all reviews
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Back nav + Protocol header + View toggle */}
      <div className="mb-6 print:hidden">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-purple-600 print:hidden"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to all reviews
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-bold text-3xl text-text-primary">
              {review.metadata.protocolName}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {review.metadata.chain} &middot;{' '}
              {TYPE_LABELS[review.metadata.projectType] ??
                review.metadata.projectType}
              {review.metadata.tokenName && (
                <> &middot; {review.metadata.tokenName}</>
              )}
            </p>
          </div>
          <div className="print:hidden">
            <ViewModeToggle current={view} onChange={handleViewChange}>
              <ShareButton review={review} onExportPdf={handleExportPdf} />
            </ViewModeToggle>
          </div>
        </div>
      </div>

      {/* View content */}
      <Suspense
        fallback={
          <div className="py-12 text-center text-text-muted">
            Loading view...
          </div>
        }
      >
        {view === 'report' && (
          <ReportView review={review} forceExpanded={forceExpanded} />
        )}
        {view === 'explorer' && <ExplorerView review={review} />}
        {view === 'activity' && <ActivityView review={review} />}
      </Suspense>
    </div>
  )
}
