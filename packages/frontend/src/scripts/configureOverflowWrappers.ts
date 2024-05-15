import clamp from 'lodash/clamp'

import { makeQuery } from './query'

const ARROWS_THRESHOLD = 4

export function configureOverflowWrappers() {
  const { $$ } = makeQuery()
  const overflowWrappers = $$('[data-role=overflow-wrapper]')
  overflowWrappers.forEach((wrapper) => configureOverflowWrapper(wrapper))
}

function configureOverflowWrapper(wrapper: HTMLElement) {
  const { $ } = makeQuery(wrapper)

  const arrowLeft = $('[data-role=overflow-wrapper-arrow-left]')
  const arrowRight = $('[data-role=overflow-wrapper-arrow-right]')
  const content = $('[data-role=overflow-wrapper-content]')
  const selectedItem = $.maybe('[data-selected=true]')

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
    const contentWidth = content.getBoundingClientRect().width
    let scrollBy
    if (dir === 'left') {
      scrollBy = -clamp(contentWidth, 0, content.scrollLeft)
    } else {
      scrollBy = clamp(
        contentWidth,
        0,
        content.scrollWidth - contentWidth - content.scrollLeft,
      )
    }

    content.scrollBy({
      left: scrollBy,
      behavior: 'smooth',
    })
  }

  if (wrapper.dataset.scrollOnLoad) {
    selectedItem?.scrollIntoView({
      inline: 'center',
    })
  }
  showArrows()
  content.addEventListener('scroll', showArrows)
  window.addEventListener('resize', showArrows)
  arrowLeft.addEventListener('click', () => onArrowClick('left'))
  arrowRight.addEventListener('click', () => onArrowClick('right'))
}
