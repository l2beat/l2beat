import { MenuCloseIcon } from '~/icons/MenuClose'
import { MenuOpenIcon } from '~/icons/MenuOpen'
import { useSidebar } from '../../core/Sidebar'

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
