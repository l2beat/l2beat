import { Button } from '~/components/core/Button'
import { cn } from '~/utils/cn'
import { INTEGRATE_CROPS_PATH, SUBMIT_PROTOCOL_PATH } from '../submit/links'
import { SproutIcon } from './SproutIcon'

/**
 * The two ways out of the garden, side by side: get reviewed, or show the
 * reviews. They are a pair rather than a stack because neither is a follow-up
 * to the other - a reader is one audience or the other, and stacking made the
 * second look like a footnote to the first.
 */
export function GardenCallouts() {
  return (
    <section className="mt-4 grid gap-4 max-md:px-4 md:mt-6 md:grid-cols-2">
      <CalloutCard
        tone="garden"
        title="Want your protocol in the garden?"
        description="See what we look for in each crop, then send it in."
        cta="Submit your protocol"
        href={SUBMIT_PROTOCOL_PATH}
      />
      <CalloutCard
        tone="brand"
        title="Want to show the CROPS to your users?"
        description="A keyless JSON API, and a badge for protocols we have reviewed."
        cta="Integrate CROPS"
        href={INTEGRATE_CROPS_PATH}
      />
    </section>
  )
}

type Tone = 'garden' | 'brand'

const TONE: Record<
  Tone,
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

function CalloutCard({
  tone,
  title,
  description,
  cta,
  href,
}: {
  tone: Tone
  title: string
  description: string
  cta: string
  href: string
}) {
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
          '-top-20 -right-12 pointer-events-none absolute size-48 rounded-full blur-3xl',
          style.glow,
        )}
      />
      <div className="relative flex grow flex-col">
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
        <p className="mt-1.5 grow text-paragraph-13 text-secondary md:text-paragraph-15">
          {description}
        </p>
        <Button asChild variant="fill" className="mt-5 w-full gap-2 md:w-max">
          <a href={href}>
            <SproutIcon />
            {cta}
          </a>
        </Button>
      </div>
    </div>
  )
}
