'use client'

import { MenuCloseIcon } from '~/icons/menu-close'
import { MenuOpenIcon } from '~/icons/menu-open'
import { useMobileNav } from './mobile-nav-context'

/**
 * Opens the navigation menu on mobile.
 */
export function MobileNavTriggerOpen() {
  const { setOpen } = useMobileNav()
  return (
    <button onClick={() => setOpen(true)}>
      <MenuOpenIcon className="size-6" />
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
      <MenuCloseIcon className="size-6" />
    </button>
  )
}
