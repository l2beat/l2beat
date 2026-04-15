import { useState } from 'react'
import type { ActivityEvent, CompiledReview } from '../../../../types'
import {
  truncateAddress,
  etherscanUrl,
  etherscanTxUrl,
  stripChainPrefix,
} from '../../../../utils/format'
import { describeActivityEvent } from '../activityDescription'
import { FieldChangesPanel } from '../FieldChangesPanel'
import { SectionHeader, ShowMoreButton } from './_shared'

/** Events whose `changes[]` array can be expanded to show field-level diffs. */
function isExpandable(
  event: ActivityEvent,
): event is Extract<ActivityEvent, { type: 'data-change' | 'role-update' }> {
  return event.type === 'data-change' || event.type === 'role-update'
}

interface ActivitySectionProps {
  review: CompiledReview
  onShowMore: () => void
}

function eventContractAddress(event: ActivityEvent): string {
  return event.type === 'upgrade' ? event.contractAddress : event.address
}

function eventContractName(event: ActivityEvent): string {
  if (event.type === 'upgrade') return event.contractName
  return event.contractName ?? truncateAddress(event.address)
}

function badgeMeta(event: ActivityEvent): {
  label: string
  className: string
} {
  switch (event.type) {
    case 'upgrade':
      return {
        label: 'Upgrade',
        className: 'bg-purple-100 text-purple-700',
      }
    case 'role-update':
      return {
        label: 'Role Update',
        className: 'bg-amber-100 text-amber-700',
      }
    case 'data-change':
      return {
        label: 'Data Change',
        className: 'bg-slate-100 text-slate-700',
      }
    case 'contract-added':
      return {
        label: 'Added',
        className: 'bg-emerald-100 text-emerald-700',
      }
    case 'contract-removed':
      return {
        label: 'Removed',
        className: 'bg-slate-100 text-slate-700',
      }
  }
}

