'use client'

import { usePathname } from 'next/navigation'
import { cn } from '~/utils/cn'

/**
 * Legacy nav link component, used in the legacy navbar.
 */
export function LegacyNavLink({
  href,
  children,
  large,
  title,
}: { href: string; large?: boolean } & (
  | { title: string; children?: never }
  | { title?: never; children: React.ReactNode }
)) {
  const pathname = usePathname()
  return (
    <li className="h-full">
      <a
        className={cn(
          'flex h-full items-center font-medium',
          large ? 'px-2 text-base md:px-4 md:text-lg' : 'px-2',
          pathname === href &&
            'border-b-2 border-current pt-0.5 text-pink-900 dark:text-pink-200',
        )}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
      >
        {children ?? title}
      </a>
    </li>
  )
}
