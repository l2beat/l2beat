import { lazy, Suspense } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useReview } from '../../data/hooks'
import { ViewModeToggle, type ViewMode } from '../../components/ViewModeToggle'

const ReportView = lazy(() => import('./views/report/ReportView').then((m) => ({ default: m.ReportView })))
const ExplorerView = lazy(() => import('./views/explorer/ExplorerView').then((m) => ({ default: m.ExplorerView })))
const DashboardView = lazy(() => import('./views/dashboard/DashboardView').then((m) => ({ default: m.DashboardView })))

function isValidView(v: string | null): v is ViewMode {
  return v === 'report' || v === 'explorer' || v === 'dashboard'
}

export function ReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: review, isLoading, error } = useReview(slug ?? '')
  const [searchParams, setSearchParams] = useSearchParams()

  const viewParam = searchParams.get('view')
  const view: ViewMode = isValidView(viewParam) ? viewParam : 'report'

  function handleViewChange(mode: ViewMode) {
    setSearchParams({ view: mode }, { replace: true })
  }

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
          <h2 className="text-lg font-semibold text-red-900">Failed to load review</h2>
          <p className="mt-2 text-sm text-red-700">
            The review data for this protocol could not be loaded.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-purple-600 hover:text-purple-800 font-medium"
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
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-purple-600 transition-colors mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all reviews
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {review.metadata.protocolName}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {review.metadata.chain} &middot;{' '}
              <span className="capitalize">{review.metadata.projectType}</span>
              {review.metadata.tokenName && (
                <> &middot; {review.metadata.tokenName}</>
              )}
            </p>
          </div>
          <ViewModeToggle current={view} onChange={handleViewChange} />
        </div>
      </div>

      {/* View content */}
      <Suspense
        fallback={
          <div className="py-12 text-center text-text-muted">Loading view...</div>
        }
      >
        {view === 'report' && <ReportView review={review} />}
        {view === 'explorer' && <ExplorerView review={review} />}
        {view === 'dashboard' && <DashboardView review={review} />}
      </Suspense>

      {/* Review metadata footer */}
      <div className="mt-16 pt-6 border-t border-border text-center">
        <p className="text-xs text-text-muted">
          This review was compiled on{' '}
          {new Date(review.compiledAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          . Protocol data may have changed since then. Always verify current on-chain state before making financial decisions.
        </p>
      </div>
    </div>
  )
}
