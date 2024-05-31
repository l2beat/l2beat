'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '~/utils/cn'
import { useMobileNav } from './mobile-nav-context'
import { NavSideBarCollapseToggle } from './nav-sidebar-collapse-toggle'

export const NavSideBarWrapper = ({
  children,
  legacyNav,
}: { children: React.ReactNode; legacyNav?: boolean }) => {
  const { open } = useMobileNav()
  const ref = useRef<HTMLDivElement>(null)
  const [resizing, setResizing] = useState(false)
  const [overflows, setOverflows] = useState(false)

  const sharedSizeClasses = cn(
    'w-full xl:w-[240px] 2xl:w-[280px] h-screen [@supports(height:100dvh)]:h-dvh',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const onResize = () => {
      clearTimeout(timeout)
      setResizing(true)
      setOverflows(
        (ref.current?.scrollHeight ?? 0) > (ref.current?.clientHeight ?? 0),
      )
      timeout = setTimeout(() => setResizing(false), 300)
    }

    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', onResize)
    }
  }, [ref])

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
          'bg-[#E6E7EC] dark:bg-[#1E1C21] xl:dark:border-r dark:border-gray-850 dark:border-r-0 flex flex-col xl:fixed xl:sidenav-collapsed:w-20 overflow-x-clip transition-all ease-out duration-300',
          sharedSizeClasses,
          resizing && 'transition-none',
        )}
      >
        <div
          className={cn(
            'xl:px-6 px-3.5 py-4 xl:py-[1.125rem] overflow-y-auto overflow-x-clip flex-1 flex flex-col gap-8',
            sharedSizeClasses,
          )}
          ref={ref}
        >
          {children}
        </div>

        <div
          className={cn(
            'p-6 border-t border-transparent hidden xl:block xl:sidenav-collapsed:ml-1 transition-colors duration-300 ease-out',
            overflows && 'border-gray-300 dark:border-gray-850',
          )}
        >
          <NavSideBarCollapseToggle />
        </div>
      </div>
    </div>
  )
}