export function ActivitySection({ review, onShowMore }: ActivitySectionProps) {
  const { activity } = review
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  function toggleExpand(key: string) {
    setExpandedKey((cur) => (cur === key ? null : key))
  }
  const events = activity ?? []
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  const recent = sorted.slice(0, 3)
  // Only fill in the "Monitoring Started" marker on quiet reviews: once there
  // are 3+ real events, the top-3 list is already full and the marker would
  // just be noise.
  const showMonitoringStarted = events.length < 3

  function formatDate(iso: string) {
    const d = new Date(iso)
    const y = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${y}.${mo}.${day} ${h}:${min}`
  }

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-8">
      <SectionHeader
        icon={
          <svg
            className="size-4 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        }
        label="Protocol Activity"
        action={<ShowMoreButton onClick={onShowMore} />}
      />

      {/* Timeline */}
      <div className="flex flex-col">
        {recent.map((event, i) => {
          const contractAddr = eventContractAddress(event)
          const contractLabel = eventContractName(event)
          const rawContract = stripChainPrefix(contractAddr)
          const badge = badgeMeta(event)
          const sentencePrefix = describeActivityEvent(event, {
            omitName: true,
          }).replace(/\.$/, '')
          const isLast = i === recent.length - 1
          const key = event.type === 'upgrade' ? `upgrade-${i}` : event.id
          const expandable = isExpandable(event)
          const isExpanded = expandable && expandedKey === key
          return (
            <div
              key={key}
              className={`pb-[25px] ${!isLast ? 'border-b border-border/60 mb-[25px]' : ''} ${
                expandable ? 'cursor-pointer' : ''
              }`}
              onClick={
                expandable ? () => toggleExpand(key) : undefined
              }
            >
              {/* Desktop: single row */}
              <div className="hidden sm:flex items-center gap-[32px]">
                <div className="w-[120px] shrink-0">
                  <p className="font-mono font-normal text-[12px] text-text-muted">
                    {formatDate(event.timestamp)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] shrink-0 ${badge.className}`}
                >
                  {badge.label}
                </span>
                {event.isDependency && (
                  <span className="inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] bg-orange-100 text-orange-700 shrink-0">
                    Dependency
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-text-primary truncate">
                    {contractLabel}
                    {event.entity && (
                      <span className="font-normal text-text-muted">
                        {' '}
                        ({event.entity})
                      </span>
                    )}
                  </p>
                  <p className="text-[13px] text-text-primary truncate">
                    {sentencePrefix}
                    {event.type === 'upgrade' &&
                      event.implementations.length > 0 && (
                        <>
                          :{' '}
                          {event.implementations.map((impl, idx) => (
                            <span key={impl}>
                              {idx > 0 && ', '}
                              <a
                                href={etherscanUrl(impl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="font-mono text-accent hover:underline"
                                title={stripChainPrefix(impl)}
                              >
                                {truncateAddress(impl)}
                              </a>
                            </span>
                          ))}
                        </>
                      )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <a
                    href={etherscanUrl(contractAddr)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[11px] text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                    title={rawContract}
                  >
                    {truncateAddress(rawContract)}
                    <svg
                      className="size-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
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
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[10px] text-text-muted/80 hover:text-accent transition-colors"
                      title={stripChainPrefix(event.txHash)}
                    >
                      tx: {truncateAddress(stripChainPrefix(event.txHash))}
                    </a>
                  )}
                </div>
                {expandable && (
                  <svg
                    className={`size-3 shrink-0 text-text-muted transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>

              {/* Mobile: stacked rows */}
              <div className="flex flex-col gap-1.5 sm:hidden">
                {/* Row 1: badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] shrink-0 ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                  {event.isDependency && (
                    <span className="inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] bg-orange-100 text-orange-700 shrink-0">
                      Dependency
                    </span>
                  )}
                </div>
                {/* Row 2: contract name */}
                <p className="font-semibold text-[14px] text-text-primary truncate">
                  {contractLabel}
                  {event.entity && (
                    <span className="font-normal text-text-muted">
                      {' '}
                      ({event.entity})
                    </span>
                  )}
                </p>
                {/* Row 3: descriptive sentence with implementation link(s) */}
                <p className="text-[13px] text-text-primary">
                  {sentencePrefix}
                  {event.type === 'upgrade' &&
                    event.implementations.length > 0 && (
                      <>
                        :{' '}
                        {event.implementations.map((impl, idx) => (
                          <span key={impl}>
                            {idx > 0 && ', '}
                            <a
                              href={etherscanUrl(impl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-accent hover:underline"
                              title={stripChainPrefix(impl)}
                            >
                              {truncateAddress(impl)}
                            </a>
                          </span>
                        ))}
                      </>
                    )}
                </p>
                {/* Row 4: date + contract link (+ tx for upgrades) */}
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-mono font-normal text-[12px] text-text-muted">
                    {formatDate(event.timestamp)}
                  </p>
                  <span className="text-text-muted/40">|</span>
                  <a
                    href={etherscanUrl(contractAddr)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[11px] text-text-muted hover:text-accent transition-colors flex items-center gap-1"
                    title={rawContract}
                  >
                    {truncateAddress(rawContract)}
                    <svg
                      className="size-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                  {event.type === 'upgrade' && (
                    <>
                      <span className="text-text-muted/40">|</span>
                      <a
                        href={etherscanTxUrl(event.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-[11px] text-text-muted hover:text-accent transition-colors"
                        title={stripChainPrefix(event.txHash)}
                      >
                        tx: {truncateAddress(stripChainPrefix(event.txHash))}
                      </a>
                    </>
                  )}
                  {expandable && (
                    <svg
                      className={`size-3 text-text-muted transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {isExpanded && expandable && (
                <div className="mt-3">
                  <FieldChangesPanel
                    changes={event.changes}
                    roleName={
                      event.type === 'role-update'
                        ? event.roleName
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          )
        })}

        {showMonitoringStarted && (
          <div
            className={
              recent.length > 0
                ? 'pt-[25px] border-t border-border/60'
                : ''
            }
          >
            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-[32px]">
              <div className="w-[120px] shrink-0">
                <p className="font-mono font-normal text-[12px] text-text-muted">
                  {formatDate(review.publishedAt)}
                </p>
              </div>
              <span className="inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] shrink-0 bg-emerald-100 text-emerald-700">
                Monitoring Started
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-text-primary truncate">
                  {review.metadata.protocolName}
                </p>
                <p className="text-[13px] text-text-primary truncate">
                  Continuous monitoring of this protocol began on this date.
                </p>
              </div>
              <div className="w-[1px] shrink-0" />
            </div>
            {/* Mobile */}
            <div className="flex flex-col gap-1.5 sm:hidden">
              <span className="inline-flex items-center px-[8px] py-[2px] rounded-sm text-[9px] font-bold uppercase tracking-[0.225px] self-start bg-emerald-100 text-emerald-700">
                Monitoring Started
              </span>
              <p className="font-semibold text-[14px] text-text-primary">
                {review.metadata.protocolName}
              </p>
              <p className="text-[13px] text-text-primary">
                Continuous monitoring of this protocol began on this date.
              </p>
              <p className="font-mono font-normal text-[12px] text-text-muted">
                {formatDate(review.publishedAt)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
