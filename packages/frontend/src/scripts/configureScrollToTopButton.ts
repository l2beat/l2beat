import { makeQuery } from './query'
import { isMobile } from './utils/isMobile'

const DEFAULT_SCROLL_OFFSET = 600

export function configureScrollToTopButton() {
  const { $ } = makeQuery()

  const scrollToTopButton = $.maybe('[data-role=scroll-to-top-button]')

  if (!scrollToTopButton) return

  window.addEventListener('scroll', () => {
    const scrollThreshold = getScrollThreshold(scrollToTopButton)
    const isVisible = window.scrollY > scrollThreshold

    if (isVisible) {
      scrollToTopButton.setAttribute('data-visible', 'true')
      return
    }

    scrollToTopButton.removeAttribute('data-visible')
  })

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function getScrollThreshold(button: HTMLElement) {
  const dataDesktopThreshold = button.getAttribute('data-desktop-threshold')
  const dataMobileThreshold = button.getAttribute('data-mobile-threshold')

  if (isMobile()) {
    return dataMobileThreshold
      ? Number(dataMobileThreshold)
      : DEFAULT_SCROLL_OFFSET
  }

  return dataDesktopThreshold
    ? Number(dataDesktopThreshold)
    : DEFAULT_SCROLL_OFFSET
}
