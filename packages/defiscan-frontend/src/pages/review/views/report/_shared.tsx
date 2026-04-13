import type { ReactNode } from 'react'
import { formatUsdValue } from '../../../../utils/format'

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

/** Compute impacted TVS percentage, capped at 100%. */
export function impactPct(capital: number, totalTvs: number): number {
  return totalTvs > 0 ? Math.min(100, Math.round((capital / totalTvs) * 100)) : 0
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

interface ImpactBarRowProps {
  /** Row title (e.g. admin name or dependency entity). */
  title: string
  /** Inline elements shown next to the title: etherscan link, type badge, mitigation badges, etc. */
  badges?: ReactNode
  /** Raw USD impact — formatted via formatUsdValue, or rendered as "—" when zero. */
  impactUsd: number
  /** Bar fill as 0–100. A tiny 1% minimum is applied when non-zero so the bar stays visible. */
  barPercent: number
}

/**
 * Shared row for the Top Admins / Top Dependencies lists in the report view.
 * Previously duplicated across AdminsSection and DependenciesSection with drifted spacing.
 */
export function ImpactBarRow({ title, badges, impactUsd, barPercent }: ImpactBarRowProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-text-primary">{title}</span>
          {badges}
        </div>
        <span className="font-mono font-bold text-sm text-text-primary shrink-0 ml-2">
          {impactUsd > 0 ? `${formatUsdValue(impactUsd)} Impact` : '—'}
        </span>
      </div>
      <div className="h-[10px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all"
          style={{ width: `${Math.max(barPercent, barPercent > 0 ? 1 : 0)}%` }}
        />
      </div>
    </div>
  )
}

export interface ImpactStat {
  label: string
  value: ReactNode
  description?: ReactNode
}

interface ImpactStatsSidebarProps {
  stats: ImpactStat[]
}

/**
 * Shared sidebar that renders a vertical stack of headline stats next to the
 * Top Admins / Top Dependencies list. Keeps number size + inner gap + stat
 * dividers consistent across report sections.
 */
export function ImpactStatsSidebar({ stats }: ImpactStatsSidebarProps) {
  return (
    <div className="sm:w-[312px] sm:shrink-0 flex flex-row sm:flex-col justify-between sm:justify-start gap-6 sm:gap-[24px] bg-bg-card rounded-lg p-6 sm:p-[33px]">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={
            i > 0
              ? 'sm:border-t sm:border-border sm:pt-6 flex flex-col gap-1'
              : 'flex flex-col gap-1'
          }
        >
          <p className="font-bold text-[10px] uppercase text-text-muted tracking-[0.5px]">
            {stat.label}
          </p>
          <p className="font-mono font-bold text-[36px] leading-[36px] text-text-primary">
            {stat.value}
          </p>
          {stat.description !== undefined && stat.description !== null && (
            <p className="text-xs text-text-muted mt-1">{stat.description}</p>
          )}
        </div>
      ))}
    </div>
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
