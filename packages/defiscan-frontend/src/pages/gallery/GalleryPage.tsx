import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import { useIndex, useAllReviews } from '../../data/hooks'
import { deriveRadarData } from '../../utils/radar'
import { formatUsdValue } from '../../utils/format'
import { isHumanAdminType } from '../../utils/admins'
import { ProtocolLogo } from '../../components/ProtocolLogo'
import { getLatestActivityTimestamp } from '../review/views/activityTimestamp'
import {
  StatusPill,
  STATUS_FILTER_LABELS,
  type ReviewStatus,
} from '../review/views/StatusPill'
import type { CompiledReview, ProtocolSummary, CompiledAdmin, CompiledDependency } from '../../types'

const PAGE_SIZE_MOBILE = 12
const PAGE_SIZE_DESKTOP = 24

const ACCENT_COLOR = '#2563eb'
const ACCENT_GRID_COLOR = 'rgba(37,99,235,0.12)'

type Status = ReviewStatus

// ─── Helpers ──────────────────────────────────────────────────────────────────

// `verified` is sourced from index.json (compile-data.ts copies it from
// CompiledReview.verified). Missing on legacy data → treated as verified.
function statusFromVerified(verified: boolean | undefined): Status {
  return verified === false ? 'unverified' : 'verified'
}

function adminSummary(admins: CompiledAdmin[]): string {
  const human = admins.filter((a) => isHumanAdminType(a.adminType))
  if (human.length === 0) return 'No Admins'
  const counts = new Map<string, number>()
  for (const a of human) {
    const label =
      a.adminType === 'Multisig'
        ? 'multisig'
        : a.adminType === 'EOA' || a.adminType === 'EOAPermissioned'
          ? 'EOA'
          : a.adminType === 'Timelock'
            ? 'timelock'
            : a.adminType.toLowerCase()
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([t, n]) => `${n} ${n === 1 ? t : t + 's'}`)
    .join(', ')
}

