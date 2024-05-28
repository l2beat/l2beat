'use client'

import MenuOpenIcon from '~/icons/menu-open.svg'
import MenuCloseIcon from '~/icons/menu-close.svg'
import { useMobileNav } from './MobileNavContext'

/**
 * Opens the navigation menu on mobile.
 */
export function MobileNavTriggerOpen() {
  const { setOpen } = useMobileNav()
  return (
    <button onClick={() => setOpen(true)}>
      <MenuOpenIcon className="h-6 w-6" />
    </button>
  )
}

/**
 * Closes the navigation menu on mobile.
 */
export function MobileNavTriggerClose() {
  const { setOpen } = useMobileNav()
  return (
    <button onClick={() => setOpen(false)}>
      <MenuCloseIcon className="h-6 w-6" />
    </button>
  )
}
