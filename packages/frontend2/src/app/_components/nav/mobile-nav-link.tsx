'use client'

import Link from 'next/link'
import { type ActiveLinkProps, useActiveLink } from '~/hooks/use-active-link'
import { cn } from '~/utils/cn'

export type MobileNavLinkProps = (
  | { title: string; children?: undefined }
  | { children: React.ReactNode; title?: undefined }
) &
  ActiveLinkProps

/**
 * Navigation link component used in the mobile navbar.
 */
export function MobileNavLink({
  title,
  href,
  activeBehavior,
}: MobileNavLinkProps) {
  const active = useActiveLink({ href, activeBehavior })

  return (
    <li>
      <Link
        href={href}
        className={cn(
          'flex flex-col justify-center h-full relative px-2 font-medium text-base md:px-4 md:text-lg',
          active && 'text-pink-900 dark:text-pink-200',
        )}
      >
        {title}
        {active && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-pink-900" />
        )}
      </Link>
    </li>
  )
}
