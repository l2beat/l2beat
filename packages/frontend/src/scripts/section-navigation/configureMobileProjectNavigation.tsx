import { debounce } from 'lodash'

import { MOBILE_PROJECT_NAVIGATION_IDS } from '../../components/project/navigation/MobileProjectNavigation'
import { highlightCurrentSection } from './highlightCurrentSection'

const ARROWS_THRESHOLD = 8

export function configureMobileProjectNavigation() {
  const projectNavigation = document.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.container}`,
  )
  const projectNavigationList = projectNavigation?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
  )
  const summaryItem = projectNavigation?.querySelector<HTMLAnchorElement>(
    `a#${MOBILE_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const arrowLeft = projectNavigation?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowLeft}`,
  )
  const arrowRight = projectNavigation?.querySelector(
    `#${MOBILE_PROJECT_NAVIGATION_IDS.arrowRight}`,
  )

  const sections = document.querySelectorAll('section')

  if (
    !projectNavigation ||
    !projectNavigationList ||
    !summaryItem ||
    !arrowLeft ||
    !arrowRight
  ) {
    return
  }
  let previouslyHighlightedItem: Element | undefined
  let destinationItem: HTMLAnchorElement | null = null

  highlightCurrentSection({
    navigationList: projectNavigationList,
    sections,
    summary: summaryItem,
    onHighlight: highlightItem,
  })

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: projectNavigationList,
      sections,
      summary: summaryItem,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
    })
  })

  const showArrows = () => {
    const isScrolledToStart =
      projectNavigationList.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      projectNavigationList.scrollLeft >
      projectNavigationList.scrollWidth -
        projectNavigationList.clientWidth -
        ARROWS_THRESHOLD

    if (isScrolledToStart) {
      arrowLeft.classList.add('opacity-0')
    } else {
      arrowLeft.classList.remove('opacity-0')
    }

    if (isScrolledToEnd) {
      arrowRight.classList.add('opacity-0')
    } else {
      arrowRight.classList.remove('opacity-0')
    }
  }
  showArrows()

  const scrollToItem = debounce((item: HTMLAnchorElement) => {
    if (destinationItem && destinationItem !== item) {
      return
    }
    const scrollPosition =
      item.offsetLeft -
      projectNavigationList.getBoundingClientRect().width / 2 +
      item.offsetWidth / 2
    projectNavigationList.scrollTo({
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

  const projectNavigationItems = projectNavigationList.querySelectorAll('a')
  projectNavigationItems.forEach((item) => {
    item.addEventListener('click', () => {
      destinationItem = item
    })
  })
  projectNavigationList.addEventListener('scroll', showArrows)
}
