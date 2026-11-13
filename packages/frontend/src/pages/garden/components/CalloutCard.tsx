import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'

export type CalloutTone = 'garden' | 'brand'

const TONE: Record<CalloutTone, { border: string; tint: string }> = {
  garden: {
    border: 'border-garden-border',
    tint: 'bg-garden-tint',
  },
  brand: {
    border: 'border-brand/30',
    tint: 'bg-brand/10 dark:bg-brand/15',
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
        'relative flex flex-col overflow-hidden rounded-xl border bg-surface-primary p-4 md:px-6 md:py-5',
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
          <p className="font-bold text-heading-16 md:text-heading-20">
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
            'mt-5 w-full shrink-0 md:w-max',
            horizontal && 'md:mt-0',
          )}
        >
          <a href={href}>{cta}</a>
        </Button>
      </div>
    </div>
  )
}
