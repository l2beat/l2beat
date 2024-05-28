'use client'

import Link from 'next/link'
import { type ActiveLinkProps, useActiveLink } from '~/utils/active-link'
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
    <Link href={href}>
      <li
        className={cn(
          'flex flex-col justify-center h-full relative px-2 font-medium text-base md:px-4 md:text-lg',
          active && 'text-pink-900 dark:text-pink-200',
        )}
      >
        {title}
        {active && (
          <div className="absolute bottom-0 w-full h-[3px] left-0 bg-pink-900" />
        )}
      </li>
    </Link>
  )
}
