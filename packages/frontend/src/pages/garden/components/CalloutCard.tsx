import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'
import { SproutIcon } from './SproutIcon'

export type CalloutTone = 'garden' | 'brand'

const TONE: Record<
  CalloutTone,
  { card: string; glow: string; chip: string; icon: string }
> = {
  garden: {
    card: 'border-[#cfe3c0] bg-gradient-to-br from-[#f1f9ea] via-surface-primary to-surface-primary dark:border-[#2c3a22] dark:from-[#18220f] dark:via-surface-primary dark:to-surface-primary',
    glow: 'bg-[#8fd06a]/35 dark:bg-[#15ca60]/20',
    chip: 'bg-[#e2f2d6] dark:bg-[#15ca60]/15',
    icon: 'text-[#3f6d2c] dark:text-[#8fd06a]',
  },
  brand: {
    card: 'border-[#e2ccef] bg-gradient-to-br from-[#f7effc] via-surface-primary to-surface-primary dark:border-[#3a2547] dark:from-[#1d1226] dark:via-surface-primary dark:to-surface-primary',
    glow: 'bg-[#c164e3]/30 dark:bg-[#db8bf7]/20',
    chip: 'bg-[#f1d6ff] dark:bg-[#db8bf7]/15',
    icon: 'text-[#7e41cc] dark:text-[#db8bf7]',
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
