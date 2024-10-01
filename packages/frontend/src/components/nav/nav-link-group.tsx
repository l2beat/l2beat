'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../core/collapsible'
import { NavDivider } from './nav-divider'
import { NavLink } from './nav-link'
import { type NavGroup } from './types'

export interface NavLinkGroupProps {
  group: NavGroup
}

/**
 * Group of nav links with a title used in the sidenav.
 */
export function NavLinkGroup({ group }: NavLinkGroupProps) {
  const pathname = usePathname()

  if (group.type === 'single') {
    const isSelected = group.href === pathname
    return (
      <Link
        href={group.href}
        className="group flex items-center gap-2"
        data-active={isSelected}
      >
        {group.icon}
        <span
          className={cn(
            'ml-1 text-base font-medium uppercase tracking-tight text-[#131215] transition-colors duration-300 dark:text-white',
            isSelected && 'text-pink-900 dark:text-pink-200',
          )}
        >
          {group.title}
        </span>
      </Link>
    )
  }

  const isSelected = [...group.links, ...(group.secondaryLinks ?? [])].some(
    (link) => link.href === pathname,
  )

  return (
    <Collapsible className="flex flex-col gap-2" defaultOpen={isSelected}>
      <CollapsibleTrigger
        className="group flex items-center gap-2"
        data-active={isSelected}
      >
        {group.icon}
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'ml-1 text-base font-medium uppercase tracking-tight text-[#131215] transition-colors duration-300  dark:text-white',
              isSelected && 'text-pink-900 dark:text-pink-200',
            )}
          >
            {group.title}
          </span>
          <ChevronIcon
            className={cn(
              'size-3 -rotate-90 fill-[#131215] transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0 dark:fill-white',
              isSelected && 'fill-pink-900 dark:fill-pink-200',
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <ul className="ml-[9px] flex flex-col gap-0.5 border-l border-gray-300 pl-[14px] dark:border-gray-850">
          {group.links?.map(
            (link) =>
              !link.disabled && (
                <NavLink key={link.href} title={link.title} href={link.href} />
              ),
          )}
          {group.secondaryLinks && (
            <>
              <NavDivider className="mx-1.5 my-1 w-auto" />
              {group.secondaryLinks.map((link) => (
                <NavLink key={link.href} title={link.title} href={link.href} />
              ))}
            </>
          )}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
