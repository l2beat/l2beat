import { makeQuery } from './query'

const DEFAULT_SCROLL_OFFSET = 600

export function configureScrollToTopButton() {
  const { $ } = makeQuery()

  const scrollToTopButton = $.maybe('[data-role=scroll-to-top-button]')

  if (!scrollToTopButton) return

  const dataScrollOffset = scrollToTopButton.getAttribute('data-scroll-offset')

  const scrollOffset = dataScrollOffset
    ? Number(dataScrollOffset)
    : DEFAULT_SCROLL_OFFSET

  window.addEventListener('scroll', () => {
    const isVisible = window.scrollY > scrollOffset

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
