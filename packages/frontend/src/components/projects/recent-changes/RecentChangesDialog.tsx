import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/core/Drawer'
import { Skeleton } from '~/components/core/Skeleton'
import { useDevice } from '~/hooks/useDevice'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { RecentChangeEntry } from './RecentChangeEntry'
import { RecentChangesPagination } from './RecentChangesPagination'

const PAGE_SIZE = 5

interface Props {
  projectId: string
  projectName: string
  onOpenChange: (open: boolean) => void
}

export function RecentChangesDialog({
  projectId,
  projectName,
  onOpenChange,
}: Props) {
  const { isMobile } = useDevice()
  const [page, setPage] = useState(1)

  const { data, isLoading } = api.projects.recentChanges.useQuery(
    { projectId, page, pageSize: PAGE_SIZE },
    { placeholderData: keepPreviousData },
  )

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
  const description = `Recent updates for ${projectName}`

  const body = (
    <RecentChangesBody
      data={data}
      isLoading={isLoading && !data}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  )

  if (isMobile) {
    return (
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-col px-0 pb-0"
        >
          <DrawerHeader className="px-4 pb-2">
            <DrawerTitle className="mb-0 font-bold text-xl leading-none">
              Recent updates
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">{body}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[640px] flex-col overflow-hidden bg-surface-primary p-0 lg:w-[768px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="border-divider border-b px-6 py-4">
          <DialogTitle className="font-bold text-xl leading-none">
            Recent updates
          </DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-5">{body}</div>
      </DialogContent>
    </Dialog>
  )
}

function RecentChangesBody({
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: {
  data:
    | {
        total: number
        page: number
        pageSize: number
        entries: import('~/server/features/projects/recent-changes/getRecentChanges').PublicDiffHistoryEntry[]
      }
    | undefined
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (isLoading) {
    return <RecentChangesSkeleton />
  }

  if (!data || data.entries.length === 0) {
    return (
      <div className="py-10 text-center text-secondary text-sm">
        No recent changes have been recorded for this project yet.
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3')}>
      {data.entries.map((entry, i) => (
        <RecentChangeEntry
          key={`${entry.date}-${i}`}
          entry={entry}
          defaultOpen={page === 1 && i === 0}
        />
      ))}
      <RecentChangesPagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="pt-2"
      />
    </div>
  )
}

function RecentChangesSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )
}
