import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'
import { OverflowWrapper } from '../../core/OverflowWrapper'
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
  if (!currentGroup) return null

  const links = currentGroup.links.flat()

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
      <NavTabRow links={links} pathname={pathname} row="main" />
      {activeSubLinks && (
        <NavTabRow
          links={activeSubLinks}
          pathname={pathname}
          row="sub"
          tabClassName="h-8 text-2xs"
        />
      )}
    </>
  )
}

function NavTabRow({
  links,
  pathname,
  row,
  tabClassName,
}: {
  links: NavLink[]
  pathname: string
  /** Keys the underline, which slides along its row between pages. */
  row: 'main' | 'sub'
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
                href={link.href}
                key={link.href}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                  'relative flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b bg-header-primary px-4 font-medium text-xs leading-none',
                  'data-[state=selected]:text-nav-active',
                  tabClassName,
                )}
              >
                {link.shortTitle ?? link.title}
                {/* Its own box over the border, so it can slide to the tab
                    opened on the next page (pageTransitions.ts). */}
                {isSelected && (
                  <span
                    aria-hidden
                    data-tab-line={row}
                    className="-bottom-px absolute inset-x-0 h-px bg-nav-active"
                  />
                )}
              </a>
            )
          })}
      </div>
    </OverflowWrapper>
  )
}
