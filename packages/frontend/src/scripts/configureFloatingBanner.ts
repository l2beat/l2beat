import { LocalStorage } from './local-storage/LocalStorage'

export function configureFloatingBanner() {
  const hasClosedBanner = LocalStorage.getItem(
    'l2-warsaw-floating-banner-closed',
  )

  const banner = document.querySelector('.FloatingBanner')
  if (!banner) {
    return
  }

  if (hasClosedBanner) {
    banner.classList.add('hidden')
    return
  }

  const cross = banner.querySelector('.FloatingBanner-Close')
  if (cross) {
    cross.addEventListener('click', () => {
      banner.classList.add('hidden')
      LocalStorage.setItem('l2-warsaw-floating-banner-closed', true)
    })
  }
}
