import { usePathname } from '~/hooks/usePathname'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { isLinkActive } from '~/utils/isLinkActive'
import { VerticalSeparator } from '../../core/VerticalSeparator'
import type { NavGroup, NavLink } from '../types'

export function MobileSelectedLink({
  groups,
  sideLinks,
}: {
  groups: NavGroup[]
  sideLinks: NavLink[]
}) {
  const pathname = usePathname()

  const selectedGroup = groups.find((group) => {
    if (group.type === 'single') {
      return isLinkActive({ href: group.href, pathname })
    }
    return group.links
      .flat()
      .some((link) => isLinkActive({ href: link.href, pathname }))
  })

  const selectedSideLink = sideLinks.find((link) =>
    pathname.startsWith(link.href),
  )

  // The garden sits above the sections in the sidebar, outside the groups.
  const title = pathname.startsWith(GARDEN_PATH)
    ? 'CROPS'
    : (selectedGroup?.title ?? selectedSideLink?.title)
  if (!title) return null

  return (
    <>
      <VerticalSeparator className="h-10" />
      <span className="font-bold text-base">{title}</span>
    </>
  )
}
