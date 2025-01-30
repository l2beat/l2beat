'use client'

import Link from 'next/link'
import type { ActiveLinkProps } from '~/hooks/use-active-link'
import { useActiveLink } from '~/hooks/use-active-link'
import { cn } from '~/utils/cn'

export type NavSmallLinkProps = (
  | { title: string; children?: undefined }
  | { children: React.ReactNode; title?: undefined }
) &
  ActiveLinkProps

/**
 * Small navigation link component used for misc links without a category, should be used inside NavSmallLinkGroup.
 */
export function NavSmallLink({
  title,
  href,
  children,
  activeBehavior,
}: NavSmallLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <Link href={href} target={href.startsWith('http') ? '_blank' : undefined}>
      <li
        className={cn(
          'text-xs font-medium leading-none text-zinc-800 transition-colors duration-300 hover:text-zinc-500 dark:text-white dark:hover:text-gray-400',
          active && '!text-brand',
        )}
      >
        {children ?? title}
      </li>
    </Link>
  )
}
