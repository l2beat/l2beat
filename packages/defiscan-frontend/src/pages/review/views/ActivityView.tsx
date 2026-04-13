import { useMemo, useState } from 'react'
import type { ActivityEvent, CompiledReview } from '../../../types'
import {
  etherscanTxUrl,
  etherscanUrl,
  stripChainPrefix,
  truncateAddress,
} from '../../../utils/format'
import { ProtocolLogo } from '../../../components/ProtocolLogo'
import { describeActivityEvent } from './activityDescription'

function eventContractAddress(event: ActivityEvent): string {
  return event.type === 'upgrade' ? event.contractAddress : event.address
}

function eventContractName(event: ActivityEvent): string {
  if (event.type === 'upgrade') return event.contractName
  return event.contractName ?? truncateAddress(event.address)
}

function eventKey(event: ActivityEvent, index: number): string {
  if (event.type === 'upgrade') return `${event.txHash}-${index}`
  return event.id
}

interface ActivityViewProps {
  review: CompiledReview
}

type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 10

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${mo}-${day} ${h}:${min}`
}

function truncateTx(txHash: string): string {
  const raw = stripChainPrefix(txHash)
  const hex = raw.startsWith('0x') ? raw : `0x${raw}`
  if (hex.length <= 12) return hex
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`
}

