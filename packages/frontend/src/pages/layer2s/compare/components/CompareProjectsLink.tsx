import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

interface Props {
  href: string
  variant?: 'controls' | 'section'
  className?: string
  children?: ReactNode
}

const VARIANT_CLASSES = {
  controls: 'inline-flex h-8 w-fit rounded-md bg-brand px-3 text-white',
  // The project page's neutral button (home's HOME_BUTTON_CLASS): a section's
  // links add no colour beside its chart.
  section: cn(
    'flex w-full rounded-md border border-divider p-3 font-medium text-label-value-13 text-primary leading-4',
    'transition-colors hover:bg-surface-secondary md:w-fit md:px-3 md:py-1.5',
  ),
}

export function CompareProjectsLink({
  href,
  variant = 'controls',
  className,
  children = 'Compare projects',
}: Props) {
  return (
    <a
      href={href}
      className={cn(
        'items-center justify-center whitespace-nowrap font-bold text-xs leading-none',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </a>
  )
}
