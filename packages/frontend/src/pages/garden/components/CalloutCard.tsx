import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'
import { SproutIcon } from './SproutIcon'

export type CalloutTone = 'garden' | 'brand'

const TONE: Record<
  CalloutTone,
  { card: string; glow: string; chip: string; icon: string }
> = {
  garden: {
    card: 'border-garden-border bg-gradient-to-br from-garden-tint via-surface-primary to-surface-primary',
    glow: 'bg-crop-good/30 dark:bg-crop-good/20',
    chip: 'bg-garden-accent/15',
    icon: 'text-garden-accent',
  },
  brand: {
    card: 'border-[#e2ccef] bg-gradient-to-br from-[#f7effc] via-surface-primary to-surface-primary dark:border-[#3a2547] dark:from-[#1d1226]',
    glow: 'bg-purple-450/30 dark:bg-pink-200/20',
    chip: 'bg-purple-300 dark:bg-pink-200/15',
    icon: 'text-purple-100 dark:text-pink-200',
  },
}

interface Props {
  tone: CalloutTone
  title: string
  description: string
  cta: string
  href: string
  /**
   * Text left, button right, on one row. For a banner that stands alone -
   * stacked, a full-width card leaves a long empty gutter beside the button.
   */
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
        'relative flex flex-col overflow-hidden rounded-2xl border p-5 md:p-6',
        style.card,
      )}
    >
      {/* Sits behind the text and off the corner, so the gradient reads as
          light falling on the card rather than as a second background. */}
      <span
        aria-hidden
        className={cn(
          '-top-20 -right-12 pointer-events-none absolute rounded-full blur-3xl',
          horizontal ? 'size-64' : 'size-48',
          style.glow,
        )}
      />
      <div
        className={cn(
          'relative flex grow flex-col',
          horizontal && 'md:flex-row md:items-center md:gap-8',
        )}
      >
        <div className={cn('flex flex-col', horizontal && 'md:grow')}>
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
              'mt-1.5 text-paragraph-13 text-secondary md:text-paragraph-15',
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
