import { debounce } from 'lodash'

import { MOBILE_PROJECT_NAVIGATION_IDS } from '../../components/project/navigation/MobileProjectNavigation'
import { highlightCurrentSection } from './highlightCurrentSection'

const ARROWS_THRESHOLD = 8

export function configureMobileProjectNavigation() {
  const container = document.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.container}`,
  )
  const list = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
  )
  const summaryItem = container?.querySelector<HTMLAnchorElement>(
    `a#${MOBILE_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const arrowLeft = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowLeft}`,
  )
  const arrowRight = container?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowRight}`,
  )

  const sections = document.querySelectorAll('section')

  if (!container || !list || !summaryItem || !arrowLeft || !arrowRight) {
    return
  }
  let previouslyHighlightedItem: Element | null = null
  let destinationItem: HTMLAnchorElement | null = null

  highlightCurrentSection({
    navigationList: list,
    sections,
    summary: summaryItem,
    onHighlight: highlightItem,
    previouslyHighlightedItem,
  })

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: list,
      sections,
      summary: summaryItem,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
      previouslyHighlightedItem,
    })
  })

  const showArrows = () => {
    const isScrolledToStart = list.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      list.scrollLeft > list.scrollWidth - list.clientWidth - ARROWS_THRESHOLD

    arrowLeft.classList.toggle('opacity-0', isScrolledToStart)

    arrowRight.classList.toggle('opacity-0', isScrolledToEnd)
  }
  showArrows()

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

  function highlightItem(item: Element | HTMLAnchorElement) {
    previouslyHighlightedItem?.classList.remove(
      'border-b-2',
      'text-pink-200',
      'border-b-pink-200',
    )
    item.classList.add('border-b-2', 'text-pink-200', 'border-b-pink-200')
    previouslyHighlightedItem = item
  }

  const projectNavigationItems = list.querySelectorAll('a')
  projectNavigationItems.forEach((item) => {
    item.addEventListener('click', () => {
      destinationItem = item
    })
  })
  list.addEventListener('scroll', showArrows)
}
