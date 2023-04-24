import { debounce } from 'lodash'

import { highlightCurrentSection } from './highlightCurrentSection'

const ARROWS_THRESHOLD = 8

export function configureMobileSectionNavigation() {
  const sectionNavigation = document.querySelector('#mobile-section-navigation')
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#mobile-section-navigation-list',
  )
  const sectionNavigationSummary =
    sectionNavigation?.querySelector<HTMLAnchorElement>(
      'a#mobile-section-navigation-summary',
    )
  const arrowLeft = sectionNavigation?.querySelector(
    '#mobile-section-navigation-arrow-left',
  )
  const arrowRight = sectionNavigation?.querySelector(
    '#mobile-section-navigation-arrow-right',
  )

  const sections = document.querySelectorAll('section')

  if (
    !sectionNavigation ||
    !sectionNavigationList ||
    !sectionNavigationSummary ||
    !arrowLeft ||
    !arrowRight
  ) {
    return
  }
  let previouslyHighlightedItem: Element | undefined
  let destinationItem: HTMLAnchorElement | null = null

  highlightCurrentSection({
    navigationList: sectionNavigationList,
    sections,
    summary: sectionNavigationSummary,
    onHighlight: highlightItem,
  })

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: sectionNavigationList,
      sections,
      summary: sectionNavigationSummary,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item )
      },
    })
  })

  const showArrows = () => {
    const isScrolledToStart =
      sectionNavigationList.scrollLeft < ARROWS_THRESHOLD
    const isScrolledToEnd =
      sectionNavigationList.scrollLeft >
      sectionNavigationList.scrollWidth -
        sectionNavigationList.clientWidth -
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
      sectionNavigationList.getBoundingClientRect().width / 2 +
      item.offsetWidth / 2
    sectionNavigationList.scrollTo({
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

  const sectionNavigationItems = sectionNavigationList.querySelectorAll('a')
  sectionNavigationItems.forEach((item) => {
    item.addEventListener('click', () => {
      destinationItem = item
    })
  })
  sectionNavigationList.addEventListener('scroll', showArrows)
}
