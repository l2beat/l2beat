import { makeQuery } from './query'

export function configureFloatingBanner() {
  const { $$ } = makeQuery(document.body)

  const hasClosedBanner =
    localStorage.getItem('floatingBannerClosed') === 'true'

  if (!document.querySelector('.FloatingBanner')) {
    return
  }

  const [floatingBanner] = $$('.FloatingBanner') // only one regarding announcement

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
