import { usePathname } from 'next/navigation'
import { VerticalSeparator } from '../../core/vertical-separator'
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
      <span className="text-base font-bold">{selectedGroup.title}</span>
    </>
  )
}
