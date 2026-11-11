import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'

type BadgeDialogData = NonNullable<RouterOutputs['projects']['badgesDialog']>

interface BadgesDialogProps {
  initialBadgeId: string
  onOpenChange: (open: boolean) => void
}

export function BadgesDialog({
  initialBadgeId,
  onOpenChange,
}: BadgesDialogProps) {
  const trpc = useTRPC()
  const { isMobile } = useDevice()
  const [selectedBadgeId, setSelectedBadgeId] = useState(initialBadgeId)

  const { data, isLoading, isFetching, isPlaceholderData } = useQuery(
    trpc.projects.badgesDialog.queryOptions(
      { badgeId: selectedBadgeId },
      {
        placeholderData: keepPreviousData,
      },
    ),
  )

  const isSwitchingBadges = isFetching && isPlaceholderData

  // The badge on show changes once its data lands, not on the click, and
  // takes the clicked badge's slot among the related.
  const [shown, setShown] = useState(data)
  const [slots, setSlots] = useState<string[]>()
  useEffect(() => {
    // Settled with nothing, e.g. a failed fetch: the unavailable state
    // rather than the badge before.
    if (!data) {
      if (!isFetching && shown) setShown(undefined)
      return
    }
    if (data === shown) return
    setShown(data)
    setSlots(keepSlots(shown, slots, data))
  }, [data, shown, slots, isFetching])
  // How much shorter the drawer's hero is than the tallest of its type.
  const [heroSlack, setHeroSlack] = useState(0)
  const shownOrLoading = shown ?? data
  const body = shownOrLoading && {
    ...shownOrLoading,
    relatedBadges: orderBySlots(shownOrLoading.relatedBadges, slots),
  }

  if (isMobile) {
    return (
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent
          // The drawer is pinned to the bottom of the screen, so giving up
          // the hero's slack at its top keeps the related row in place.
          style={{ height: `calc(90dvh - ${heroSlack}px)` }}
          contentClassName="flex min-h-0 flex-1 flex-col px-0 pb-0"
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Badge details</DrawerTitle>
            <DrawerDescription>Badge details dialog</DrawerDescription>
          </DrawerHeader>
          <div className="relative min-h-0 flex-1 overflow-y-auto [container-type:size]">
            <BadgesDialogBody
              data={body}
              isLoading={isLoading}
              isSwitchingBadges={isSwitchingBadges}
              onBadgeSelect={setSelectedBadgeId}
              onHeroSlack={setHeroSlack}
              mobile
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="primary-card flex h-[min(90dvh,720px)] w-[768px] flex-col overflow-hidden bg-surface-primary p-0 lg:w-[960px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="sr-only">
          <DialogTitle>Badge details</DialogTitle>
          <DialogDescription>Badge details dialog</DialogDescription>
        </DialogHeader>
        {/* Scrolls only when the window is too short for the projects'
            minimum height. */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <BadgesDialogBody
            data={body}
            isLoading={isLoading}
            isSwitchingBadges={isSwitchingBadges}
            onBadgeSelect={setSelectedBadgeId}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function BadgesDialogBody({
  data,
  isLoading,
  isSwitchingBadges,
  onBadgeSelect,
  onHeroSlack,
  mobile,
}: {
  data: BadgeDialogData | null | undefined
  isLoading: boolean
  isSwitchingBadges: boolean
  onBadgeSelect: (badgeId: string) => void
  onHeroSlack?: (px: number) => void
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
    <div
      className={cn(
        'relative flex flex-col bg-surface-primary',
        !mobile && 'min-h-0 flex-1',
      )}
      aria-busy={isSwitchingBadges}
    >
      {isSwitchingBadges && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-surface-secondary/60">
          <div className="h-full w-2/5 animate-badge-dialog-loading rounded-full bg-brand" />
        </div>
      )}

      <div className="shrink-0 overflow-hidden bg-radial-[at_50%_200%] from-brand-red/30 via-brand-black/10 to-transparent px-3 py-5 md:px-4 md:py-7">
        <div className="flex items-start gap-4">
          <div className="flex w-20 shrink-0 justify-start md:w-24">
            <img
              src={data.badge.src}
              alt={`${data.badge.name} badge`}
              width={data.badge.width}
              height={data.badge.height}
              className="h-20 w-auto md:h-24"
            />
          </div>
          <div className="min-w-0 max-w-[760px] flex-1 space-y-2 max-md:self-center">
            <SizedToTallest
              shown={data.badge}
              others={data.relatedBadges}
              itemClassName="self-end"
              render={(badge) => (
                <h2 className="font-bold text-2xl leading-none md:text-3xl">
                  {badge.name}
                </h2>
              )}
            />
            <p className="font-medium text-base text-secondary">
              Used by {data.projectCount}{' '}
              {data.projectCount === 1 ? 'project' : 'projects'}
            </p>
            {!mobile && <BadgeDescription data={data} />}
          </div>
        </div>
        {mobile && onHeroSlack && (
          <MeasuredDescription
            data={data}
            onSlack={onHeroSlack}
            className="mt-4"
          />
        )}
      </div>

      {data.relatedBadges.length > 0 && (
        <>
          <HorizontalSeparator />
          <BadgeDialogSection
            className="shrink-0"
            title={getRelatedBadgesTitle(
              data.badge.type,
              data.relatedBadges.length,
            )}
          >
            <div className="flex flex-wrap gap-2">
              {data.relatedBadges.map((badge, slot) => (
                // Keyed by slot: the button under the pointer, and the
                // focus, stay put while the badge in it changes.
                <button
                  key={slot}
                  type="button"
                  onClick={() => onBadgeSelect(badge.id)}
                  className="flex w-20 items-center justify-center transition-transform hover:scale-[1.04]"
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
      <BadgeDialogSection
        title={`Projects (${data.projectCount})`}
        className={cn(
          'flex flex-col',
          // The project list scrolls on its own on desktop, keeping at
          // least a row of cards in a short window; in the drawer
          // it fills at least a screen, so a shorter list never pulls the
          // badges above it up under the pointer.
          mobile ? 'min-h-[100cqh]' : 'min-h-48 flex-1 pb-0 md:pb-0',
        )}
        contentClassName={cn(
          !mobile &&
            '-mx-3 md:-mx-4 min-h-0 flex-1 overflow-y-auto px-3 pb-8 [mask-image:linear-gradient(to_bottom,#000_calc(100%-40px),transparent)] md:px-4 md:pb-10',
        )}
      >
        <div className="grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {data.projects.map((project) => (
            <CustomLink
              key={project.slug}
              href={`/layer2s/projects/${project.slug}`}
              underline={false}
              className="flex min-h-32 flex-col items-center justify-center rounded-lg border-1 border-divider p-2 text-center text-primary transition-colors hover:bg-surface-secondary hover:text-primary"
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

function BadgeDescription({
  data,
  className,
}: {
  data: BadgeDialogData
  className?: string
}) {
  return (
    <SizedToTallest
      className={className}
      shown={data.badge}
      others={data.relatedBadges}
      render={(badge) => (
        <p className="text-pretty text-base text-secondary">
          {badge.description}
        </p>
      )}
    />
  )
}

/**
 * The description on show, measuring how much shorter it is than the
 * longest of its type's, which an invisible stack of them all spans.
 */
function MeasuredDescription({
  data,
  onSlack,
  className,
}: {
  data: BadgeDialogData
  onSlack: (px: number) => void
  className?: string
}) {
  const shownRef = useRef<HTMLParagraphElement>(null)
  const tallestRef = useRef<HTMLDivElement>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: measure again whenever the text changes
  useLayoutEffect(() => {
    const shownEl = shownRef.current
    const tallestEl = tallestRef.current
    if (!shownEl || !tallestEl) return
    const measure = () =>
      onSlack(Math.max(0, tallestEl.offsetHeight - shownEl.offsetHeight))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(shownEl)
    observer.observe(tallestEl)
    return () => observer.disconnect()
  }, [onSlack, data])
  const text = 'text-pretty text-base text-secondary'
  return (
    <div className={cn('relative', className)}>
      <p ref={shownRef} className={text}>
        {data.badge.description}
      </p>
      <div
        ref={tallestRef}
        aria-hidden
        className="invisible absolute inset-x-0 top-0 grid"
      >
        {[data.badge, ...data.relatedBadges].map((badge) => (
          <p key={badge.id} className={cn('col-start-1 row-start-1', text)}>
            {badge.description}
          </p>
        ))}
      </div>
    </div>
  )
}

type DialogBadge = BadgeDialogData['badge']

/**
 * Renders the badge on show in a box as tall as the tallest of its type's
 * would be, so switching between them moves nothing below.
 */
function SizedToTallest({
  shown,
  others,
  render,
  className,
  itemClassName,
}: {
  shown: DialogBadge
  others: DialogBadge[]
  render: (badge: DialogBadge) => ReactNode
  className?: string
  itemClassName?: string
}) {
  return (
    <div className={cn('grid', className)}>
      {[shown, ...others].map((badge) => (
        <div
          key={badge.id}
          aria-hidden={badge !== shown || undefined}
          className={cn(
            'col-start-1 row-start-1',
            itemClassName,
            badge !== shown && 'invisible',
          )}
        >
          {render(badge)}
        </div>
      ))}
    </div>
  )
}

function BadgeDialogSection({
  title,
  className,
  contentClassName,
  children,
}: {
  title: string
  className?: string
  contentClassName?: string
  children: ReactNode
}) {
  return (
    <section className={cn('px-3 py-4 md:px-4 md:py-5', className)}>
      <h3 className="font-bold text-xl leading-none">{title}</h3>
      <div className={cn('mt-4', contentClassName)}>{children}</div>
    </section>
  )
}

function BadgesDialogSkeleton({ mobile }: { mobile?: boolean }) {
  return (
    <div className="bg-surface-primary">
      <div className="overflow-hidden bg-radial-[at_50%_200%] from-brand-red/30 via-brand-black/10 to-transparent px-3 py-5 md:px-4 md:py-7">
        <div className="flex items-start gap-4">
          <Skeleton className="size-20 shrink-0 rounded-md md:size-24" />
          <div className="w-full max-w-[760px] space-y-2 max-md:self-center">
            <Skeleton className="h-6 w-44 md:h-8" />
            <Skeleton className="h-5 w-32" />
            {!mobile && (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </>
            )}
          </div>
        </div>
        {mobile && (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
      </div>
      <HorizontalSeparator />
      <section className="px-3 py-4 md:px-4 md:py-5">
        <Skeleton className="h-5 w-48 md:w-56" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="size-20 rounded-md" />
          ))}
        </div>
      </section>
      <HorizontalSeparator />
      <section className="px-3 py-4 md:px-4 md:py-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 grid grid-cols-3 gap-3.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
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

/**
 * The related badges in the order they were shown, the badge just picked
 * swapped for the one it replaced, so every other badge keeps its slot.
 */
function keepSlots(
  prev: BadgeDialogData | null | undefined,
  prevSlots: string[] | undefined,
  next: BadgeDialogData,
): string[] | undefined {
  if (!prev || prev.badge.type !== next.badge.type) return undefined
  const order = prevSlots ?? prev.relatedBadges.map((badge) => badge.id)
  if (!order.includes(next.badge.id)) return undefined
  return order.map((id) => (id === next.badge.id ? prev.badge.id : id))
}

function orderBySlots(
  badges: BadgeDialogData['relatedBadges'],
  slots: string[] | undefined,
) {
  if (!slots || slots.length !== badges.length) return badges
  const byId = new Map(badges.map((badge) => [badge.id, badge]))
  const ordered = slots.flatMap((id) => byId.get(id) ?? [])
  return ordered.length === badges.length ? ordered : badges
}
