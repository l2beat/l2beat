'use client'

import { useRef, useState } from 'react'
import { useEventCallback } from '~/hooks/use-event-callback'
import { useEventListener } from '~/hooks/use-event-listener'
import { cn } from '~/utils/cn'
import { useMobileNav } from './mobile-nav-context'
import { NavSideBarCollapseToggle } from './nav-sidebar-collapse-toggle'

export const NavSideBarWrapper = ({
  children,
  legacyNav,
}: { children: React.ReactNode; legacyNav?: boolean }) => {
  const { open } = useMobileNav()
  const ref = useRef<HTMLDivElement>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const [resizing, setResizing] = useState(false)
  const [overflows, setOverflows] = useState(false)

  const sharedSizeClasses = cn(
    'h-screen w-full xl:w-[240px] 2xl:w-[280px] [@supports(height:100dvh)]:h-dvh',
    legacyNav && 'xl:hidden xl:sidenav-collapsed:hidden',
  )

  const onResize = useEventCallback(() => {
    clearTimeout(timeout.current)
    setResizing(true)
    setOverflows(
      (ref.current?.scrollHeight ?? 0) > (ref.current?.clientHeight ?? 0),
    )
    timeout.current = setTimeout(() => setResizing(false), 300)
  })

  useEventListener('resize', onResize)

  return (
    <div
      className={cn(
        'absolute z-999 flex flex-shrink-0 translate-x-full flex-col items-stretch transition-all duration-300 ease-out xl:static xl:transform-none xl:sidenav-collapsed:w-20',
        sharedSizeClasses,
        open && 'translate-x-0',
        resizing && 'transition-none',
      )}
    >
      <div
        className={cn(
          'custom-scrollbar flex flex-col overflow-x-clip bg-[#E6E7EC] transition-all duration-300 ease-out dark:border-r-0 dark:border-gray-850 dark:bg-[#1E1C21] xl:fixed xl:sidenav-collapsed:w-20 xl:dark:border-r',
          sharedSizeClasses,
          resizing && 'transition-none',
        )}
      >
        <div
          className={cn(
            'flex flex-1 flex-col gap-8 overflow-y-auto overflow-x-clip px-3.5 py-4 xl:px-6 xl:py-[1.125rem]',
            sharedSizeClasses,
          )}
          ref={ref}
        >
          {children}
        </div>

        <div
          className={cn(
            'hidden border-t border-transparent p-6 transition-colors duration-300 ease-out xl:block xl:sidenav-collapsed:ml-1',
            overflows && 'border-gray-300 dark:border-gray-850',
          )}
        >
          <NavSideBarCollapseToggle />
        </div>
      </div>
    </div>
  )
}
