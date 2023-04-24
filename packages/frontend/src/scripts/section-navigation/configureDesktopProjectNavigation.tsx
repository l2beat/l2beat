import { highlightCurrentSection } from './highlightCurrentSection'

export function configureDesktopProjectNavigation() {
  const projectNavigation = document.querySelector(
    '#desktop-section-navigation',
  )
  const projectNavigationList = projectNavigation?.querySelector(
    '#desktop-section-navigation-list',
  )
  const projectNavigationHeader = projectNavigation?.querySelector(
    '#desktop-section-navigation-header',
  )
  const projectNavigationSummary =
    projectNavigation?.querySelector<HTMLAnchorElement>(
      'a#desktop-section-navigation-summary',
    )
  const sections = document.querySelectorAll('section')

  if (
    !projectNavigation ||
    !projectNavigationList ||
    !projectNavigationHeader ||
    !projectNavigationSummary
  )
    return

  let previouslyHighlightedItem: Element | undefined

  const highlightItem = (item: Element) => {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  highlightCurrentSection({
    navigationList: projectNavigationList,
    summary: projectNavigationSummary,
    sections,
    onHighlight: highlightItem,
  })

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = projectNavigation.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      projectNavigationHeader.classList.toggle('hidden', false)
    } else {
      projectNavigationHeader.classList.toggle('hidden', true)
    }
  }

  window.addEventListener('scroll', () => {
    handleShowingProjectTitle()
    highlightCurrentSection({
      navigationList: projectNavigationList,
      summary: projectNavigationSummary,
      sections,
      onHighlight: highlightItem,
    })
  })
}
