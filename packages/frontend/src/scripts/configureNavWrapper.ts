import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

const localStorageKey = 'sidenav-collapsed'

const { $ } = makeQuery()

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
  const sidenavToggle = $('[data-role=sidenav-collapse-toggle]')
  const sidenavCollapseContent = $('[data-role=sidenav-collapse-content]')
  const sidenavToggleContainer = $(
    '[data-role=sidenav-collapse-toggle-container]',
  )

  if (!sidenavToggle) {
    console.error('No sidenav toggle found')
    return
  }

  if (!sidenavCollapseContent || !sidenavToggleContainer) {
    console.error('No sidenav collapse content or toggle container found')
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
}
