'use client'

import { usePathname } from 'next/navigation'
import { NavDivider } from './nav-divider'
import { type NavGroup } from './types'

export function MobileSelectedLink({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const selectedGroup = groups.find((group) =>
    group.type === 'single'
      ? group.href === pathname
      : group.links.some((link) => link.href === pathname),
  )

  if (!selectedGroup) return null

  return (
    <>
      <NavDivider orientation="vertical" className="h-10" />
      <span className="text-base font-bold">{selectedGroup.title}</span>
    </>
  )
}
