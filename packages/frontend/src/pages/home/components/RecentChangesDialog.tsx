import { useQuery } from '@tanstack/react-query'
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
import { UpdateCard } from '~/components/projects/sections/UpdatesSection'
import { useDevice } from '~/hooks/useDevice'
import { ChevronIcon } from '~/icons/Chevron'
import type { RecentChangesProjectGroup } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { useTRPC } from '~/trpc/React'

const TITLE = 'Recent changes'
const DESCRIPTION = 'Project changes handled over the past 7 days'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecentChangesDialog({ open, onOpenChange }: Props) {
  const { isMobile } = useDevice()
  const trpc = useTRPC()
  // The groups (full diff bodies) are heavy, so they are not serialized into
  // the page props — they are fetched only when the dialog is opened.
  const { data, isLoading } = useQuery(
    trpc.projects.recentChanges.queryOptions(),
  )
  const groups = data?.groups ?? []

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-col px-0 pb-0"
        >
          <DrawerHeader className="px-4 pb-2 text-left">
            <DrawerTitle>{TITLE}</DrawerTitle>
            <DrawerDescription>{DESCRIPTION}</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 overflow-y-auto px-4 pb-4">
            <RecentChangesBody groups={groups} isLoading={isLoading} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[768px] flex-col overflow-hidden bg-surface-primary p-0 lg:w-[900px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <DialogTitle>{TITLE}</DialogTitle>
          <DialogDescription>{DESCRIPTION}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto px-6 pb-6">
          <RecentChangesBody groups={groups} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function RecentChangesBody({
  groups,
  isLoading,
}: {
  groups: RecentChangesProjectGroup[]
  isLoading: boolean
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="py-10 text-center text-secondary">
        No changes handled in the past 7 days.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.href} className="flex flex-col gap-3">
          <a
            href={group.href}
            className="group flex items-center justify-between gap-2 border-divider border-b pb-2"
          >
            <span className="flex min-w-0 items-center gap-2">
              <img
                src={group.iconUrl}
                alt={group.name}
                className="size-5 shrink-0 rounded-full"
              />
              <h3 className="truncate font-bold text-base text-primary leading-none">
                {group.name}
              </h3>
            </span>
            <span className="flex shrink-0 items-center gap-1 font-medium text-link text-xs">
              View updates
              <ChevronIcon className="-rotate-90 size-2.5 fill-link" />
            </span>
          </a>
          <div className="flex flex-col gap-3">
            {group.updates.map((update, index) => (
              <UpdateCard key={`${update.date}-${index}`} update={update} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
