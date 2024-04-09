import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

export function configureFloatingBanner() {
  const { $ } = makeQuery()
  const hasClosedBanner = LocalStorage.getItem('gg-19-floating-banner-closed')

  const banner = $.maybe('[data-role=floating-banner]')
  if (!banner) {
    return
  }

  const setState = (state: 'visible' | null) => {
    if (!state) {
      delete banner.dataset.state
      return
    }
    banner.dataset.state = state
  }

  if (hasClosedBanner) {
    return
  }

  setState('visible')
  const closeButton = $('[data-role=floating-banner-close]')
  closeButton.addEventListener('click', () => {
    setState(null)
    LocalStorage.setItem('gg-19-floating-banner-closed', true)
  })
}
