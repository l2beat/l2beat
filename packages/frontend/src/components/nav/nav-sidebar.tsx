'use client'
import { env } from '~/env'
import type { NavGroup } from './types'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '../core/sidebar'
import { MobileNavTriggerClose } from './mobile-nav-trigger'
import { DarkThemeToggle } from '../dark-theme-toggle'
import Link from 'next/link'
import { Logo } from '../logo'
import { SocialLinks } from '../social-links'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../core/collapsible'
import { ChevronIcon } from '~/icons/chevron'
import { externalLinks } from '~/consts/external-links'
import { HiringBadge } from '../badge/hiring-badge'
import { NavSmallLink } from './nav-small-link'
import { NavSmallLinkGroup } from './nav-small-link-group'
import { usePathname } from 'next/navigation'
import { cn } from '~/utils/cn'

interface Props {
  groups: NavGroup[]
  logoLink: string
  topNavbar: boolean
}

export function NavSidebar({ groups, logoLink, topNavbar }: Props) {
  const pathname = usePathname()
  const hiringBadge = env.NEXT_PUBLIC_SHOW_HIRING_BADGE
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
                    <Collapsible>
                      <SidebarMenuItem>
                        <CollapsibleTrigger
                          data-active={group.links.some((link) =>
                            isActive(link.href, pathname),
                          )}
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
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )}
                  {group.type === 'single' && (
                    <SidebarMenuItem key={group.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(group.href, pathname)}
                      >
                        <Link href={group.href}>
                          {group.icon}
                          <span>{group.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavSmallLinkGroup className="mt-5">
          <NavSmallLink title="About Us" href="/about-us" />
          <NavSmallLink title="Forum" href={externalLinks.forum} />
          <NavSmallLink title="Donate" href="/donate" />
          <NavSmallLink
            title="Governance"
            href="/governance"
            activeBehavior={{ type: 'prefix', prefix: '/governance' }}
          />
          <NavSmallLink title="Glossary" href="/glossary" />
          <NavSmallLink href="https://l2beat.notion.site/We-are-hiring-Work-at-L2BEAT-e4e637265ae94c5db7dfa2de336b940f">
            Jobs
            {hiringBadge && <HiringBadge />}
          </NavSmallLink>
          <NavSmallLink
            title="Brand Kit"
            href="https://l2beat.notion.site/L2BEAT-Brand-Guidelines-f8b757302c0043e2839f22277781162b"
          />
          <NavSmallLink title="FAQ" href="/faq" />
        </NavSmallLinkGroup>
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
