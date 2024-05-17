import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

export function configureNavWrapper() {
  const sidenavCollapsed = LocalStorage.getItem('sidenav-collapsed')
  const { $ } = makeQuery()
  const sidenav = $('[data-role=sidenav]')
  const sidenavToggle = $('[data-role=sidenav-collapse-toggle]')

  if (!sidenav || !sidenavToggle) {
    return
  }

  const setState = (state: 'collapsed' | 'expanded' | null) => {
    if (!state) {
      delete sidenav.dataset.state
      return
    }
    sidenav.dataset.state = state
  }

  if (sidenavCollapsed) {
    setState('collapsed')
  }

  sidenavToggle.addEventListener('click', () => {
    if (sidenav.dataset.state === 'collapsed') {
      setState('expanded')
      LocalStorage.setItem('sidenav-collapsed', false)
    } else {
      setState('collapsed')
      LocalStorage.setItem('sidenav-collapsed', true)
    }
  })
}
