'use client'

import { usePathname } from 'next/navigation'

export interface ActiveLinkProps {
  href: string
  activeBehavior?: { type: 'exact' } | { type: 'prefix'; prefix?: string }
}

export function useActiveLink({
  href,
  activeBehavior = { type: 'exact' },
}: ActiveLinkProps) {
  const pathname = usePathname()

  const active =
    activeBehavior.type === 'exact'
      ? pathname === href
      : activeBehavior.type === 'prefix'
        ? pathname.startsWith(activeBehavior.prefix ?? href)
        : false

  return active
}
