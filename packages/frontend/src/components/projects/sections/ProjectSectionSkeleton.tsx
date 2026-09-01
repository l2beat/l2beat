import { Skeleton } from '~/components/core/Skeleton'
import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { cn } from '~/utils/cn'

const defaultSkeletonVariant = {
  title: 'w-44',
  kicker: 'w-32',
  line: 'w-full',
  cards: ['h-18', 'h-24', 'h-20'],
  chips: ['w-20', 'w-14', 'w-24'],
} as const

const skeletonVariants = [
  defaultSkeletonVariant,
  {
    title: 'w-36',
    kicker: 'w-24',
    line: 'w-4/5',
    cards: ['h-24', 'h-18', 'h-22'],
    chips: ['w-16', 'w-28', 'w-18', 'w-12'],
  },
  {
    title: 'w-52',
    kicker: 'w-40',
    line: 'w-11/12',
    cards: ['h-20', 'h-22', 'h-18'],
    chips: ['w-24', 'w-18', 'w-14'],
  },
  {
    title: 'w-40',
    kicker: 'w-28',
    line: 'w-2/3',
    cards: ['h-22', 'h-20', 'h-24'],
    chips: ['w-14', 'w-20', 'w-28', 'w-16'],
  },
] as const

export function ProjectSectionSkeleton({
  className,
  variant = 0,
}: {
  className?: string
  variant?: number
}) {
  const normalizedVariant =
    ((variant % skeletonVariants.length) + skeletonVariants.length) %
    skeletonVariants.length
  const skeleton = skeletonVariants[normalizedVariant] ?? defaultSkeletonVariant

  return (
    <HighlightablePrimaryCard
      aria-hidden
      className={cn(
        'scroll-mt-[38px] px-4 py-8 md:mt-4 md:scroll-mt-14 md:p-6 lg:scroll-mt-4',
        'max-md:border-divider max-md:border-b max-md:last:border-none',
        'md:rounded-lg',
        'border-t-branding-primary md:group-data-[has-colors=true]/section-wrapper:border-t-4',
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="hidden size-10 rounded md:block" />
        <Skeleton className={cn('h-8 max-w-full', skeleton.title)} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {skeleton.chips.map((width, i) => (
            <Skeleton key={i} className={cn('h-4 rounded-full', width)} />
          ))}
        </div>
        <Skeleton className={cn('h-4', skeleton.kicker)} />
        <Skeleton className={cn('h-2 rounded-full', skeleton.line)} />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {skeleton.cards.map((height, i) => (
            <Skeleton key={i} className={cn('w-full', height)} />
          ))}
        </div>
      </div>
    </HighlightablePrimaryCard>
  )
}
