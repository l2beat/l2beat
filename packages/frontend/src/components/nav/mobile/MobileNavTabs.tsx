import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'
import { OverflowWrapper } from '../../core/OverflowWrapper'
import { useNavLinkHref } from '../navLinkHref'
import type { NavGroup, NavLink } from '../types'

/**
 * Second navbar displayed under the main navbar on mobile. When the active
 * link has sub-links, they are shown as a contextual second row of tabs.
 */
export function MobileNavTabs({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()

  const currentGroup = groups
    .filter((g) => g.type === 'multiple')
    .find((g) => {
      const firstLink = g.links[0]?.[0]
      return (
        firstLink &&
        isLinkActive({ href: `/${firstLink.href.split('/')[1]}`, pathname }) &&
        !g.disableMobileTabs
      )
    })
  const links = currentGroup?.links.flat() ?? []
  const getHref = useNavLinkHref(links)
  if (!currentGroup) return null

  // Do not display the tabs if the current group is not found,
  // or the current group does not have a link that matches the current path.
  const display = links.some(({ href }) => isLinkActive({ href, pathname }))
  if (!display) return null

  const activeSubLinks = links.find(
    (link) =>
      link.subLinks?.length && isLinkActive({ href: link.href, pathname }),
  )?.subLinks

  return (
    <>
      <NavTabRow links={links} pathname={pathname} getHref={getHref} />
      {activeSubLinks && (
        <NavTabRow
          links={activeSubLinks}
          pathname={pathname}
          getHref={getHref}
          tabClassName="h-8 text-2xs"
        />
      )}
    </>
  )
}

function NavTabRow({
  links,
  pathname,
  getHref,
  tabClassName,
}: {
  links: NavLink[]
  pathname: string
  getHref: (link: NavLink) => string
  tabClassName?: string
}) {
  return (
    <OverflowWrapper className="bg-surface-primary">
      <div className="flex">
        {links
          .filter((link) => !link.disabled)
          .map((link) => {
            const isSelected = isLinkActive({
              href: link.href,
              pathname,
              exact: link.exactMatch,
            })
            return (
              <a
                ref={(node) => {
                  if (node && isSelected) {
                    node.scrollIntoView({
                      block: 'nearest',
                      inline: 'center',
                    })
                  }
                }}
                href={getHref(link)}
                key={link.href}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                  'flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b bg-header-primary px-4 font-medium text-xs leading-none',
                  'data-[state=selected]:border-nav-active data-[state=selected]:text-nav-active',
                  tabClassName,
                )}
              >
                {link.shortTitle ?? link.title}
              </a>
            )
          })}
      </div>
    </OverflowWrapper>
  )
}
