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
import { cn } from '~/utils/cn'
import { ChevronIcon } from '~/icons/chevron'
import { externalLinks } from '~/consts/external-links'
import { HiringBadge } from '../badge/hiring-badge'
import { NavSmallLink } from './nav-small-link'
import { NavSmallLinkGroup } from './nav-small-link-group'

interface Props {
  groups: NavGroup[]
  logoLink: string
  topNavbar: boolean
}

export async function NavSidebar({ groups, logoLink, topNavbar }: Props) {
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
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.type === 'multiple' && (
                  <Collapsible>
                    <SidebarMenuItem>
                      <CollapsibleTrigger className="flex cursor-pointer items-center gap-1.5 p-1.5">
                        {group.icon}
                        <span className="ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300 group-data-[active=true]:text-brand">
                          {group.title}
                        </span>
                        <ChevronIcon className="size-3 -rotate-90 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]/collapsible:rotate-0 group-data-[active=true]:fill-brand" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.links.map((item) => (
                            <SidebarMenuSubButton asChild key={item.title}>
                              <Link href={item.href}>
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )}
                {group.type === 'single' && (
                  <SidebarMenuItem key={group.title}>
                    <SidebarMenuButton asChild>
                      <Link href={group.href}>
                        {group.icon}
                        <span
                          className={cn(
                            'ml-1 text-base font-medium tracking-tight text-primary transition-colors duration-300',
                            // isActive && 'text-brand',
                          )}
                        >
                          {group.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
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
