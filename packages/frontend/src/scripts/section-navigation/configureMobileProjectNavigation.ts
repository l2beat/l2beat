import { debounce } from 'lodash'

import { getMobileElements } from './getElements'
import { highlightCurrentSection } from './highlightCurrentSection'

const ARROWS_THRESHOLD = 8

export function configureMobileProjectNavigation() {
  const elements = getMobileElements()

  if (!elements) return

  const { list, summaryItem, arrowLeft, arrowRight, sections } = elements

  let previouslyHighlightedItem: Element | null = null
  let destinationItem: HTMLAnchorElement | null = null

  const showArrows = () => {
    const isScrolledToStart = list.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      list.scrollLeft > list.scrollWidth - list.clientWidth - ARROWS_THRESHOLD

    arrowLeft.classList.toggle('opacity-0', isScrolledToStart)

    arrowRight.classList.toggle('opacity-0', isScrolledToEnd)
  }

  const scrollToItem = debounce((item: HTMLAnchorElement) => {
    if (destinationItem && destinationItem !== item) {
      return
    }
    const scrollPosition =
      item.offsetLeft -
      list.getBoundingClientRect().width / 2 +
      item.offsetWidth / 2
    list.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    })
    destinationItem = null
  }, 50)

  const highlightItem = (item: Element | HTMLAnchorElement) => {
    previouslyHighlightedItem?.classList.remove(
      'border-b-2',
      'border-current',
      'text-pink-900',
      'dark:text-pink-200',
    )
    item.classList.add(
      'border-b-2',
      'border-current',
      'text-pink-900',
      'dark:text-pink-200',
    )
    previouslyHighlightedItem = item
  }

  const onArrowClick = (dir: 'left' | 'right') => {
    const scrollPosition = list.getBoundingClientRect().width
    list.scrollBy({
      left: dir === 'left' ? -scrollPosition : scrollPosition,
      behavior: 'smooth',
    })
  }

  showArrows()
  highlightCurrentSection({
    navigationList: list,
    sections,
    summary: summaryItem,
    onHighlight: highlightItem,
  })

  const projectNavigationItems = list.querySelectorAll('a')
  projectNavigationItems.forEach((item) => {
    item.addEventListener('click', () => {
      destinationItem = item
    })
  })

  list.addEventListener('scroll', showArrows)

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: list,
      sections,
      summary: summaryItem,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
    })
  })

  arrowLeft.addEventListener('click', () => onArrowClick('left'))

  arrowRight.addEventListener('click', () => onArrowClick('right'))
}
