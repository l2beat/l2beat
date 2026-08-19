import type { ReactNode } from 'react'
import { env } from '~/env'
import { cn } from '~/utils/cn'

interface Props {
  href: string
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

export function CompareProjectsLink({
  href,
  variant = 'controls',
  className,
  children = 'Compare projects',
}: Props) {
  if (!env.CLIENT_SIDE_COMPARE_PROJECTS) return null
  return (
    <a
      href={href}
      className={cn(
        'items-center justify-center whitespace-nowrap font-bold text-xs leading-none',
        'ring-brand ring-offset-1 ring-offset-background focus:outline-none focus:ring-2',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </a>
  )
}
