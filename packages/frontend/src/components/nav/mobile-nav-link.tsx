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
          'relative flex h-full flex-col justify-center px-2 text-base font-medium md:px-4 md:text-lg',
          active && 'text-brand',
        )}
      >
        {title}
        {active && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-brand" />
        )}
      </Link>
    </li>
  )
}
