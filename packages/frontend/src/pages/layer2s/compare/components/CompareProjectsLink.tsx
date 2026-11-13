import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

interface Props {
  href: string
  variant?: 'controls' | 'section'
  className?: string
  children?: ReactNode
}

// Neutral like home's one button (`HOME_BUTTON_CLASS`): pink is kept for the
// side nav, count badges and focus rings.
const VARIANT_CLASSES = {
  controls: 'inline-flex h-8 w-fit px-3',
  section: 'flex w-full p-3 md:w-fit md:py-2',
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
        'items-center justify-center whitespace-nowrap rounded-md border border-divider font-medium text-label-value-13 text-primary leading-4 transition-colors hover:bg-surface-secondary',
        'ring-brand ring-offset-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </a>
  )
}
