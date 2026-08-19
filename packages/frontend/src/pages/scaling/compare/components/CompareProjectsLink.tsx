import type { ReactNode } from 'react'
import { env } from '~/env'
import { LineChartIcon } from '~/icons/LineChart'
import { cn } from '~/utils/cn'

interface Props {
  /** A URL from `getCompareEntryUrl`. */
  href: string
  /**
   * `controls` sits inline among chart controls, so it is a compact gradient
   * pill at every breakpoint. `section` mirrors `TvsBreakdownButton` in a
   * project section: a full-width outline button on mobile and a gradient
   * one on desktop.
   */
  variant?: 'controls' | 'section'
  className?: string
  children?: ReactNode
}

const VARIANT_CLASSES = {
  controls:
    'inline-flex h-8 w-fit rounded-md bg-linear-to-r from-purple-100 to-pink-100 px-3 text-white',
  section: cn(
    'flex w-full rounded-md border border-brand bg-transparent from-purple-100 to-pink-100 p-3 text-primary',
    'md:w-fit md:border-0 md:bg-linear-to-r md:py-2 md:text-white',
  ),
}

/**
 * An entry point to the compare page, highlighted like the other promoted
 * links (`TvsBreakdownButton`). Renders nothing while
 * `FEATURE_FLAG_COMPARE_PROJECTS` is off, so callers can place it
 * unconditionally.
 */
export function CompareProjectsLink({
  href,
  variant = 'controls',
  className,
  children = 'Compare projects',
}: Props) {
  if (!env.FEATURE_FLAG_COMPARE_PROJECTS) return null
  return (
    <a
      href={href}
      className={cn(
        'items-center justify-center gap-1.5 whitespace-nowrap font-bold text-xs leading-none',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {/* Sized to the text so the button height matches its icon-less
          siblings (e.g. TvsBreakdownButton). */}
      <LineChartIcon className="size-3 shrink-0 fill-current" aria-hidden />
      {children}
    </a>
  )
}
