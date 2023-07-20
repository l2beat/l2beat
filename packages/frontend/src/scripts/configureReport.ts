export function configureReport() {
  const CLOSED_KEY = 'reportFloatingBannerClosed'

  const hasClosedBanner = localStorage.getItem(CLOSED_KEY) === 'true'

  const banner = document.querySelector('.ReportFloatingBanner')
  if (!banner) {
    return
  }

  if (hasClosedBanner) {
    banner.classList.add('hidden')
    return
  }

  const cross = banner.querySelector('.ReportFloatingBanner-Close')
  if (cross) {
    cross.addEventListener('click', () => {
      banner.classList.add('hidden')
      localStorage.setItem(CLOSED_KEY, 'true')
    })
  }
}
