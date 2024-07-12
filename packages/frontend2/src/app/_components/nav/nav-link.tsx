'use client'

import Link from 'next/link'
import React from 'react'
import { type ActiveLinkProps, useActiveLink } from '~/hooks/use-active-link'
import { cn } from '~/utils/cn'

export type NavLinkProps = {
  icon: React.ReactNode
  title: string
} & ActiveLinkProps

/**
 * Navigation link component used inside NavLinkGroups of the new sidenav.
 */
export function NavLink({ icon, title, href, activeBehavior }: NavLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <Link href={href}>
      <li
        className={cn(
          'flex items-center gap-[0.625rem] p-1.5 rounded-[0.25rem] hover:bg-[#F1D6FF] dark:hover:bg-[#272A2F] transition-colors duration-300 ease-out text-black dark:text-white',
          'xl:sidenav-collapsed:w-8 xl:sidenav-collapsed:h-8 xl:sidenav-collapsed:p-0 xl:sidenav-collapsed:justify-center h-8 items-center',
          active && 'bg-[#d3d5d9] dark:bg-[#393C43]',
        )}
      >
        <span className="text-xl leading-none">{icon}</span>
        <span className="font-semibold text-base leading-none xl:sidenav-collapsed:hidden">
          {title}
        </span>
      </li>
    </Link>
  )
}
