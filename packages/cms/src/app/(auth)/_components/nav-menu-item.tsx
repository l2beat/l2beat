'use client'

import { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

export function NavMenuItem<T extends string>({
  name,
  href,
  icon,
  activeBehavior = { type: 'exact' },
}: {
  name: string
  href: Route<T> | URL
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
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary',
      )}
    >
      {icon}
      {name}
    </Link>
  )
}
