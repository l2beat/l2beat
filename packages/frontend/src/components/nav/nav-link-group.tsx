'use client'

import { usePathname } from 'next/navigation'
import { ChevronIcon } from '~/icons/chevron'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../core/collapsible'
import { type NavGroup } from './types'

export interface NavLinkGroupProps {
  group: NavGroup
  children?: React.ReactNode
}

/**
 * Group of nav links with a title used in the sidenav.
 */
export function NavLinkGroup({ group, children }: NavLinkGroupProps) {
  const pathname = usePathname()
  const defaultOpen = [...group.links, ...(group.secondaryLinks ?? [])].some(
    (link) => link.href === pathname,
  )
  return (
    <Collapsible className="flex flex-col gap-2" defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="group flex items-baseline gap-1.5">
        <span className="ml-1 text-[0.9375rem] font-medium uppercase leading-[0.9375rem] tracking-tight text-slate-600 dark:text-gray-50">
          {group.title}
        </span>
        <ChevronIcon className="size-3 -rotate-90 fill-slate-600 transition-transform duration-300 group-data-[state=open]:rotate-0 dark:fill-gray-50" />
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <ul className="flex flex-col gap-0.5">{children}</ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
