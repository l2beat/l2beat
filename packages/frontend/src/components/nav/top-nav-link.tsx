'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '~/utils/cn'

/**
 * Top nav link component, used in the top navbar.
 */
export function TopNavLink({
  href,
  children,
  large,
  title,
  withoutUnderline,
}: { href: string; large?: boolean; withoutUnderline?: boolean } & (
  | { title: string; children?: never }
  | { title?: never; children: React.ReactNode }
)) {
  const pathname = usePathname()
  return (
    <li className="h-full">
      <Link
        className={cn(
          'flex h-full items-center font-medium',
          large ? 'px-2 text-base md:px-4 md:text-lg' : 'px-2 max-xl:text-sm',
          pathname.startsWith(href) && [
            'pt-0.5 text-brand',
            !withoutUnderline && 'border-b-2 border-current',
          ],
        )}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
      >
        {children ?? title}
      </Link>
    </li>
  )
}
