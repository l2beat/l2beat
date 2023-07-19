import { makeQuery } from './query'

export function configureFloatingBanner() {
  const { $$ } = makeQuery(document.body)

  const hasClosedBanner =
    localStorage.getItem('floatingBannerClosed') === 'true'

  if (!document.querySelector('.FloatingBanner')) {
    return
  }

  const floatingBanners = $$('.FloatingBanner')

  if (hasClosedBanner) {
    floatingBanners.forEach((banner) => {
      banner.classList.add('hidden')
    })

    return
  }

  for (const banner of floatingBanners) {
    const cross = banner.querySelector('.FloatingBanner-Cross')
    if (!cross) continue

    cross.addEventListener('click', () => {
      banner.classList.toggle('hidden')
    })
  }

  localStorage.setItem('floatingBannerClosed', 'true')
}
