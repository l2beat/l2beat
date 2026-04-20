import { useRef } from 'react'
import type { CompiledReview } from '../../../../types'
import { SectionHeader, CarouselNav } from './_shared'

interface CodeQualitySectionProps {
  review: CompiledReview
}

export function CodeQualitySection({ review }: CodeQualitySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { totals, resources = [] } = review
  const audits = [...(review.audits ?? [])].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  const licenses = resources.filter((r) => r.type === 'license')
  const maxBountyAudit = audits.reduce<(typeof audits)[0] | null>(
    (best, a) => ((a.bounty ?? 0) > (best?.bounty ?? 0) ? a : best),
    null,
  )
  const maxBounty = maxBountyAudit?.bounty ?? 0

  function formatBounty(amount: number): string {
    if (amount >= 1_000_000) return `$${amount / 1_000_000}M`
    if (amount >= 1_000) return `$${amount / 1_000}K`
    return `$${amount.toLocaleString()}`
  }

  function scroll(dir: 'prev' | 'next') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'next' ? 304 : -304, behavior: 'smooth' })
  }

  const maxLabelLen = licenses.reduce((m, l) => Math.max(m, l.label?.length ?? 0), 0)
  // 1–3 licenses: single row of N tiles. 4+ licenses: wrap to a 2-column grid
  // so each tile gets the width of the 2-license case instead of cramping.
  const useTwoColumnGrid = licenses.length >= 4
  const tilesPerRow = useTwoColumnGrid ? 2 : Math.max(licenses.length, 1)
  // Outer sub-card content ≈ 240px (narrower on mid-width screens), gaps = (tilesPerRow-1)*4px,
  // tile px-1.5 = 12px + safety margin 8px so long labels (e.g. GPL-3.0) don't hit the edge.
  const approxTileWidth = Math.floor((240 - (tilesPerRow - 1) * 4) / tilesPerRow - 20)
  // Bold uppercase glyph width ≈ 0.68 × font-size (empirical, beats the old 0.55 estimate).
  const fitSize = Math.floor(approxTileWidth / Math.max(maxLabelLen, 1) / 0.68)
  const licenseLabelPx = Math.max(10, Math.min(28, fitSize || 28))
  const licenseScopeSize = 'text-[8px]'

  return (
    <div className="bg-bg-card border border-border rounded-lg p-5 sm:p-[33px] flex flex-col gap-8">
      <SectionHeader
        icon={
          <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
        }
        label="Source Code"
      />

      {/* 3 sub-cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-x-[20px]">
        {/* Source Code Verification */}
        <div className="bg-white border border-border rounded-lg p-[25px] flex flex-col gap-6">
          <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
            Source Code Verification
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-muted">Number of contracts</span>
              <span className="font-mono font-bold text-[14px] text-text-primary">
                {totals.contractCount} Contracts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-muted">Lines of Code</span>
              <span className={`font-mono font-bold text-[14px] ${totals.linesOfCode ? 'text-text-primary' : 'text-text-muted'}`}>
                {totals.linesOfCode ? `${totals.linesOfCode.toLocaleString()} LoC` : '—'}
              </span>
            </div>
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-text-muted">Coverage</span>
                <span className={`font-mono font-bold text-[14px] ${totals.coverage !== undefined ? 'text-text-primary' : 'text-text-muted'}`}>
                  {totals.coverage !== undefined ? `${totals.coverage}%` : '—'}
                </span>
              </div>
              <div className="h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                <div
                  className="h-1.5 bg-accent rounded-full transition-[width]"
                  style={{ width: `${totals.coverage ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Audits & Bug Bounties */}
        <div className="bg-white border border-border rounded-lg p-[25px] flex flex-col gap-6">
          <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
            Audits &amp; Bug Bounties
          </p>
          <div className="flex flex-col gap-3">
            {/* Audits row */}
            <div className="flex items-center h-[48px] gap-1">
              <div className="w-[127px] shrink-0 flex items-center justify-center">
                <span className="font-mono font-bold text-[36px] leading-none text-accent">
                  {audits.length > 0 ? audits.length : '—'}
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                  security audits
                </span>
              </div>
            </div>
            {/* Bug bounty row */}
            {maxBountyAudit ? (
              <a
                href={maxBountyAudit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center h-[48px] gap-1 hover:opacity-75 transition-opacity"
              >
                <div className="w-[127px] shrink-0 flex items-center justify-center">
                  <span className="font-mono font-bold text-[36px] leading-none text-accent">
                    {maxBounty > 0 ? formatBounty(maxBounty) : '—'}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                    Bug Bounty
                  </span>
                </div>
              </a>
            ) : (
              <div className="flex items-center h-[48px] gap-1">
                <div className="w-[127px] shrink-0 flex items-center justify-center">
                  <span className="font-mono font-bold text-[36px] leading-none text-accent">—</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="font-bold text-[14px] uppercase text-text-muted text-center">
                    Bug Bounty
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Licensing */}
        <div className="bg-white border border-border rounded-lg px-[25px] pt-[25px] pb-[27px] flex flex-col gap-6">
          <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
            Licensing
          </p>
          <div className={useTwoColumnGrid ? 'grid grid-cols-2 gap-1' : 'flex gap-1'}>
            {licenses.length === 0 ? (
              <div className="flex-1 bg-white border border-border rounded-sm px-1.5 py-[13px] flex flex-col gap-1 items-center">
                <span className="font-bold text-[8px] uppercase text-text-muted text-center">
                  License
                </span>
                <div className="flex-1 flex items-center justify-center py-4">
                  <span className="font-bold text-[36px] uppercase text-accent text-center leading-none">
                    —
                  </span>
                </div>
              </div>
            ) : (
              licenses.map((license, i) => (
                <a
                  key={`license-${i}`}
                  href={license.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 bg-white border border-border rounded-sm px-1.5 py-[13px] flex flex-col gap-1 items-center"
                >
                  <span
                    className={`font-bold ${licenseScopeSize} uppercase text-text-muted text-center truncate max-w-full`}
                    title={license.licenseScope}
                  >
                    {license.licenseScope ?? 'License'}
                  </span>
                  <div className="flex-1 flex items-center justify-center py-4 w-full">
                    <span
                      className="font-bold uppercase text-accent text-center leading-none truncate max-w-full"
                      style={{ fontSize: `${licenseLabelPx}px` }}
                      title={license.label}
                    >
                      {license.label ?? '—'}
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Audit Reports Carousel */}
      {audits.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
              Audit Reports
            </p>
            <CarouselNav onPrev={() => scroll('prev')} onNext={() => scroll('next')} />
          </div>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
            {audits.map((audit, i) => (
              <a
                key={`audit-${i}`}
                href={audit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white min-w-[280px] border border-border rounded-lg px-[25px] py-[25px] flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all shrink-0"
              >
                <div className="size-10 rounded bg-white border border-border flex items-center justify-center shrink-0">
                  <svg className="size-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[14px] text-text-primary truncate">{audit.author}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{audit.date}</p>
                  {audit.scope && (
                    <p className="text-[10px] uppercase tracking-[0.25px] text-text-muted mt-0.5 truncate">{audit.scope}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
