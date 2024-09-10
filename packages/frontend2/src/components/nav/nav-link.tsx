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
          'flex items-center gap-2.5 rounded p-1.5 text-black transition-colors duration-300 ease-out hover:bg-[#F1D6FF] dark:text-white dark:hover:bg-[#272A2F]',
          'h-8 xl:sidenav-collapsed:size-8 xl:sidenav-collapsed:justify-center xl:sidenav-collapsed:p-0',
          active && 'bg-[#d3d5d9] dark:bg-[#393C43]',
        )}
      >
        <span className="flex flex-row items-center text-xl leading-none">
          {icon}
        </span>
        <span className="text-base font-semibold leading-none xl:sidenav-collapsed:hidden">
          {title}
        </span>
      </li>
    </Link>
  )
}
