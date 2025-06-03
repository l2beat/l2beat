import { useEffect, useMemo, useState } from 'react'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { usePathname } from '~/hooks/usePathname'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { DarkThemeToggle } from '../../DarkThemeToggle'
import { Logo } from '../../Logo'
import { SocialLinks } from '../../SocialLinks'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../core/Collapsible'
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
  SidebarSeparator,
} from '../../core/Sidebar'
import { MobileNavTriggerClose } from '../mobile/MobileNavTrigger'
import type { NavGroup, NavLink } from '../types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  sideLinks: NavLink[]
  topNavbar: boolean
}

export function NavSidebar({ groups, logoLink, sideLinks, topNavbar }: Props) {
  const pathname = usePathname()
  return (
    <Sidebar topNavbar={topNavbar}>
      <SidebarHeader>
        <div className="flex h-[38px] flex-row items-center justify-between">
          <a href={logoLink}>
            <Logo className="block h-8 w-auto" />
          </a>
          <div className="flex flex-row items-center gap-4">
            <DarkThemeToggle />
            <div className="size-6 lg:hidden">
              <MobileNavTriggerClose />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="!mt-2">
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
        <SidebarGroup className="mt-8 gap-1.5">
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
  const allGroupLinks = useMemo(
    () => [...group.links, ...(group.secondaryLinks ?? [])],
    [group.links, group.secondaryLinks],
  )
  const isActive = allGroupLinks.some((link) =>
    getIsActive(link.href, pathname),
  )
  const breakpoint = useBreakpoint()

  const [open, setOpen] = useState(isActive)

  useEffect(() => {
    const isActive = allGroupLinks.some((link) =>
      getIsActive(link.href, pathname),
    )
    setOpen(isActive)
  }, [allGroupLinks, pathname])

  if (!group.links[0]) return null

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      {breakpoint === 'xs' ||
      breakpoint === 'sm' ||
      breakpoint === 'md' ||
      group.preventTitleNavigation ? (
        <CollapsibleTrigger
          className="group flex items-center gap-1.5 p-1.5"
          data-active={isActive}
        >
          <div className="flex items-center gap-2" data-active={isActive}>
            <div>{group.icon}</div>
            <span
              className={cn(
                'font-medium text-base text-primary tracking-tight transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </div>
          <ChevronIcon
            className={cn(
              '-rotate-90 size-3 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
              isActive && 'fill-brand',
            )}
          />
        </CollapsibleTrigger>
      ) : (
        <div className="group flex items-center p-1.5" data-active={isActive}>
          <a
            href={group.links[0].href}
            className="flex items-center gap-2"
            data-active={isActive}
          >
            <div>{group.icon}</div>
            <span
              className={cn(
                'font-medium text-base text-primary tracking-tight transition-colors duration-300 ',
                isActive && 'text-brand',
              )}
            >
              {group.title}
            </span>
          </a>
          <CollapsibleTrigger className="group size-6">
            <ChevronIcon
              className={cn(
                '-rotate-90 m-auto size-3 fill-primary transition-[transform,_color,_fill] duration-300 group-data-[state=open]:rotate-0',
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
              <SidebarSeparator />
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
