'use client'

import { useEffect, useRef, useState } from 'react'
import { useEventCallback } from '~/hooks/use-event-callback'
import { useEventListener } from '~/hooks/use-event-listener'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { cn } from '~/utils/cn'
import { useMobileNav } from './mobile-nav-context'

export const NavSideBarWrapper = ({
  children,
  topNavbar,
}: { children: React.ReactNode; topNavbar?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { open, setOpen } = useMobileNav()
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [resizing, setResizing] = useState(false)

  const sharedSizeClasses = cn(
    'h-screen w-full lg:w-60 [@supports(height:100dvh)]:h-dvh',
    topNavbar && 'lg:hidden',
  )

  const onResize = useEventCallback(() => {
    clearTimeout(timeout.current)
    setResizing(true)
    timeout.current = setTimeout(() => setResizing(false), 300)
  })

  useEffect(() => {
    if (open) {
      document.body.classList.add('max-lg:overflow-hidden')
    } else {
      document.body.classList.remove('max-lg:overflow-hidden')
    }
  }, [open])

  useEventListener('resize', onResize)
  useOnClickOutside(ref, () => setOpen(false))

  return (
    <>
      {open && (
        <div className="fixed left-0 top-0 z-999 size-full bg-overlay max-sm:hidden lg:hidden" />
      )}
      <div
        ref={ref}
        className={cn(
          'custom-scrollbar absolute flex shrink-0 translate-x-full flex-col items-stretch transition-all duration-300 ease-out max-lg:z-999 lg:static lg:mr-3 lg:transform-none',
          sharedSizeClasses,
          open && 'translate-x-0 sm:translate-x-[calc(100%-300px)]',
          resizing && 'transition-none',
        )}
      >
        <div
          className={cn(
            'flex flex-col gap-6 overflow-y-auto overflow-x-clip px-3.5 pt-4 transition-all duration-300 ease-out max-lg:bg-surface-primary sm:w-[300px] lg:fixed lg:px-5 lg:pt-[1.125rem]',
            sharedSizeClasses,
            resizing && 'transition-none',
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}
