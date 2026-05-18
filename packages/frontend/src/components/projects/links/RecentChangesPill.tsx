import { useState } from 'react'
import { navigationMenuTriggerStyle } from '~/components/core/NavigationMenu'
import { RecentChangesDialog } from '~/components/projects/recent-changes/RecentChangesDialog'
import { HistoryClockIcon } from '~/icons/HistoryClock'
import { cn } from '~/utils/cn'

interface Props {
  projectId: string
  projectName: string
  last7DaysCount: number
  className?: string
}

export function RecentChangesPill({
  projectId,
  projectName,
  last7DaysCount,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          navigationMenuTriggerStyle(),
          'ring-brand ring-inset hover:bg-surface-secondary focus:bg-surface-secondary focus:ring-2',
          'flex flex-row items-center gap-1.5',
          className,
        )}
      >
        <HistoryClockIcon className="size-4 shrink-0 fill-current" />
        Recent changes
        {last7DaysCount > 0 ? (
          <span
            className="inline-flex h-3.5 min-w-3.5 items-center justify-center rounded bg-brand p-px font-medium text-2xs text-white tabular-nums leading-none"
            suppressHydrationWarning
          >
            {last7DaysCount}
          </span>
        ) : null}
      </button>
      {open && (
        <RecentChangesDialog
          projectId={projectId}
          projectName={projectName}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}
