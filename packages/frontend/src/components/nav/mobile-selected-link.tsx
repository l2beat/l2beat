'use client'

import { usePathname } from 'next/navigation'
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
    <span className="text-base font-bold text-pink-900 dark:text-pink-200">
      {selectedGroup.title}
    </span>
  )
}
