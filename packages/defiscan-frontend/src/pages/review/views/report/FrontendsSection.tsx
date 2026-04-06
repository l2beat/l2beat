import { useRef } from 'react'
import type { CompiledReview } from '../../../../types'
import { SectionHeader, CarouselNav } from './_shared'

interface FrontendsSectionProps {
  review: CompiledReview
}

const SUBTYPE_LABEL: Record<string, string> = {
  official: 'Native dApp',
  'third-party': 'Third-party',
  'self-hosted': 'Self-hosted',
}

export function FrontendsSection({ review }: FrontendsSectionProps) {
  const { resources = [] } = review
  const scrollRef = useRef<HTMLDivElement>(null)
  const frontends = resources.filter((r) => r.type === 'frontend')

  if (frontends.length === 0) return null

  function scroll(dir: 'prev' | 'next') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'next' ? 304 : -304, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        icon={
          <svg className="size-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
          </svg>
        }
        label="Frontends"
        action={<CarouselNav onPrev={() => scroll('prev')} onNext={() => scroll('next')} />}
      />

      {/* Carousel */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-none">
        {frontends.map((fe, i) => {
          const hostname = (() => {
            try { return new URL(fe.url).hostname } catch { return fe.url }
          })()
          const subtypeLabel = fe.frontendSubtype
            ? (SUBTYPE_LABEL[fe.frontendSubtype] ?? fe.frontendSubtype)
            : hostname

          return (
            <a
              key={i}
              href={fe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-bg-card min-w-[280px] border border-border rounded-lg px-[25px] py-[25px] flex items-center gap-4 hover:border-accent/40 hover:shadow-sm transition-all shrink-0"
            >
              <div className="size-10 rounded bg-white border border-border flex items-center justify-center shrink-0">
                <svg className="size-5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[14px] text-text-primary">
                  {fe.label ?? hostname}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25px] text-text-muted mt-0.5">
                  {subtypeLabel}
                </p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
