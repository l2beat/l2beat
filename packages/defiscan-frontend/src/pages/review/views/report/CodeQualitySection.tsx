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

  const license0 = licenses[0]
  const license1 = licenses[1]

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
              <span className="font-mono font-bold text-[14px] text-text-muted">—</span>
            </div>
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-text-muted">Coverage</span>
                <span className="font-mono font-bold text-[14px] text-text-muted">—</span>
              </div>
              <div className="h-1.5 bg-border rounded-full mt-1">
                <div className="h-1.5 w-0 bg-accent rounded-full" />
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
          <div className="flex gap-4">
            {/* Smart Contracts license */}
            <a
              href={license0?.url ?? undefined}
              target={license0 ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-border rounded-sm p-[13px] flex flex-col gap-1 items-center"
            >
              <span className="font-bold text-[8px] uppercase text-text-muted text-center">
                {license0?.licenseScope ?? 'Smart Contracts'}
              </span>
              <div className="flex-1 flex items-center justify-center py-4">
                <span className="font-bold text-[36px] uppercase text-accent text-center leading-none">
                  {license0?.label ?? '—'}
                </span>
              </div>
            </a>
            {/* Frontend license */}
            <a
              href={license1?.url ?? undefined}
              target={license1 ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex-1 bg-white border border-border rounded-sm p-[13px] flex flex-col gap-1 items-center"
            >
              <span className="font-bold text-[8px] uppercase text-text-muted text-center">
                {license1?.licenseScope ?? 'Frontend'}
              </span>
              <div className="flex-1 flex items-center justify-center py-4">
                <span className="font-bold text-[36px] uppercase text-accent text-center leading-none">
                  {license1?.label ?? '—'}
                </span>
              </div>
            </a>
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
