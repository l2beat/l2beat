import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'
import { SproutIcon } from './SproutIcon'

export type CalloutTone = 'garden' | 'brand'

const TONE: Record<
  CalloutTone,
  { border: string; tint: string; chip: string; icon: string }
> = {
  garden: {
    border: 'border-garden-border',
    tint: 'bg-garden-tint',
    chip: 'bg-garden-accent/15',
    icon: 'text-garden-accent',
  },
  brand: {
    border: 'border-purple-100/20 dark:border-pink-200/20',
    tint: 'bg-purple-300/20 dark:bg-purple-800/30',
    chip: 'bg-purple-100/15 dark:bg-pink-200/15',
    icon: 'text-purple-100 dark:text-pink-200',
  },
}

interface Props {
  tone: CalloutTone
  title: string
  description: string
  cta: string
  href: string
  /** Text left, button right, for a banner that stands alone. */
  horizontal?: boolean
}

export function CalloutCard({
  tone,
  title,
  description,
  cta,
  href,
  horizontal,
}: Props) {
  const style = TONE[tone]
  return (
    <div
      className={cn(
        // A solid backdrop under the tint keeps the hills from showing through.
        'relative flex flex-col overflow-hidden rounded-xl border bg-surface-primary p-4 md:p-8',
        style.border,
      )}
    >
      <span aria-hidden className={cn('absolute inset-0', style.tint)} />
      <div
        className={cn(
          'relative flex grow flex-col',
          horizontal && 'md:flex-row md:items-center md:gap-8',
        )}
      >
        <div className="flex grow flex-col">
          <span
            className={cn(
              'flex size-9 items-center justify-center rounded-xl',
              style.chip,
            )}
          >
            <SproutIcon className={cn('size-[18px]', style.icon)} />
          </span>
          <p className="mt-3.5 font-bold text-heading-16 md:text-heading-20">
            {title}
          </p>
          <p
            className={cn(
              'mt-1.5 text-pretty text-paragraph-14 text-secondary md:text-paragraph-15',
              horizontal ? 'md:max-w-2xl' : 'grow',
            )}
          >
            {description}
          </p>
        </div>
        <Button
          asChild
          variant="fill"
          className={cn(
            'mt-5 w-full shrink-0 gap-2 md:w-max',
            horizontal && 'md:mt-0',
          )}
        >
          <a href={href}>
            <SproutIcon />
            {cta}
          </a>
        </Button>
      </div>
    </div>
  )
}
