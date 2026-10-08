import { Fragment, useMemo, useState } from 'react'
import { env } from '~/env'
import { usePathname } from '~/hooks/usePathname'
import { ChevronIcon } from '~/icons/Chevron'
import { GARDEN_PATH } from '~/pages/garden/paths'
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
  SidebarGroupSub,
  SidebarGroupSubButton,
  SidebarGroupSubLink,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from '../../core/Sidebar'
import { DarkThemeToggle } from '../../DarkThemeToggle'
import { CropsMiniBanner } from '../../garden/CropsMiniBanner'
import { Logo } from '../../Logo'
import { SocialLinks } from '../../SocialLinks'
import { NavWhatsNew } from '../../whats-new/NavWhatsNew'
import { NavYourProjects } from '../../your-projects/NavYourProjects'
import { MobileNavTriggerClose } from '../mobile/MobileNavTrigger'
import type { NavGroup } from '../types'

interface Props {
  groups: NavGroup[]
  logoLink: string
  className?: string
}

export function NavSidebar({ groups, logoLink, className }: Props) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const closeMobileSidebar = () => setOpenMobile(false)
  return (
    <Sidebar className={className}>
      {/* On mobile the header mirrors MobileTopNavbar's geometry, so the logo
          and icons stay put when the sidebar covers the navbar. It is sticky
          because iOS Safari only re-tints its status bar from a sticky or
          fixed bar at the top; the full-screen sheet alone keeps the navbar's. */}
      <SidebarHeader className="max-lg:sticky max-lg:top-0 max-lg:h-16 max-lg:bg-background max-lg:px-3.5 max-lg:pt-0 max-lg:pb-px">
        <div className="flex h-[38px] flex-row items-center justify-between max-lg:h-full">
          <a href={logoLink} onClick={closeMobileSidebar}>
            <Logo className="block h-8 w-auto" />
          </a>
          <div className="flex flex-row items-center gap-4 max-lg:gap-2 md:max-lg:gap-3">
            <DarkThemeToggle />
            <div className="size-6 lg:hidden">
              <MobileNavTriggerClose />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {env.CLIENT_SIDE_GARDEN_ENABLED && (
          <SidebarGroup className="mb-2">
            <CropsMiniBanner
              isActive={pathname.startsWith(GARDEN_PATH)}
              onClick={closeMobileSidebar}
            />
          </SidebarGroup>
        )}
        {groups
          .filter((group) => group.section !== 'more')
          .map((group) => (
            <NavGroupItem
              key={group.title}
              group={group}
              closeMobileSidebar={closeMobileSidebar}
            />
          ))}
        <SidebarGroup className="mt-5 mb-1">
          <span className="pl-1.5 font-medium text-2xs text-secondary uppercase tracking-wider">
            And more
          </span>
        </SidebarGroup>
        {/* One block, so the content's gap between groups does not apply. */}
        <div className="flex flex-col">
          {groups
            .filter((group) => group.section === 'more')
            .map((group) => (
              <NavGroupItem
                key={group.title}
                group={group}
                closeMobileSidebar={closeMobileSidebar}
                small
              />
            ))}
        </div>
        <NavYourProjects onNavigate={closeMobileSidebar} />
        <NavWhatsNew onNavigate={closeMobileSidebar} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3.5 pl-1.5">
          <SocialLinks variant="gray" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

/**
 * `small` draws the secondary sections, under "And more", a size down: no
 * icon, smaller text and tighter rows; in the mobile menu the rows keep
 * enough height to tap.
 */
function NavGroupItem({
  group,
  closeMobileSidebar,
  small,
}: {
  group: NavGroup
  closeMobileSidebar: () => void
  small?: boolean
}) {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      {group.type === 'multiple' && (
        <SidebarGroupItem>
          <NavCollapsibleItem
            group={group}
            closeMobileSidebar={closeMobileSidebar}
            small={small}
          />
        </SidebarGroupItem>
      )}
      {group.type === 'single' && group.disabled && (
        <SidebarGroupItem>
          <div
            aria-disabled
            className={cn(
              'flex h-8 items-center gap-2 p-1.5 text-base text-secondary [&>svg]:shrink-0 [&>svg]:stroke-secondary',
              small && 'h-6 py-1 text-sm max-lg:h-8',
            )}
          >
            {!small && group.icon}
            <span className="whitespace-nowrap">{group.title}</span>
            <SoonBadge />
          </div>
        </SidebarGroupItem>
      )}
      {group.type === 'single' && !group.disabled && (
        <SidebarGroupItem>
          <SidebarGroupLink
            href={group.href}
            isActive={isLinkActive({ href: group.href, pathname })}
            onClick={closeMobileSidebar}
            className={cn(small && 'h-6 py-1 text-sm max-lg:h-8')}
          >
            {!small && group.icon}
            <span>{group.title}</span>
          </SidebarGroupLink>
        </SidebarGroupItem>
      )}
    </SidebarGroup>
  )
}

function NavCollapsibleItem({
  group,
  closeMobileSidebar,
  small,
}: {
  group: Extract<NavGroup, { type: 'multiple' }>
  closeMobileSidebar: () => void
  small?: boolean
}) {
  const pathname = usePathname()
  const allGroupLinks = useMemo(() => group.links.flat(), [group.links])
  const isGroupActive = pathname.startsWith('/' + group.match)
  const isAnyLinkActive = allGroupLinks.some((link) =>
    isLinkActive({ href: link.href, pathname, exact: link.exactMatch }),
  )

  const [open, setOpen] = useState(isAnyLinkActive)

  if (allGroupLinks.length === 0) return null

  return (
    <Collapsible className="flex flex-col" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          'group flex items-center gap-1.5 p-1.5',
          small && 'h-6 py-1 max-lg:h-8',
        )}
        data-active={isGroupActive}
      >
        <div className="flex items-center gap-2">
          {!small && <div>{group.icon}</div>}
          <span
            className={cn(
              'font-medium text-base text-primary tracking-tight transition-colors duration-300 group-data-[active=true]:text-chart-pink',
              small && 'text-sm',
            )}
          >
            {group.title}
          </span>
        </div>
        <ChevronIcon
          className={cn(
            '-rotate-90 size-3 fill-primary transition-[rotate,color,fill] duration-300 group-data-[state=open]:rotate-0 group-data-[active=true]:fill-chart-pink',
            small && 'size-2.5',
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarGroupSub>
          {group.links.map((section, index) => (
            // Sections carry no identity of their own, so the index is the key.
            <Fragment key={index}>
              {index > 0 && <SidebarSeparator />}
              {section.map((item) => (
                <Fragment key={item.title}>
                  {item.disabled ? (
                    // Not out yet: drawn like Liquid staking, not a link.
                    <SidebarGroupSubButton
                      aria-disabled
                      className="text-secondary hover:bg-transparent hover:text-secondary aria-disabled:opacity-100"
                    >
                      <span className="leading-tight">{item.title}</span>
                      <SoonBadge />
                    </SidebarGroupSubButton>
                  ) : (
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
                  )}
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
            </Fragment>
          ))}
        </SidebarGroupSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** Marks a section or page that is listed but not out yet. */
function SoonBadge() {
  return (
    <span className="shrink-0 rounded-sm bg-surface-secondary px-1 py-0.5 font-semibold text-[9px] uppercase leading-none tracking-wider">
      Soon
    </span>
  )
}
