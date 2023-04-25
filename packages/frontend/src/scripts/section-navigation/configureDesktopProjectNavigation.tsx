import { DESKTOP_PROJECT_NAVIGATION_IDS } from '../../components/project/navigation/DesktopProjectNavigation'
import { getDesktopElements } from './getElements'
import { highlightCurrentSection } from './highlightCurrentSection'

interface PreviouslyHighlighted {
  item: Element
  index: Element | null
}

export function configureDesktopProjectNavigation() {
  const { container, list, listHeader, summaryItem, sections } =
    getDesktopElements()

  let previouslyHighlighted: PreviouslyHighlighted | null = null

  const highlightItem = (item: Element) => {
    const index = item.querySelector(`#${DESKTOP_PROJECT_NAVIGATION_IDS.index}`)

    previouslyHighlighted?.item.classList.add('opacity-60')
    previouslyHighlighted?.index?.classList.remove(
      'bg-gradient-to-r',
      'from-purple-100',
      'to-pink-100',
    )
    previouslyHighlighted?.index?.classList.add('bg-neutral-700')

    item.classList.remove('opacity-60')
    index?.classList.remove('bg-neutral-700')
    index?.classList.add('bg-gradient-to-r', 'from-purple-100', 'to-pink-100')
    previouslyHighlighted = { item, index }
  }

  highlightCurrentSection({
    navigationList: list,
    summary: summaryItem,
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
      summary: summaryItem,
      sections,
      onHighlight: highlightItem,
    })
  })
}
