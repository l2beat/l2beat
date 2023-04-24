import { highlightCurrentSection } from './highlightCurrentSection'

export function configureMobileSectionNavigation() {
  const sectionNavigation = document.querySelector('#mobile-section-navigation')
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#mobile-section-navigation-list',
  )
  const sectionNavigationSummary =
    sectionNavigation?.querySelector<HTMLAnchorElement>(
      'a#mobile-section-navigation-summary',
    )

  const sections = document.querySelectorAll('section')

  if (
    !sectionNavigation ||
    !sectionNavigationList ||
    !sectionNavigationSummary
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
        scrollToItem(item as HTMLAnchorElement)
      },
    })
  })

  const scrollToItem = (item: HTMLAnchorElement) => {
    if (destinationItem && destinationItem !== item) {
      return
    }
    const scrollPosition =
      item.offsetLeft -
      sectionNavigation.getBoundingClientRect().width / 2 +
      item.offsetWidth / 2
    sectionNavigation.scrollTo({
      left: scrollPosition,
    })
    destinationItem = null
  }

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
}
