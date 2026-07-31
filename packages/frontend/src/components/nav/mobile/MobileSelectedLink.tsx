import { usePathname } from '~/hooks/usePathname'
import { cn } from '~/utils/cn'
import { isLinkActive } from '~/utils/isLinkActive'
import { VerticalSeparator } from '../../core/VerticalSeparator'
import type { NavGroup, NavLink } from '../types'

export function MobileSelectedLink({
  groups,
  sideLinks,
  className,
}: {
  groups: NavGroup[]
  sideLinks: NavLink[]
  className?: string
}) {
  const pathname = usePathname()

  const selectedGroup = groups.find((group) => {
    if (group.type === 'single') {
      return isLinkActive({ href: group.href, pathname })
    }
    return [...group.links, ...(group.secondaryLinks ?? [])].some((link) =>
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
      <span className={cn('font-bold text-base', className)}>
        {selectedGroup?.title ?? selectedSideLink?.title}
      </span>
    </>
  )
}
