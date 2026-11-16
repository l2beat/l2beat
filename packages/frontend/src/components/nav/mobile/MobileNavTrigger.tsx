import { MenuCloseIcon } from '~/icons/MenuClose'
import { MenuOpenIcon } from '~/icons/MenuOpen'
import { MOBILE_SIDEBAR_ID, useSidebar } from '../../core/Sidebar'

/**
 * Opens the navigation menu on mobile.
 */
export function MobileNavTriggerOpen() {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <button
      aria-label="Open menu"
      aria-expanded={openMobile}
      aria-controls={MOBILE_SIDEBAR_ID}
      onClick={() => setOpenMobile(true)}
    >
      <MenuOpenIcon className="size-6" />
    </button>
  )
}

/**
 * Closes the navigation menu on mobile.
 */
export function MobileNavTriggerClose() {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <button
      aria-label="Close menu"
      aria-expanded={openMobile}
      aria-controls={MOBILE_SIDEBAR_ID}
      onClick={() => setOpenMobile(false)}
    >
      <MenuCloseIcon className="size-6" />
    </button>
  )
}
