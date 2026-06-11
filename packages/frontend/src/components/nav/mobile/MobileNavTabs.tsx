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
      return (
        g.links[0] &&
        isLinkActive({ href: `/${g.links[0].href.split('/')[1]}`, pathname }) &&
        !g.disableMobileTabs
      )
    })
  if (!currentGroup) return null

  const links = [...currentGroup.links, ...(currentGroup.secondaryLinks ?? [])]

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
      <NavTabRow links={links} pathname={pathname} />
      {activeSubLinks && (
        <NavTabRow
          links={activeSubLinks}
          pathname={pathname}
          tabClassName="h-8 text-2xs"
        />
      )}
    </>
  )
}

function NavTabRow({
  links,
  pathname,
  tabClassName,
}: {
  links: NavLink[]
  pathname: string
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
                  'flex h-10 w-full items-center justify-center whitespace-nowrap border-divider border-b bg-header-primary px-4 font-medium text-xs leading-none',
                  'data-[state=selected]:border-brand data-[state=selected]:text-brand',
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
