import { useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import type { RecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { OVERVIEW_CARD_PADDING_CLASS } from './overviewChartHeight'
import { OVERVIEW_WIDGET_TITLE_CLASS } from './overviewResponsive'
import { RecentChangesDialog } from './RecentChangesDialog'

interface Props {
  recentChanges: RecentChangesOverview
  className?: string
}

export function OverviewRecentChangesCard({ recentChanges, className }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { count, groups } = recentChanges
  const disabled = count === 0

  return (
    <PrimaryCard
      className={cn(OVERVIEW_CARD_PADDING_CLASS, 'flex flex-col', className)}
    >
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className={cn(
          'group -m-1 flex flex-col gap-1 rounded-md p-1 text-left transition-colors',
          !disabled && 'hover:bg-surface-secondary',
          disabled && 'cursor-default',
        )}
      >
        <span className="flex items-center justify-between gap-2">
          <span className={OVERVIEW_WIDGET_TITLE_CLASS}>Recent changes</span>
          {!disabled && (
            <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
          )}
        </span>
        <span className="flex items-baseline gap-2">
          <span className="font-bold text-3xl tabular-nums leading-none">
            {formatInteger(count)}
          </span>
          <span className="text-label-value-12 text-secondary">
            in the past 7 days
          </span>
        </span>
      </button>
      {!disabled && dialogOpen && (
        <RecentChangesDialog
          groups={groups}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </PrimaryCard>
  )
}
