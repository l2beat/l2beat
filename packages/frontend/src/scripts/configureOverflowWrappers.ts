import { makeQuery } from './query'

const ARROWS_THRESHOLD = 8

export function configureOverflowWrappers() {
  const { $$ } = makeQuery(document.body)
  const overflowWrappers = $$('[data-role=overflow-wrapper]')
  overflowWrappers.forEach((wrapper) => configureOverflowWrapper(wrapper))
}

function configureOverflowWrapper(wrapper: HTMLElement) {
  const { $ } = makeQuery(wrapper)

  const arrowLeft = $('[data-role=overflow-wrapper-arrow-left]')
  const arrowRight = $('[data-role=overflow-wrapper-arrow-right]')
  const content = $('[data-role=overflow-wrapper-content]')

  const showArrows = () => {
    const isScrolledToStart = content.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      content.scrollLeft >
      content.scrollWidth - content.clientWidth - ARROWS_THRESHOLD

    wrapper.setAttribute(
      'data-arrow-left-visible',
      isScrolledToStart ? 'false' : 'true',
    )
    wrapper.setAttribute(
      'data-arrow-right-visible',
      isScrolledToEnd ? 'false' : 'true',
    )
  }

  const onArrowClick = (dir: 'left' | 'right') => {
    const scrollPosition = content.getBoundingClientRect().width
    content.scrollBy({
      left: dir === 'left' ? -scrollPosition : scrollPosition,
      behavior: 'smooth',
    })
  }

  showArrows()
  content.addEventListener('scroll', showArrows)
  window.addEventListener('resize', showArrows)

  arrowLeft.addEventListener('click', () => onArrowClick('left'))
  arrowRight.addEventListener('click', () => onArrowClick('right'))
}
