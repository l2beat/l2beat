import { useMemo, useState } from 'react'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { usePathname } from '~/hooks/usePathname'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
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
  SidebarGroupLinkLevel1,
  SidebarGroupLinkLevel2,
  SidebarGroupSmallLink,
  SidebarGroupSubItem,
  SidebarGroupWrapper,
  SidebarHeader,
  SidebarSeparator,
} from '../../core/Sidebar'
import { DarkThemeToggle } from '../../DarkThemeToggle'
import { Logo } from '../../Logo'
import { SocialLinks } from '../../SocialLinks'
import { MobileNavTriggerClose } from '../mobile/MobileNavTrigger'
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
      <SidebarContent className="mt-2!">
        {groups.map((group) => {
          return (
            <SidebarGroupWrapper key={group.title}>
              {group.type === 'multiple' && (
                <SidebarGroupItem>
                  <NavCollapsibleItem group={group} />
                </SidebarGroupItem>
              )}
              {group.type === 'single' && (
                <SidebarGroupItem key={group.title}>
                  <SidebarGroupLink
                    href={group.href}
                    isActive={getIsActive(group.href, pathname, {
                      exact: group.exactMatch,
                    })}
                  >
                    {group.icon}
                    <span>{group.title}</span>
                  </SidebarGroupLink>
                </SidebarGroupItem>
              )}
            </SidebarGroupWrapper>
          )
        })}
        <SidebarGroupWrapper className="mt-8 gap-1.5">
          {sideLinks.map((link) => (
            <SidebarGroupItem key={link.title}>
              <SidebarGroupSmallLink
                href={link.href}
                isActive={getIsActive(link.href, pathname, {
                  exact: link.exactMatch,
                })}
              >
                {link.title}
                {link.accessory}
              </SidebarGroupSmallLink>
            </SidebarGroupItem>
          ))}
        </SidebarGroupWrapper>
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
}: {
  group: Extract<NavGroup, { type: 'multiple' }>
}) {
  const pathname = usePathname()
  const allGroupLinks = useMemo(
    () => [...group.links, ...(group.secondaryLinks ?? [])],
    [group.links, group.secondaryLinks],
  )
  const isGroupActive = pathname.startsWith('/' + group.match)
  const isAnyLinkActive = allGroupLinks.some((link) =>
    getIsActive(link.href, pathname, { exact: link.exactMatch }),
  )
  const breakpoint = useBreakpoint()

  const [open, setOpen] = useState(isAnyLinkActive)

  if (!group.links[0]) return null

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      {breakpoint === 'xs' ||
      breakpoint === 'sm' ||
      breakpoint === 'md' ||
      group.preventTitleNavigation ? (
        <CollapsibleTrigger
          className="group flex items-center gap-1.5 p-1.5"
          data-active={isGroupActive}
        >
          <div className="flex items-center gap-2">
            <div>{group.icon}</div>
            <span className="font-medium text-base text-primary tracking-tight transition-colors duration-300 group-data-[active=true]:text-brand">
              {group.title}
            </span>
          </div>
          <ChevronIcon
            className={cn(
              '-rotate-90 size-3 fill-primary transition-[rotate,color,fill] duration-300 group-data-[state=open]:rotate-0 group-data-[active=true]:fill-brand',
            )}
          />
        </CollapsibleTrigger>
      ) : (
        <div
          className="group flex items-center p-1.5"
          data-active={isGroupActive}
        >
          <a href={group.links[0].href} className="flex items-center gap-2">
            <div>{group.icon}</div>
            <span className="font-medium text-base text-primary tracking-tight transition-colors duration-300 group-data-[active=true]:text-brand">
              {group.title}
            </span>
          </a>
          <CollapsibleTrigger className="group size-6">
            <ChevronIcon className="-rotate-90 m-auto size-3 fill-primary transition-[rotate,color,fill] duration-300 group-data-[state=open]:rotate-0 group-data-[active=true]:fill-brand" />
          </CollapsibleTrigger>
        </div>
      )}
      <CollapsibleContent>
        <SidebarGroup>
          {group.links.map((item) => (
            <SidebarGroupSubItem key={item.title}>
              <SidebarGroupLinkLevel1
                href={item.href}
                isActive={getIsActive(item.href, pathname, {
                  exact: item.exactMatch,
                })}
              >
                <span className="leading-tight">{item.title}</span>
              </SidebarGroupLinkLevel1>
              {item.subLinks && item.subLinks.length > 0 && (
                <SidebarGroup className="mt-2.5 mb-2 gap-2">
                  {item.subLinks.map((subItem) => (
                    <SidebarGroupLinkLevel2
                      key={subItem.title}
                      href={subItem.href}
                      isActive={getIsActive(subItem.href, pathname, {
                        exact: subItem.exactMatch,
                      })}
                    >
                      {subItem.title}
                    </SidebarGroupLinkLevel2>
                  ))}
                </SidebarGroup>
              )}
            </SidebarGroupSubItem>
          ))}
          {group.secondaryLinks && group.secondaryLinks.length > 0 && (
            <>
              <SidebarSeparator />
              {group.secondaryLinks.map((item) => (
                <SidebarGroupLinkLevel1
                  href={item.href}
                  key={item.title}
                  isActive={getIsActive(item.href, pathname, {
                    exact: item.exactMatch,
                  })}
                >
                  <span>{item.title}</span>
                </SidebarGroupLinkLevel1>
              ))}
            </>
          )}
        </SidebarGroup>
      </CollapsibleContent>
    </Collapsible>
  )
}

function getIsActive(
  href: string,
  pathname: string,
  opts?: { exact?: boolean },
) {
  if (opts?.exact) {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(href + '/')
}
