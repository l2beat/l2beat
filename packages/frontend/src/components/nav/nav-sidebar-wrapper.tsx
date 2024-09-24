'use client'

import { useRef, useState } from 'react'
import { useEventCallback } from '~/hooks/use-event-callback'
import { useEventListener } from '~/hooks/use-event-listener'
import { cn } from '~/utils/cn'
import { useMobileNav } from './mobile-nav-context'

export const NavSideBarWrapper = ({
  children,
  legacyNav,
}: { children: React.ReactNode; legacyNav?: boolean }) => {
  const { open } = useMobileNav()
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const [resizing, setResizing] = useState(false)

  const sharedSizeClasses = cn(
    'h-screen w-full xl:w-[240px] 2xl:w-[280px] [@supports(height:100dvh)]:h-dvh',
    legacyNav && 'xl:hidden',
  )

  const onResize = useEventCallback(() => {
    clearTimeout(timeout.current)
    setResizing(true)
    timeout.current = setTimeout(() => setResizing(false), 300)
  })

  useEventListener('resize', onResize)

  return (
    <div
      className={cn(
        'custom-scrollbar absolute z-999 flex shrink-0 translate-x-full flex-col items-stretch transition-all duration-300 ease-out xl:static xl:transform-none',
        sharedSizeClasses,
        open && 'translate-x-0',
        resizing && 'transition-none',
      )}
    >
      <div
        className={cn(
          'scrollbar-gutter-stable flex flex-col gap-8 overflow-y-auto overflow-x-clip bg-[#E6E7EC] px-3.5 py-4 transition-all duration-300 ease-out dark:border-r-0 dark:border-gray-850 dark:bg-[#1E1C21] xl:fixed xl:px-6 xl:py-[1.125rem] xl:dark:border-r',
          sharedSizeClasses,
          resizing && 'transition-none',
        )}
      >
        {children}
      </div>
    </div>
  )
}