function depEntities(deps: CompiledDependency[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const d of deps) {
    if (d.entity && !seen.has(d.entity)) {
      seen.add(d.entity)
      result.push(d.entity)
    }
  }
  return result
}

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'Today'
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years !== 1 ? 's' : ''} ago`
}

function buildPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

// ─── Meta tag ─────────────────────────────────────────────────────────────────

function MetaTag({ label }: { label: string }) {
  return (
    <span className="inline-block px-1.5 py-0.5 rounded-sm bg-border/60 text-[10px] font-medium text-text-muted">
      {label}
    </span>
  )
}

// ─── Protocol Card ────────────────────────────────────────────────────────────

function ProtocolCard({
  protocol,
  review,
}: {
  protocol: ProtocolSummary
  review: CompiledReview | undefined
}) {
  const tvl = protocol.totals.totalCapitalAtRisk
  const token =
    protocol.totals.totalTokenValue ?? protocol.totals.totalTokenValueAtRisk
  const tvs = tvl + token

  // Prefer the per-review value when available (most accurate) but fall back
  // to the index summary so the pill renders on first paint, before reviews
  // finish loading.
  const verified =
    review !== undefined ? review.verified : protocol.verified

  const adminsText = review
    ? adminSummary(review.admins)
    : protocol.totals.adminCount > 0
      ? `${protocol.totals.adminCount} admin${protocol.totals.adminCount !== 1 ? 's' : ''}`
      : 'No Admins'

  const entities = review ? depEntities(review.dependencies) : []
  const hasDeps = review
    ? review.dependencies.length > 0
    : protocol.totals.dependencyCount > 0

  const lastActivity = (() => {
    if (!review) return null
    const newest = getLatestActivityTimestamp(review)
    return newest ? relativeTime(newest) : 'Not monitored'
  })()

  const radarData = review ? deriveRadarData(review) : null

  return (
    <div className="flex flex-col rounded-xl border border-border bg-bg-card overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between p-6 pb-3">
        <div className="flex items-center gap-4 min-w-0">
          <div className="size-12 rounded bg-white border border-hover flex items-center justify-center shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[9px]">
            <ProtocolLogo slug={protocol.slug} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-text-primary truncate">
              {protocol.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <MetaTag label={protocol.chain} />
              <MetaTag label={protocol.projectType} />
            </div>
          </div>
        </div>
        <StatusPill verified={verified !== false} variant="card" />
      </div>

      {/* Radar chart */}
      <div className="px-5 py-2 h-[180px]">
        {radarData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="60%">
              <PolarGrid stroke={ACCENT_GRID_COLOR} />
              <PolarAngleAxis dataKey="axis" tick={false} />
              <Radar
                dataKey="value"
                stroke={ACCENT_COLOR}
                strokeOpacity={0.7}
                fill={ACCENT_COLOR}
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="size-20 rounded-full border-2 border-border/60 animate-pulse" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-5 pb-4 flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Total Value Secured</span>
          <span className="font-semibold text-text-primary font-mono">
            {formatUsdValue(tvs)}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-text-muted shrink-0">Admins</span>
          <span className="font-medium text-text-primary text-right">
            {adminsText}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <span className="text-text-muted shrink-0">Dependencies</span>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            {!hasDeps ? (
              <span className="font-medium text-text-primary">
                No Dependencies
              </span>
            ) : entities.length > 0 ? (
              <>
                {entities.slice(0, 3).map((e) => (
                  <MetaTag key={e} label={e} />
                ))}
                {entities.length > 3 && (
                  <span className="text-text-muted">
                    +{entities.length - 3}
                  </span>
                )}
              </>
            ) : (
              <span className="font-medium text-text-primary">
                {protocol.totals.dependencyCount} dep
                {protocol.totals.dependencyCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
        {lastActivity !== null && (
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Last Activity</span>
            <span
              className={`font-medium ${lastActivity === 'Not monitored' ? 'text-text-muted' : 'text-text-primary'}`}
            >
              {lastActivity}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 flex flex-col gap-3">
        <Link
          to={`/protocol/${protocol.slug}`}
          className="block w-full text-center bg-accent-dark text-white text-xs font-bold uppercase tracking-[1px] py-3 rounded hover:bg-accent-dark/80 transition-colors"
        >
          View Detailed Report
        </Link>
      </div>
    </div>
  )
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
  activeClass,
}: {
  label: string
  active: boolean
  onClick: () => void
  activeClass?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-sm text-xs font-semibold transition-colors ${
        active
          ? (activeClass ?? 'bg-accent text-white')
          : 'border border-border text-text-muted bg-white hover:border-accent/40'
      }`}
    >
      {label}
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function GalleryPage() {
  const { data: indexData, isLoading: indexLoading } = useIndex()
  const { data: allReviews } = useAllReviews()

  const [ecosystemFilter, setEcosystemFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [activeStatuses, setActiveStatuses] = useState<Set<Status>>(
    new Set(['verified', 'unverified']),
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () =>
      setPageSize(mq.matches ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const protocols = indexData?.protocols ?? []

  const reviewMap = useMemo(() => {
    const map = new Map<string, CompiledReview>()
    if (allReviews) {
      for (const r of allReviews) map.set(r.metadata.protocolSlug, r)
    }
    return map
  }, [allReviews])

  const ecosystems = useMemo(() => {
    const chains = [...new Set(protocols.map((p) => p.chain))].sort()
    return ['All', ...chains]
  }, [protocols])

  const types = useMemo(() => {
    const ts = [...new Set(protocols.map((p) => p.projectType))].sort()
    return ['All', ...ts]
  }, [protocols])

  function toggleStatus(s: Status) {
    setActiveStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = protocols

    if (ecosystemFilter !== 'All') {
      list = list.filter((p) => p.chain === ecosystemFilter)
    }
    if (typeFilter !== 'All') {
      list = list.filter((p) => p.projectType === typeFilter)
    }
    list = list.filter((p) => {
      const review = reviewMap.get(p.slug)
      // Prefer the per-review value when available; fall back to the index
      // summary so the filter works before reviews finish loading.
      const verified = review !== undefined ? review.verified : p.verified
      return activeStatuses.has(statusFromVerified(verified))
    })

    const tvsOf = (p: ProtocolSummary) => {
      const tvl = p.totals.totalCapitalAtRisk
      const token = p.totals.totalTokenValue ?? p.totals.totalTokenValueAtRisk
      return tvl + token
    }
    list = [...list].sort((a, b) => tvsOf(b) - tvsOf(a))

    return list
  }, [protocols, ecosystemFilter, typeFilter, activeStatuses, reviewMap])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )
  const showingFrom = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const showingTo = Math.min(safePage * pageSize, filtered.length)

  const pageNumbers = buildPageNumbers(safePage, totalPages)

  if (indexLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <p className="text-text-muted">Loading protocols...</p>
        </div>
      </div>
    )
  }

  if (!indexData) {
    return (
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <p className="text-status-red">Failed to load data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Protocol Gallery
        </h1>
        <p className="mt-2 text-text-secondary max-w-[560px]">
          Institutional-grade trust surface assessments. Scrutinize
          upgradeability patterns, oracle dependencies, and governance
          concentration across the DeFi ecosystem.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap items-start gap-6 border-b border-border pb-6">
        {/* Ecosystem */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[1.2px] shrink-0">
            Ecosystem
          </span>
          {ecosystems.map((e) => (
            <FilterPill
              key={e}
              label={e}
              active={ecosystemFilter === e}
              onClick={() => {
                setEcosystemFilter(e)
                setPage(1)
              }}
            />
          ))}
        </div>

        {/* Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[1.2px] shrink-0">
            Type
          </span>
          {types.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={typeFilter === t}
              onClick={() => {
                setTypeFilter(t)
                setPage(1)
              }}
            />
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[1.2px] shrink-0">
            Status
          </span>
          {(['verified', 'unverified'] as Status[]).map((s) => (
            <FilterPill
              key={s}
              label={STATUS_FILTER_LABELS[s]}
              active={activeStatuses.has(s)}
              onClick={() => toggleStatus(s)}
              activeClass={
                s === 'verified'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700' // unverified
              }
            />
          ))}
        </div>
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <p className="text-text-muted py-12 text-center">
          No protocols match the selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageItems.map((p) => (
            <ProtocolCard
              key={p.slug}
              protocol={p}
              review={reviewMap.get(p.slug)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <span className="text-text-muted text-xs">
            Showing {showingFrom}–{showingTo} of {filtered.length} assessments
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="size-8 flex items-center justify-center rounded border border-border text-text-muted hover:border-accent/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            {pageNumbers.map((n, i) =>
              n === '…' ? (
                <span key={`ellipsis-${i}`} className="px-1 text-text-muted">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  className={`size-8 flex items-center justify-center rounded text-xs font-semibold transition-colors ${
                    n === safePage
                      ? 'bg-accent text-white'
                      : 'border border-border text-text-muted hover:border-accent/40'
                  }`}
                >
                  {n}
                </button>
              ),
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="size-8 flex items-center justify-center rounded border border-border text-text-muted hover:border-accent/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
