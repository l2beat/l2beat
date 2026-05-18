import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import type { PublicDiffHistoryEntry } from '~/server/features/projects/recent-changes/getRecentChanges'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { RecentChangeEntry } from './RecentChangeEntry'
import { RecentChangesPagination } from './RecentChangesPagination'

const PAGE_SIZE = 5

interface Props {
  projectId: string
  maxAgeDays?: number
  className?: string
}

export function RecentChangesPanel({
  projectId,
  maxAgeDays,
  className,
}: Props) {
  const [page, setPage] = useState(1)

  const { data, isLoading } = api.projects.recentChanges.useQuery(
    { projectId, page, pageSize: PAGE_SIZE, maxAgeDays },
    { placeholderData: keepPreviousData },
  )

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  if (isLoading && !data) {
    return <RecentChangesSkeleton className={className} />
  }

  if (!data || data.total === 0) {
    const showSevenDayEmpty =
      maxAgeDays !== undefined && maxAgeDays > 0 && data && data.total === 0
    if (showSevenDayEmpty) {
      return (
        <div
          className={cn(
            'px-2 py-10 text-center text-secondary text-sm',
            className,
          )}
        >
          <p className="mx-auto max-w-sm">
            No changes have been detected over the past 7 days.
          </p>
        </div>
      )
    }
    return (
      <div
        className={cn('py-10 text-center text-secondary text-sm', className)}
      >
        No recent changes have been recorded for this project yet.
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {data.entries.map((entry: PublicDiffHistoryEntry, i: number) => (
        <RecentChangeEntry
          key={`${entry.date}-${i}`}
          entry={entry}
          defaultOpen={page === 1 && i === 0}
        />
      ))}
      <RecentChangesPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="pt-2"
      />
    </div>
  )
}

function RecentChangesSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )
}
