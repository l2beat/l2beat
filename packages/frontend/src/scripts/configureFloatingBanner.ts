import { LocalStorage } from './local-storage/LocalStorage'
import { makeQuery } from './query'

export function configureFloatingBanner() {
  const { $ } = makeQuery(document.body)
  const hasClosedBanner = LocalStorage.getItem('l2-days-floating-banner-closed')

  const banner = $.maybe('.FloatingBanner')
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
  const closeButton = $('.FloatingBanner-Close')
  closeButton.addEventListener('click', () => {
    setState(null)
    LocalStorage.setItem('l2-days-floating-banner-closed', true)
  })
}
