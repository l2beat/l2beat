import { highlightCurrentSection } from './highlightCurrentSection'

export function configureDesktopSectionNavigation() {
  const sectionNavigation = document.querySelector(
    '#desktop-section-navigation',
  )
  const sectionNavigationList = sectionNavigation?.querySelector(
    '#desktop-section-navigation-list',
  )
  const sectionNavigationHeader = sectionNavigation?.querySelector(
    '#desktop-section-navigation-header',
  )
  const sectionNavigationSummary =
    sectionNavigation?.querySelector<HTMLAnchorElement>(
      'a#desktop-section-navigation-summary',
    )
  const sections = document.querySelectorAll('section')

  if (
    !sectionNavigation ||
    !sectionNavigationList ||
    !sectionNavigationHeader ||
    !sectionNavigationSummary
  )
    return

  let previouslyHighlightedItem: Element | undefined

  const highlightItem = (item: Element) => {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  highlightCurrentSection({
    navigationList: sectionNavigationList,
    summary: sectionNavigationSummary,
    sections,
    onHighlight: highlightItem,
  })

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = sectionNavigation.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      sectionNavigationHeader?.classList.toggle('hidden', false)
    } else {
      sectionNavigationHeader?.classList.toggle('hidden', true)
    }
  }

  window.addEventListener('scroll', () => {
    handleShowingProjectTitle()
    highlightCurrentSection({
      navigationList: sectionNavigationList,
      summary: sectionNavigationSummary,
      sections,
      onHighlight: highlightItem,
    })
  })
}
