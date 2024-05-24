import { usePathname } from 'next/navigation'

export interface ActiveLinkProps {
  href: string
  activeBehavior?: 'exact' | 'prefix' | ((path: string) => boolean)
}

export function useActiveLink({
  href,
  activeBehavior = 'exact',
}: ActiveLinkProps) {
  const pathname = usePathname()

  const active =
    activeBehavior === 'exact'
      ? pathname === href
      : activeBehavior === 'prefix'
        ? pathname.startsWith(href)
        : activeBehavior(pathname)

  return active
}
