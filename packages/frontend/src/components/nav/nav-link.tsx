'use client'

import Link from 'next/link'
import { type ActiveLinkProps, useActiveLink } from '~/hooks/use-active-link'
import { cn } from '~/utils/cn'

export type NavLinkProps = {
  title: string
} & ActiveLinkProps

/**
 * Navigation link component used inside NavLinkGroups of the new sidenav.
 */
export function NavLink({ title, href, activeBehavior }: NavLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <Link href={href}>
      <li
        className={cn(
          'text-primary hover:bg-surface-tertiary flex h-7 items-center gap-2.5 rounded-sm px-2.5 py-1.5 transition-colors duration-300 ease-out',
          active && 'bg-brand! text-white dark:text-black',
        )}
      >
        <span className="text-sm font-medium leading-none">{title}</span>
      </li>
    </Link>
  )
}
