import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

const localStorageKey = 'sidenav-collapsed'

export function configureNavWrapper() {
  const sidenavCollapsed = LocalStorage.getItem(localStorageKey)
  const { $ } = makeQuery()

  const setState = (state: boolean) => {
    if (!state) {
      document.documentElement.classList.remove(localStorageKey)
      LocalStorage.setItem(localStorageKey, false)
      return
    }
    document.documentElement.classList.add(localStorageKey)
    LocalStorage.setItem(localStorageKey, true)
  }

  setState(sidenavCollapsed ?? false)

  const sidenavToggle = $('[data-role=sidenav-collapse-toggle]')

  if (!sidenavToggle) {
    return
  }

  sidenavToggle.addEventListener('click', () => {
    if (document.documentElement.classList.contains(localStorageKey)) {
      setState(false)
    } else {
      setState(true)
    }
  })
}
