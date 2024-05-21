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
  const sidenavInner = $('[data-role=sidenav-inner]')
  const sidenavToggle = $('[data-role=sidenav-collapse-toggle]')
  const sidenavCollapseContent = $('[data-role=sidenav-collapse-content]')
  const sidenavToggleContainer = $(
    '[data-role=sidenav-collapse-toggle-container]',
  )
  const sidenavMobileToggles = $$('[data-role=sidenav-mobile-toggle]')
  const sidenavMobileTabsContainer = $('[data-role=sidenav-mobile-tabs]')

  if (
    !sidenav ||
    !sidenavInner ||
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

  // Fix navbar animations when resizing

  let resizeTimer: NodeJS.Timeout | null = null

  window.addEventListener('resize', () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    for (const elem of [sidenav, sidenavInner]) {
      elem.style.transition = 'none'
    }
    resizeTimer = setTimeout(() => {
      resizeTimer = null
      for (const elem of [sidenav, sidenavInner]) {
        elem.style.transition = ''
      }
    }, 100)
  })

  // Scroll sidenav

  const sidenavLinks = $$('[data-sidenav-mobile-tabs-active=true]')

  for (const link of sidenavLinks) {
    sidenavMobileTabsContainer.scrollLeft = link.offsetLeft - 16 /* px gap */
  }
}
