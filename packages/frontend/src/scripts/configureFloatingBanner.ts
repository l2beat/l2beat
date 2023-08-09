export function configureFloatingBanner() {
  const CLOSED_KEY = 'L2WarsawFloatingBannerClosed'

  const hasClosedBanner = localStorage.getItem(CLOSED_KEY) === 'true'

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
      localStorage.setItem(CLOSED_KEY, 'true')
    })
  }
}
