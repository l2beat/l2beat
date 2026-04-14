import type { ReactNode } from 'react'
import { Badge } from '~/components/badge/Badge'
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
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { CustomLink } from '~/components/link/CustomLink'
import { useDevice } from '~/hooks/useDevice'
import type { RouterOutputs } from '~/trpc/React'
import { cn } from '~/utils/cn'

type BadgeDialogData = NonNullable<RouterOutputs['projects']['badgesDialog']>

interface BadgesDialogProps {
  onOpenChange: (open: boolean) => void
  data: BadgeDialogData | undefined
  isLoading: boolean
  onBadgeSelect: (badgeId: string) => void
}

export function BadgesDialog({
  onOpenChange,
  data,
  isLoading,
  onBadgeSelect,
}: BadgesDialogProps) {
  const { isMobile } = useDevice()

  if (isMobile) {
    return (
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent
          className="max-h-[90dvh]"
          contentClassName="flex min-h-0 flex-col px-0 pb-0"
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Badge details</DrawerTitle>
            <DrawerDescription>Badge details dialog</DrawerDescription>
          </DrawerHeader>
          <div className="relative overflow-y-auto">
            <BadgesDialogBody
              data={data}
              isLoading={isLoading}
              onBadgeSelect={onBadgeSelect}
              mobile
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[768px] flex-col overflow-hidden bg-surface-primary p-0 lg:w-[960px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="sr-only">
          <DialogTitle>Badge details</DialogTitle>
          <DialogDescription>Badge details dialog</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto">
          <BadgesDialogBody
            data={data}
            isLoading={isLoading}
            onBadgeSelect={onBadgeSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function BadgesDialogBody({
  data,
  isLoading,
  onBadgeSelect,
  mobile,
}: {
  data: BadgeDialogData | undefined
  isLoading: boolean
  onBadgeSelect: (badgeId: string) => void
  mobile?: boolean
}) {
  if (isLoading && !data) {
    return <BadgesDialogSkeleton mobile={mobile} />
  }

  if (!data) {
    return (
      <div className="px-4 py-10 text-center text-secondary md:px-6">
        Badge details are unavailable right now.
      </div>
    )
  }

  return (
    <div className="bg-surface-primary">
      <div className="overflow-hidden bg-radial-[at_50%_200%] from-brand-red/30 via-brand-black/10 to-transparent px-4 py-6 md:px-6 md:py-7">
        <div
          className={cn(
            'flex gap-4',
            mobile
              ? 'flex-col items-center text-center'
              : 'items-start text-left',
          )}
        >
          <img
            src={data.badge.src}
            alt={`${data.badge.name} badge`}
            width={data.badge.width}
            height={data.badge.height}
            className="h-24 w-auto shrink-0"
          />
          <div className={cn('space-y-2', !mobile && 'max-w-[520px]')}>
            <h2 className="font-bold text-3xl leading-none">
              {data.badge.name}
            </h2>
            <p className="text-md text-secondary">{data.badge.description}</p>
            <p className="font-bold text-lg">
              {data.projectCount}{' '}
              {data.projectCount === 1 ? 'Project' : 'Projects'}
            </p>
          </div>
        </div>
      </div>

      {data.relatedBadges.length > 0 && (
        <>
          <HorizontalSeparator />
          <BadgeDialogSection
            title={getRelatedBadgesTitle(
              data.badge.type,
              data.relatedBadges.length,
            )}
          >
            <div className="flex flex-wrap gap-2">
              {data.relatedBadges.map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => onBadgeSelect(badge.id)}
                  className="flex items-center justify-center transition-transform hover:scale-[1.04]"
                >
                  <img
                    src={badge.src}
                    alt={`${badge.name} badge`}
                    width={badge.width}
                    height={badge.height}
                    className="h-20 w-auto"
                  />
                </button>
              ))}
            </div>
          </BadgeDialogSection>
        </>
      )}

      <HorizontalSeparator />
      <BadgeDialogSection title={`Projects (${data.projectCount})`}>
        <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {data.projects.map((project) => (
            <CustomLink
              key={project.slug}
              href={`/scaling/projects/${project.slug}`}
              underline={false}
              className="flex h-32 flex-col items-center justify-center rounded-lg border-1 border-divider p-2 text-center text-primary transition-colors hover:bg-surface-secondary hover:text-primary"
            >
              <img
                src={project.icon}
                alt={`${project.name} logo`}
                width={32}
                height={32}
                className="mb-2 size-8 rounded-md"
              />
              <div className="font-bold text-lg leading-none">
                {project.name}
              </div>
              <Badge type="gray" size="extraSmall" className="mt-1">
                {project.type}
              </Badge>
            </CustomLink>
          ))}
        </div>
      </BadgeDialogSection>
    </div>
  )
}

function BadgeDialogSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="px-3 py-4 md:px-4 md:py-5">
      <h3 className="font-bold text-xl leading-none">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function BadgesDialogSkeleton({ mobile }: { mobile?: boolean }) {
  return (
    <div className="bg-surface-primary">
      <div className="overflow-hidden bg-radial-[at_50%_200%] from-brand-red/30 via-brand-black/10 to-transparent px-4 py-6 md:px-6 md:py-7">
        <div
          className={cn(
            'flex gap-4',
            mobile
              ? 'flex-col items-center text-center'
              : 'items-start text-left',
          )}
        >
          <Skeleton className="h-24 w-20 rounded-md md:w-24" />
          <div className={cn('w-full space-y-2', !mobile && 'max-w-[520px]')}>
            <Skeleton className="h-8 w-44 md:h-9" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
      <HorizontalSeparator />
      <section className="px-3 py-4 md:px-4 md:py-5">
        <Skeleton className="h-7 w-48 md:h-6 md:w-56" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-16 rounded-md" />
          ))}
        </div>
      </section>
      <HorizontalSeparator />
      <section className="px-3 py-4 md:px-4 md:py-5">
        <Skeleton className="h-7 w-40 md:h-6" />
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="min-h-24 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  )
}

function formatBadgeType(type: string) {
  switch (type) {
    case 'L3ParentChain':
      return 'L3 parent chain'
    default:
      return type
  }
}

function getRelatedBadgesTitle(type: string, count: number) {
  if (type === 'Other') {
    return `Related badges (${count})`
  }

  return `Other ${formatBadgeType(type)} badges (${count})`
}
