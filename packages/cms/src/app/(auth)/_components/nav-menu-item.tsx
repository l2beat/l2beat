'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

export function NavMenuItem({
  name,
  href,
  icon,
  activeBehavior = { type: 'exact' },
}: {
  name: string
  href: string
  icon: React.ReactNode
  activeBehavior?: { type: 'exact' } | { type: 'prefix'; prefix: string }
}) {
  const pathname = usePathname()
  const isActive =
    activeBehavior.type === 'exact'
      ? pathname === href
      : pathname.startsWith(activeBehavior.prefix)
  return (
    <Link
      key={name}
      href={href}
      className={cn(
        'text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
        isActive && 'bg-muted text-primary',
      )}
    >
      {icon}
      {name}
    </Link>
  )
}
