import { Fragment, useMemo, useState } from 'react'
import { usePathname } from '~/hooks/usePathname'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'
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
  SidebarGroupSubLink,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
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
  const { setOpenMobile } = useSidebar()
  const closeMobileSidebar = () => setOpenMobile(false)
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-[38px] flex-row items-center justify-between">
          <a href={logoLink} onClick={closeMobileSidebar}>
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
      <SidebarContent>
        {groups.map((group) => {
          return (
            <SidebarGroup key={group.title}>
              {group.type === 'multiple' && (
                <SidebarGroupItem>
                  <NavCollapsibleItem
                    group={group}
                    closeMobileSidebar={closeMobileSidebar}
                  />
                </SidebarGroupItem>
              )}
              {group.type === 'single' && (
                <SidebarGroupItem key={group.title}>
                  <SidebarGroupLink
                    href={group.href}
                    isActive={isLinkActive({ href: group.href, pathname })}
                    onClick={closeMobileSidebar}
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
                isActive={isLinkActive({ href: link.href, pathname })}
                onClick={closeMobileSidebar}
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
  closeMobileSidebar,
}: {
  group: Extract<NavGroup, { type: 'multiple' }>
  closeMobileSidebar: () => void
}) {
  const pathname = usePathname()
  const allGroupLinks = useMemo(
    () => [...group.links, ...(group.secondaryLinks ?? [])],
    [group.links, group.secondaryLinks],
  )
  const isGroupActive = pathname.startsWith('/' + group.match)
  const isAnyLinkActive = allGroupLinks.some((link) =>
    isLinkActive({ href: link.href, pathname, exact: link.exactMatch }),
  )

  const [open, setOpen] = useState(isAnyLinkActive)

  if (!group.links[0]) return null

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
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
      <CollapsibleContent>
        <SidebarGroupSub>
          {group.links.map((item) => (
            <Fragment key={item.title}>
              <SidebarGroupSubButton
                href={item.href}
                isActive={isLinkActive({
                  href: item.href,
                  pathname,
                  exact: item.exactMatch,
                })}
                onClick={closeMobileSidebar}
              >
                <span className="leading-tight">{item.title}</span>
              </SidebarGroupSubButton>
              {item.subLinks && item.subLinks.length > 0 && (
                <SidebarGroupSub className="mt-1 mb-1.5 gap-2">
                  {item.subLinks.map((subItem) => (
                    <SidebarGroupSubLink
                      key={subItem.title}
                      href={subItem.href}
                      isActive={isLinkActive({
                        href: subItem.href,
                        pathname,
                        exact: subItem.exactMatch,
                      })}
                      onClick={closeMobileSidebar}
                    >
                      {subItem.title}
                    </SidebarGroupSubLink>
                  ))}
                </SidebarGroupSub>
              )}
            </Fragment>
          ))}
          {group.secondaryLinks && group.secondaryLinks.length > 0 && (
            <>
              <SidebarSeparator />
              {group.secondaryLinks.map((item) => (
                <SidebarGroupSubButton
                  href={item.href}
                  key={item.title}
                  isActive={isLinkActive({
                    href: item.href,
                    pathname,
                    exact: item.exactMatch,
                  })}
                  onClick={closeMobileSidebar}
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
