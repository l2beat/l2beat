import { useState } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { HomeCard } from './HomeCard'
import { RecentChangesDialog } from './RecentChangesDialog'

export function HomeRecentChangesTile({
  recentChangesCount,
}: {
  recentChangesCount: number
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const disabled = recentChangesCount === 0

  return (
    <HomeCard className="p-0">
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className={cn(
          'group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors md:rounded-xl md:px-7 md:py-5',
          !disabled && 'hover:bg-surface-secondary/50',
          disabled && 'cursor-default',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={cn(
              'truncate font-bold text-label-value-14 leading-tight transition-colors',
              !disabled && 'group-hover:text-link',
            )}
          >
            Recent changes{' '}
            <span className="font-medium text-secondary">(past 7 days)</span>
          </span>
          <span className="mt-0.5 truncate font-medium text-label-value-12 text-secondary">
            {disabled
              ? 'No project changes handled this week'
              : 'Project changes handled by the L2BEAT team'}
          </span>
        </div>
        <span className="shrink-0 font-bold text-heading-20 tabular-nums leading-none">
          {formatInteger(recentChangesCount)}
        </span>
        {!disabled && (
          <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-link" />
        )}
      </button>
      {!disabled && dialogOpen && (
        <RecentChangesDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </HomeCard>
  )
}
