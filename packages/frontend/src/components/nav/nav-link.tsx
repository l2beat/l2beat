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
          'flex h-8 items-center gap-2.5 rounded px-2.5 py-1.5 text-black transition-colors duration-300 ease-out hover:bg-[#CCD0DA] dark:text-white dark:hover:bg-zinc-800',
          active && '!bg-pink-900 text-white dark:!bg-pink-200 dark:text-black',
        )}
      >
        <span className="text-base font-semibold leading-none">{title}</span>
      </li>
    </Link>
  )
}
