import { usePathname } from '~/hooks/usePathname'
import { VerticalSeparator } from '../../core/VerticalSeparator'
import type { NavGroup } from '../types'

export function MobileSelectedLink({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const selectedGroup = groups.find((group) =>
    group.type === 'single'
      ? pathname.startsWith(group.href)
      : group.links.some((link) => pathname.startsWith(link.href)),
  )

  if (!selectedGroup) return null

  return (
    <>
      <VerticalSeparator className="h-10" />
      <span className="font-bold text-base">{selectedGroup.title}</span>
    </>
  )
}
