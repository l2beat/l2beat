'use client'

import { cn } from '~/utils/cn'
import { useMobileNav } from './MobileNavContext'

export const NavSideBarWrapper = ({
  children,
  legacyNav,
}: { children: React.ReactNode; legacyNav?: boolean }) => {
  const { open } = useMobileNav()

  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen h-[100dvh]',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  return (
    <div
      className={cn(
        'flex-shrink-0 xl:static absolute flex flex-col items-stretch group translate-x-full duration-300 xl:transform-none xl:sidenav-collapsed:w-20 z-999 transition-all',
        sharedSizeClasses,
        open && 'translate-x-0',
      )}
    >
      {children}
    </div>
  )
}