function formatRelative(iso: string | undefined): string {
  if (!iso) return '—'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return '—'
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (diffSec < 60) return `${diffSec}s ago`
  const min = Math.floor(diffSec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  const mo = Math.floor(day / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(day / 365)}y ago`
}

export function ActivityView({ review }: ActivityViewProps) {
  const events = review.activity ?? []
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    const copy = [...events]
    copy.sort((a, b) => {
      const cmp =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortDir === 'desc' ? -cmp : cmp
    })
    return copy
  }, [events, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = sorted.slice(start, start + PAGE_SIZE)
  const rangeStart = sorted.length === 0 ? 0 : start + 1
  const rangeEnd = Math.min(start + PAGE_SIZE, sorted.length)

  function toggleSort() {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    setPage(1)
  }

  const monitoredContracts = review.totals.contractCount
  const lastVerified = formatRelative(review.compiledAt)
  const protocolName = review.metadata.protocolName
  const protocolSlug = review.metadata.protocolSlug
  const description = review.metadata.description

  return (
    <div className="flex flex-col gap-8 pt-2">
      {/* Hero: Protocol header + stats grid */}
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: logo + name + description */}
        <div className="flex max-w-[480px] flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-white p-[9px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <ProtocolLogo
                slug={protocolSlug}
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="font-bold text-3xl text-text-primary tracking-[-0.6px]">
              {protocolName}
            </h1>
          </div>
          {description && (
            <p className="line-clamp-3 text-sm text-text-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Right: stats grid */}
        <div className="grid w-full grid-cols-3 gap-6 rounded-xl border border-border bg-bg-card px-6 py-5 lg:w-auto lg:min-w-[560px]">
          <StatCell
            label="Total Updates"
            value={String(events.length)}
            accent
          />
          <StatCell
            label="Monitored Contracts"
            value={String(monitoredContracts)}
            accent
          />
          <StatCell label="Last Verified" value={lastVerified} />
        </div>
      </div>

      {/* Notification Channels */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold text-lg text-text-primary">
            Notification Channels
          </h2>
          <p className="text-sm text-text-muted">
            Real-time alerts for trust surface changes.
          </p>
        </div>
        <div className="flex w-full max-w-md cursor-not-allowed items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-4 opacity-60">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-card text-text-muted">
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-[15px] text-text-primary">
                Telegram Feed
              </p>
              <p className="text-text-muted text-xs uppercase tracking-wider">
                Upcoming
              </p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-sm border border-border bg-bg-card px-2 py-0.5 font-bold text-[10px] text-text-muted uppercase tracking-wider">
            Soon
          </span>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-2xl text-text-primary leading-8 tracking-[-0.6px]">
            Protocol Activity
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">
            Comprehensive log of administrative and structural modifications.
          </p>
        </div>
        {events.length > 0 && (
          <button
            onClick={toggleSort}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-white px-3.5 py-2 font-medium text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          >
            {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
            <svg
              className={`h-4 w-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <svg
              className="size-12 text-text-muted/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-medium text-base text-text-primary">
              No activity recorded yet
            </h3>
            <p className="text-sm text-text-muted">
              Contract upgrades will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full sm:table">
              <thead className="border-border border-b bg-bg-card">
                <tr>
                  <th className="w-[210px] px-6 py-4 text-left font-bold text-[11px] text-text-muted uppercase tracking-[0.1em]">
                    Date
                  </th>
                  <th className="w-[200px] px-6 py-4 text-left font-bold text-[11px] text-text-muted uppercase tracking-[0.1em]">
                    Update Type
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-[11px] text-text-muted uppercase tracking-[0.1em]">
                    Description
                  </th>
                  <th className="w-[180px] px-6 py-4 text-left font-bold text-[11px] text-text-muted uppercase tracking-[0.1em]">
                    Source
                  </th>
                  <th className="w-[140px] px-6 py-4 text-right font-bold text-[11px] text-text-muted uppercase tracking-[0.1em]">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((event, i) => {
                  const isDep = !!event.isDependency
                  const contractAddr = eventContractAddress(event)
                  const contractLabel = eventContractName(event)
                  return (
                    <tr
                      key={eventKey(event, i)}
                      className="border-border/30 border-b last:border-b-0"
                    >
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-[12px] text-text-primary">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <UpdateTypeBadge event={event} />
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="text-[14px] text-text-primary">
                          {describeActivityEvent(event)}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <a
                            href={etherscanUrl(contractAddr)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-accent hover:underline"
                            title={stripChainPrefix(contractAddr)}
                          >
                            {contractLabel}
                            <svg
                              className="size-[10px]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                          {event.type === 'upgrade' && (
                            <a
                              href={etherscanTxUrl(event.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] text-text-muted hover:text-accent transition-colors"
                              title={stripChainPrefix(event.txHash)}
                            >
                              tx: {truncateTx(event.txHash)}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <SeverityBadge isDependency={isDep} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile stacked rows */}
            <div className="flex flex-col sm:hidden">
              {visible.map((event, i) => {
                const isDep = !!event.isDependency
                const contractAddr = eventContractAddress(event)
                const contractLabel = eventContractName(event)
                return (
                  <div
                    key={eventKey(event, i)}
                    className="flex flex-col gap-2 border-border/30 border-b px-5 py-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-text-muted">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <SeverityBadge isDependency={isDep} />
                    </div>
                    <UpdateTypeBadge event={event} />
                    <p className="text-[14px] text-text-primary">
                      {describeActivityEvent(event)}
                    </p>
                    <a
                      href={etherscanUrl(contractAddr)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] text-accent hover:underline"
                      title={stripChainPrefix(contractAddr)}
                    >
                      {contractLabel}
                      <svg
                        className="size-[10px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                    {event.type === 'upgrade' && (
                      <a
                        href={etherscanTxUrl(event.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] text-text-muted hover:text-accent transition-colors w-fit"
                        title={stripChainPrefix(event.txHash)}
                      >
                        tx: {truncateTx(event.txHash)}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Pagination footer */}
      {sorted.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-text-muted uppercase tracking-wider">
            Showing {rangeStart}-{rangeEnd} of {sorted.length} updates
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  )
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-bold text-[11px] text-text-muted uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`font-bold text-2xl tracking-tight ${accent ? 'text-accent' : 'text-text-primary'}`}
      >
        {value}
      </p>
    </div>
  )
}

function UpdateTypeBadge({ event }: { event: ActivityEvent }) {
  const { label, className } = badgeMeta(event)
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-[9px] py-[3px] font-bold text-[10px] uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  )
}

function badgeMeta(event: ActivityEvent): {
  label: string
  className: string
} {
  switch (event.type) {
    case 'upgrade':
      return event.isDependency
        ? {
            label: 'Dependency Upgrade',
            className:
              'border-[rgba(107,56,212,0.2)] bg-[rgba(107,56,212,0.05)] text-[#6b38d4]',
          }
        : {
            label: 'Contract Upgrade',
            className:
              'border-[rgba(186,26,26,0.2)] bg-[rgba(186,26,26,0.05)] text-[#ba1a1a]',
          }
    case 'role-update':
      return {
        label: 'Role Update',
        className:
          'border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.05)] text-[#b45309]',
      }
    case 'data-change':
      return {
        label: 'Data Change',
        className:
          'border-[rgba(100,116,139,0.25)] bg-[rgba(100,116,139,0.05)] text-[#475569]',
      }
    case 'contract-added':
      return {
        label: 'Contract Added',
        className:
          'border-[rgba(0,125,87,0.2)] bg-[rgba(0,125,87,0.05)] text-[#006243]',
      }
    case 'contract-removed':
      return {
        label: 'Contract Removed',
        className:
          'border-[rgba(100,116,139,0.25)] bg-[rgba(100,116,139,0.05)] text-[#475569]',
      }
  }
}

function SeverityBadge({ isDependency }: { isDependency: boolean }) {
  if (isDependency) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(0,125,87,0.1)] px-2.5 py-0.5 font-bold text-[#006243] text-[10px]">
        <svg
          className="size-[10px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        Info
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,218,214,0.4)] px-2.5 py-0.5 font-bold text-[#ba1a1a] text-[10px]">
      <svg
        className="size-[10px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      High
    </span>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}) {
  // Compact page list: show first, last, current, and neighbors with ellipses
  const pages: (number | 'ellipsis')[] = []
  const window = 1
  for (let p = 1; p <= totalPages; p++) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= currentPage - window && p <= currentPage + window)
    ) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        ariaLabel="Previous page"
      >
        <svg
          className="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </PaginationButton>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="select-none px-1 text-sm text-text-muted"
          >
            …
          </span>
        ) : (
          <PaginationButton
            key={p}
            active={p === currentPage}
            onClick={() => onChange(p)}
          >
            {p}
          </PaginationButton>
        ),
      )}
      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
        ariaLabel="Next page"
      >
        <svg
          className="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </PaginationButton>
    </div>
  )
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
  ariaLabel?: string
}) {
  const base =
    'size-8 inline-flex items-center justify-center rounded-md text-sm font-medium border transition-colors'
  const state = active
    ? 'bg-accent text-white border-accent'
    : disabled
      ? 'bg-white text-text-muted/40 border-border cursor-not-allowed'
      : 'bg-white text-text-secondary border-border hover:border-accent/40 hover:text-accent'
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${state}`}
    >
      {children}
    </button>
  )
}
