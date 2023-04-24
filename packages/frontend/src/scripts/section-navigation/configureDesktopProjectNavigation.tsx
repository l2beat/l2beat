import { DESKTOP_PROJECT_NAVIGATION_IDS } from '../../components/project/navigation/DesktopProjectNavigation'
import { highlightCurrentSection } from './highlightCurrentSection'

export function configureDesktopProjectNavigation() {
  const container = document.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.container}`,
  )
  const list = container?.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.list}`,
  )
  const listHeader = container?.querySelector(
    `#${DESKTOP_PROJECT_NAVIGATION_IDS.listHeader}`,
  )
  const summary = container?.querySelector<HTMLAnchorElement>(
    `a#${DESKTOP_PROJECT_NAVIGATION_IDS.summaryItem}`,
  )
  const sections = document.querySelectorAll('section')

  if (!container || !list || !listHeader || !summary) return

  let previouslyHighlightedItem: Element | undefined

  const highlightItem = (item: Element) => {
    previouslyHighlightedItem?.classList.toggle('opacity-60', true)
    item.classList.toggle('opacity-60', false)
    previouslyHighlightedItem = item
  }

  highlightCurrentSection({
    navigationList: list,
    summary: summary,
    sections,
    onHighlight: highlightItem,
  })

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = container.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      listHeader.classList.toggle('hidden', false)
    } else {
      listHeader.classList.toggle('hidden', true)
    }
  }

  window.addEventListener('scroll', () => {
    handleShowingProjectTitle()
    highlightCurrentSection({
      navigationList: list,
      summary: summary,
      sections,
      onHighlight: highlightItem,
    })
  })
}
