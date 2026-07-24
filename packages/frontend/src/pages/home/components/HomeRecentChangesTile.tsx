import { useState } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { HomeCard } from './HomeCard'
import { RecentChangesDialog } from './RecentChangesDialog'

const VISIBLE_PROJECT_ICONS_COUNT = 5

export interface HomeRecentChangesProject {
  name: string
  iconUrl: string
}

export function HomeRecentChangesTile({
  recentChangesCount,
  recentChangesProjects,
}: {
  recentChangesCount: number
  recentChangesProjects: HomeRecentChangesProject[]
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const disabled = recentChangesCount === 0

  const visibleProjects = recentChangesProjects.slice(
    0,
    VISIBLE_PROJECT_ICONS_COUNT,
  )
  const restCount = recentChangesProjects.length - visibleProjects.length

  return (
    <HomeCard className="p-0 md:p-0">
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
              : `${recentChangesCount} project ${recentChangesCount === 1 ? 'change' : 'changes'} handled by the L2BEAT team`}
          </span>
        </div>
        {!disabled && (
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="-space-x-1.5 flex items-center">
              {visibleProjects.map((project, index) => (
                <img
                  key={project.name}
                  src={project.iconUrl}
                  alt={project.name}
                  className="relative size-6 rounded-full bg-white shadow"
                  style={{ zIndex: visibleProjects.length - index }}
                />
              ))}
            </div>
            {restCount > 0 && (
              <span className="font-bold text-label-value-14 tabular-nums leading-none">
                +{restCount}
              </span>
            )}
          </div>
        )}
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
