import { useRef } from 'react'
import type { CompiledReview } from '../../../../types'
import { getKeyFindings, type KeyFinding } from '../../../../utils/keyFindings'
import { CarouselNav, SectionHeader } from './_shared'

interface KeyFindingsCarouselProps {
  review: CompiledReview
}

const BG_BY_TYPE: Record<KeyFinding['type'], string> = {
  positive: 'bg-capital/10',
  warning: 'bg-token/10',
  critical: 'bg-status-red/5',
  info: 'bg-bg-card',
}

export function KeyFindingsCarousel({ review }: KeyFindingsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const findings = getKeyFindings(review)

  function scroll(dir: 'prev' | 'next') {
    const el = scrollRef.current
    if (!el) return
    const amount = 364 // card width + gap
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  if (findings.length === 0) return null

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        icon={
          <svg
            className="size-[18px] text-accent"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.423.474L8.687 19.5h6.626l1.026 3.237a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
              clipRule="evenodd"
            />
          </svg>
        }
        label="Key Findings"
        action={
          <CarouselNav
            onPrev={() => scroll('prev')}
            onNext={() => scroll('next')}
          />
        }
      />

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="scrollbar-none flex gap-6 overflow-x-auto pb-4"
      >
        {findings.map((finding, i) => (
          <div
            key={i}
            className={`flex w-[280px] shrink-0 flex-col gap-2 rounded-lg border border-border p-6 sm:w-[340px] sm:p-[33px] ${BG_BY_TYPE[finding.type]}`}
          >
            <p className="font-bold text-[18px] text-text-primary leading-[28px]">
              {finding.title}
            </p>
            <p className="font-normal text-[14px] text-text-muted leading-[22.75px]">
              {finding.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
