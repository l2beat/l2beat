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
} from '../../core/collapsible'
import { HorizontalSeparator } from '../../core/horizontal-separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupItem,
  SidebarGroupLink,
  SidebarGroupSmallLink,
  SidebarGroupSub,
  SidebarGroupSubButton,
  SidebarHeader,
} from '../../core/sidebar'
import { DarkThemeToggle } from '../../dark-theme-toggle'
import { Logo } from '../../logo'
import { SocialLinks } from '../../social-links'
import { MobileNavTriggerClose } from '../mobile/mobile-nav-trigger'
import type { NavGroup, NavLink } from '../types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  sideLinks: NavLink[]
}

export function NavSidebar({ groups, logoLink, sideLinks }: Props) {
  const pathname = usePathname()
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[38px] flex-row items-center justify-between">
          <Link href={logoLink}>
            <Logo className="block h-8 w-auto" />
          </Link>
          <div className="flex flex-row items-center gap-4">
            <DarkThemeToggle />
            <div className="size-6 lg:hidden">
              <MobileNavTriggerClose />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => {
          return (
            <SidebarGroup key={group.title}>
              {group.type === 'multiple' && (
                <SidebarGroupItem>
                  <NavCollapsibleItem group={group} />
                </SidebarGroupItem>
              )}
              {group.type === 'single' && (
                <SidebarGroupItem key={group.title}>
                  <SidebarGroupLink
                    href={group.href}
                    isActive={getIsActive(group.href, pathname)}
                  >
                    {group.icon}
                    <span>{group.title}</span>
                  </SidebarGroupLink>
                </SidebarGroupItem>
              )}
            </SidebarGroup>
          )
        })}
        <SidebarGroup className="-top-px mt-auto">
          {sideLinks.map((link) => (
            <SidebarGroupItem key={link.title}>
              <SidebarGroupSmallLink
                href={link.href}
                isActive={getIsActive(link.href, pathname)}
              >
                {link.title}
                {link.accessory}
              </SidebarGroupSmallLink>
            </SidebarGroupItem>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2 lg:justify-between">
          <SocialLinks variant="gray" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavCollapsibleItem({
  group,
}: { group: Extract<NavGroup, { type: 'multiple' }> }) {
  const pathname = usePathname()
  const isActive = group.links.some((link) => getIsActive(link.href, pathname))
  const breakpoint = useBreakpoint()

  const [open, setOpen] = useState(isActive)

  useEffect(() => {
    const isActive = group.links.some((link) =>
      getIsActive(link.href, pathname),
    )
    setOpen(isActive)
  }, [group, pathname])

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      {breakpoint === 'mobile' || breakpoint === 'tablet' ? (
        <CollapsibleTrigger
          className="group flex items-center gap-1.5 p-1.5"
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
        <div className="group flex items-center p-1.5" data-active={isActive}>
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
        <SidebarGroupSub>
          {group.links.map((item) => (
            <SidebarGroupSubButton
              href={item.href}
              key={item.title}
              isActive={getIsActive(item.href, pathname)}
            >
              <span>{item.title}</span>
            </SidebarGroupSubButton>
          ))}
          {group.secondaryLinks && group.secondaryLinks.length > 0 && (
            <>
              <HorizontalSeparator />
              {group.secondaryLinks.map((item) => (
                <SidebarGroupSubButton
                  href={item.href}
                  key={item.title}
                  isActive={getIsActive(item.href, pathname)}
                >
                  <span>{item.title}</span>
                </SidebarGroupSubButton>
              ))}
            </>
          )}
        </SidebarGroupSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function getIsActive(href: string, pathname: string) {
  return pathname === href
}
