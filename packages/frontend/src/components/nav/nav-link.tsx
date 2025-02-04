'use client'

import Link from 'next/link'
import type { ActiveLinkProps } from '~/hooks/use-active-link'
import { useActiveLink } from '~/hooks/use-active-link'
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
          'flex h-7 items-center gap-2.5 rounded px-2.5 py-1.5 text-primary transition-colors duration-300 ease-out hover:bg-surface-tertiary',
          active && '!bg-brand text-white dark:text-black',
        )}
      >
        <span className="text-sm font-medium leading-none">{title}</span>
      </li>
    </Link>
  )
}
