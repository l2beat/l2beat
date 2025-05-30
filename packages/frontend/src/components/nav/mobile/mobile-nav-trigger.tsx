import { MenuCloseIcon } from '~/icons/menu-close'
import { MenuOpenIcon } from '~/icons/menu-open'
import { useSidebar } from '../../core/sidebar'

/**
 * Opens the navigation menu on mobile.
 */
export function MobileNavTriggerOpen() {
  const { setOpenMobile } = useSidebar()
  return (
    <button onClick={() => setOpenMobile(true)}>
      <MenuOpenIcon className="size-6" />
    </button>
  )
}

/**
 * Closes the navigation menu on mobile.
 */
export function MobileNavTriggerClose() {
  const { setOpenMobile } = useSidebar()
  return (
    <button onClick={() => setOpenMobile(false)}>
      <MenuCloseIcon className="size-6" />
    </button>
  )
}
