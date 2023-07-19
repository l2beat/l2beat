export function configureFloatingBanner() {
  const hasClosedBanner =
    localStorage.getItem('floatingBannerClosed') === 'true'

  if (!document.querySelector('.FloatingBanner')) {
    return
  }

  const floatingBanner = document.querySelector('.FloatingBanner') // only one regarding announcement

  if (!floatingBanner) {
    return
  }

  if (hasClosedBanner) {
    floatingBanner.classList.add('hidden')

    return
  }

  const cross = floatingBanner.querySelector('.FloatingBanner-Cross')

  if (cross) {
    cross.addEventListener('click', () => {
      floatingBanner.classList.add('hidden')
      localStorage.setItem('floatingBannerClosed', 'true')
    })
  }
}
