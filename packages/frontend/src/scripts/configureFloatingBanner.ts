import { makeQuery } from './query'

export function configureFloatingBanner() {
  const { $$ } = makeQuery(document.body)

  if (!document.querySelector('.FloatingBanner')) {
    return
  }

  const floatingBanners = $$('.FloatingBanner')

  for (const banner of floatingBanners) {
    const cross = banner.querySelector('.FloatingBanner-Cross')
    if (!cross) continue

    cross.addEventListener('click', () => {
      banner.classList.toggle('hidden')
    })
  }
}
