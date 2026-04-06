import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  label: string
  action?: ReactNode
}

export function SectionHeader({ icon, label, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-bold text-[12px] uppercase text-text-muted tracking-[1.2px]">
          {label}
        </span>
      </div>
      {action}
    </div>
  )
}

interface ShowMoreButtonProps {
  onClick: () => void
}

export function ShowMoreButton({ onClick }: ShowMoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 font-bold text-[11px] uppercase text-accent tracking-[1.1px] hover:text-accent-dark transition-colors"
    >
      Show More
      <svg
        className="size-[9px]"
        viewBox="0 0 9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M1 4.5h7m-3-3 3 3-3 3" />
      </svg>
    </button>
  )
}

interface CarouselNavProps {
  onPrev: () => void
  onNext: () => void
}

export function CarouselNav({ onPrev, onNext }: CarouselNavProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="border border-border rounded-full p-[7px] hover:bg-hover transition-colors"
        aria-label="Previous"
      >
        <svg
          className="h-[7px] w-[4px]"
          viewBox="0 0 4 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 1L1 3.5l2.5 2.5" />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="border border-border rounded-full p-[7px] hover:bg-hover transition-colors"
        aria-label="Next"
      >
        <svg
          className="h-[7px] w-[4px]"
          viewBox="0 0 4 7"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0.5 1L3 3.5 0.5 6" />
        </svg>
      </button>
    </div>
  )
}
