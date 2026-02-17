import { usePathname } from '~/hooks/usePathname'
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
    return group.links.some((link) =>
      isLinkActive({ href: link.href, pathname }),
    )
  })

  const selectedSideLink = sideLinks.find((link) =>
    pathname.startsWith(link.href),
  )

  if (!selectedGroup && !selectedSideLink) return null

  return (
    <>
      <VerticalSeparator className="h-10" />
      <span className="font-bold text-base">
        {selectedGroup?.title ?? selectedSideLink?.title}
      </span>
    </>
  )
}
