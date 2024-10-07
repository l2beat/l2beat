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
        className="group flex items-center gap-2 p-1.5"
        data-active={isSelected}
      >
        {group.icon}
        <span
          className={cn(
            'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300',
            isSelected && 'text-brand',
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
    <Collapsible className="flex flex-col" defaultOpen={isSelected}>
      <CollapsibleTrigger
        className="group flex items-center gap-2 p-1.5"
        data-active={isSelected}
      >
        {group.icon}
        <div className="flex items-baseline gap-1.5">
          <span
            className={cn(
              'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300 ',
              isSelected && 'text-brand',
            )}
          >
            {group.title}
          </span>
          <ChevronIcon
            className={cn(
              'size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
              isSelected && 'fill-brand',
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mb-3 ml-[15px] mt-2 flex flex-col gap-0.5 border-l border-gray-300 pl-[14px] dark:border-gray-850">
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
