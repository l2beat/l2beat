'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../core/collapsible'
import { NavDivider } from './nav-divider'
import { NavLink } from './nav-link'
import type { NavGroup } from './types'

export interface NavLinkGroupProps {
  group: NavGroup
}

/**
 * Group of nav links with a title used in the sidenav.
 */
export function NavLinkGroup({ group }: NavLinkGroupProps) {
  if (group.type === 'single') {
    return <NavLinkGroupSingleLink group={group} />
  }

  return <NavLinkMultipleGroup group={group} />
}

function NavLinkGroupSingleLink({
  group,
}: { group: Extract<NavGroup, { type: 'single' }> }) {
  const pathname = usePathname()
  const isActive = getIsActive({ pathname, group })
  return (
    <Link
      href={group.href}
      className="group flex items-center gap-2 p-1.5"
      data-active={isActive}
    >
      {group.icon}
      <span
        className={cn(
          'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300',
          isActive && 'text-brand',
        )}
      >
        {group.title}
      </span>
    </Link>
  )
}

function NavLinkMultipleGroup({
  group,
}: { group: Extract<NavGroup, { type: 'multiple' }> }) {
  const pathname = usePathname()
  const isActive = getIsActive({ pathname, group })
  const breakpoint = useBreakpoint()

  const [open, setOpen] = useState(isActive)

  useEffect(() => {
    const isActive = getIsActive({ pathname, group })
    setOpen(isActive)
  }, [group, pathname])

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      {breakpoint === 'mobile' || breakpoint === 'tablet' ? (
        <CollapsibleTrigger
          className="group flex cursor-pointer items-center gap-1.5 p-1.5"
          data-active={isActive}
        >
          <div className="flex items-center gap-2" data-active={isActive}>
            <div>{group.icon}</div>
            <span
              className={cn(
                'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </div>
          <ChevronIcon
            className={cn(
              'size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
              isActive && 'fill-brand',
            )}
          />
        </CollapsibleTrigger>
      ) : (
        <div
          className="group flex cursor-pointer items-center p-1.5"
          data-active={isActive}
        >
          <Link
            href={group.links[0]!.href}
            className="flex items-center gap-2"
            data-active={isActive}
          >
            <div>{group.icon}</div>
            <span
              className={cn(
                'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </Link>
          <CollapsibleTrigger className="group size-6">
            <ChevronIcon
              className={cn(
                'm-auto size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
                isActive && 'fill-brand',
              )}
            />
          </CollapsibleTrigger>
        </div>
      )}
      <CollapsibleContent>
        <ul className="mb-3 ml-[15px] mt-2 flex flex-col gap-0.5 border-l border-divider pl-[14px]">
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

function getIsActive({
  pathname,
  group,
}: { pathname: string; group: NavGroup }) {
  return pathname.startsWith(`/${group.match}`)
}
