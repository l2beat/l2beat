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
import { HorizontalSeparator } from '../core/horizontal-separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuLink,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSmallLink,
} from '../core/sidebar'
import { DarkThemeToggle } from '../dark-theme-toggle'
import { Logo } from '../logo'
import { SocialLinks } from '../social-links'
import { MobileNavTriggerClose } from './mobile-nav-trigger'
import type { NavGroup, NavLink } from './types'

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
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.type === 'multiple' && (
                    <Collapsible
                      defaultOpen={[
                        ...group.links,
                        ...(group.secondaryLinks ?? []),
                      ].some((link) => isActive(link.href, pathname))}
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger
                          data-active={[
                            ...group.links,
                            ...(group.secondaryLinks ?? []),
                          ].some((link) => isActive(link.href, pathname))}
                          className={cn(
                            'group flex cursor-pointer items-center gap-2 p-2 text-base',
                            'data-[active=true]:text-brand',
                          )}
                        >
                          {group.icon}
                          <span>{group.title}</span>
                          <ChevronIcon className="size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]/collapsible:rotate-0 group-data-[active=true]:fill-brand" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {group.links.map((item) => (
                              <SidebarMenuSubButton
                                href={item.href}
                                key={item.title}
                                isActive={isActive(item.href, pathname)}
                              >
                                <span>{item.title}</span>
                              </SidebarMenuSubButton>
                            ))}
                            {group.secondaryLinks &&
                              group.secondaryLinks.length > 0 && (
                                <>
                                  <HorizontalSeparator />
                                  {group.secondaryLinks.map((item) => (
                                    <SidebarMenuSubButton
                                      href={item.href}
                                      key={item.title}
                                      isActive={isActive(item.href, pathname)}
                                    >
                                      <span>{item.title}</span>
                                    </SidebarMenuSubButton>
                                  ))}
                                </>
                              )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )}
                  {group.type === 'single' && (
                    <SidebarMenuItem key={group.title}>
                      <SidebarMenuLink
                        href={group.href}
                        isActive={isActive(group.href, pathname)}
                      >
                        {group.icon}
                        <span>{group.title}</span>
                      </SidebarMenuLink>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
        <SidebarGroup className="-top-px mt-auto">
          <SidebarMenu className="mt-1">
            {sideLinks.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuSmallLink
                  href={link.href}
                  isActive={isActive(link.href, pathname)}
                >
                  {link.title}
                  {link.accessory}
                </SidebarMenuSmallLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
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

function isActive(
  href: string,
  pathname: string,
  activeBehavior: { type: 'exact' } | { type: 'prefix'; prefix?: string } = {
    type: 'exact',
  },
) {
  const active =
    activeBehavior.type === 'exact'
      ? pathname === href
      : activeBehavior.type === 'prefix'
        ? pathname.startsWith(activeBehavior.prefix ?? href)
        : false
  return active
}
