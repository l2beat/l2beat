import { usePathname } from '~/hooks/usePathname'
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
  const selectedGroup = groups.find((group) =>
    group.type === 'single'
      ? pathname.startsWith(group.href)
      : group.links.some((link) => pathname.startsWith(link.href)),
  )

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
