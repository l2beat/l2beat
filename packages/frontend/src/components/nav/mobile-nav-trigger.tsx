'use client'

import { MenuCloseIcon } from '~/icons/menu-close'
import { MenuOpenIcon } from '~/icons/menu-open'
import { useSidebar } from '../core/sidebar'

/**
 * Opens the navigation menu on mobile.
 */
export function MobileNavTriggerOpen() {
  const { toggleSidebar } = useSidebar()
  return (
    <button onClick={toggleSidebar}>
      <MenuOpenIcon className="size-6" />
    </button>
  )
}

/**
 * Closes the navigation menu on mobile.
 */
export function MobileNavTriggerClose() {
  const { toggleSidebar } = useSidebar()
  return (
    <button onClick={toggleSidebar}>
      <MenuCloseIcon className="size-6" />
    </button>
  )
}
