import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

const localStorageKey = 'sidenav-collapsed'

const { $, $$ } = makeQuery()

function setNavState(state: boolean) {
  if (!state) {
    document.documentElement.classList.remove(localStorageKey)
    LocalStorage.setItem(localStorageKey, false)
    return
  }
  document.documentElement.classList.add(localStorageKey)
  LocalStorage.setItem(localStorageKey, true)
}

export function configureNavWrapper() {
  const sidenav = $('[data-role=sidenav]')
  const sidenavToggle = $('[data-role=sidenav-collapse-toggle]')
  const sidenavCollapseContent = $('[data-role=sidenav-collapse-content]')
  const sidenavToggleContainer = $(
    '[data-role=sidenav-collapse-toggle-container]',
  )
  const sidenavMobileToggles = $$('[data-role=sidenav-mobile-toggle]')

  if (
    !sidenav ||
    !sidenavToggle ||
    !sidenavCollapseContent ||
    !sidenavToggleContainer ||
    !sidenavMobileToggles
  ) {
    console.error('Missing sidenav elements')
    return
  }

  const onResize = () => {
    const elementHeight = sidenavCollapseContent.clientHeight
    const scrollHeight = sidenavCollapseContent.scrollHeight

    if (elementHeight >= scrollHeight) {
      sidenavToggleContainer.style.borderTop = 'none'
    } else {
      sidenavToggleContainer.style.borderTop = ''
    }
  }

  // Configure sidenav collapse toggle

  sidenavToggle.addEventListener('click', () => {
    setNavState(!document.documentElement.classList.contains(localStorageKey))
    onResize()
  })

  // Configure sidenav collapse content container

  window.addEventListener('resize', onResize)

  onResize()

  // Configure mobile navbar

  for (const toggle of sidenavMobileToggles) {
    toggle.addEventListener('click', () => {
      sidenav.dataset.open = sidenav.dataset.open === 'true' ? 'false' : 'true'
      document.body.style.overflow =
        sidenav.dataset.open === 'true' ? 'hidden' : ''
    })
  }
}
