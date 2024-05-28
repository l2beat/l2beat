'use client'

import { useEffect, useState } from 'react'
import { cn } from '~/utils/cn'
import { useMobileNav } from './MobileNavContext'

export const NavSideBarWrapper = ({
  children,
  legacyNav,
}: { children: React.ReactNode; legacyNav?: boolean }) => {
  const { open } = useMobileNav()
  const [resizing, setResizing] = useState(false)

  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen h-dvh',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const onResize = () => {
      clearTimeout(timeout)
      setResizing(true)
      timeout = setTimeout(() => setResizing(false), 300)
    }

    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div
      className={cn(
        'flex-shrink-0 xl:static absolute flex flex-col items-stretch translate-x-full duration-300 xl:transform-none xl:sidenav-collapsed:w-20 z-999 transition-all ease-out',
        sharedSizeClasses,
        open && 'translate-x-0',
        resizing && 'transition-none',
      )}
    >
      <div
        className={cn(
          'bg-[#E6E7EC] dark:bg-[#1E1C21] xl:dark:border-r dark:border-gray-850 dark:border-r-0 flex flex-col xl:fixed xl:sidenav-collapsed:w-20 overflow-x-clip transition-all ease-out',
          sharedSizeClasses,
          resizing && 'transition-none',
        )}
      >
        {children}
      </div>
    </div>
  )
}
