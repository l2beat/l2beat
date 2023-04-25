import { DESKTOP_PROJECT_NAVIGATION_IDS } from '../../components/project/navigation'
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
      'text-white',
    )
    previouslyHighlighted?.index?.classList.add(
      'bg-gray-100',
      'dark:bg-neutral-700',
    )

    item.classList.remove('opacity-60')
    index?.classList.remove('bg-gray-100', 'dark:bg-neutral-700')
    index?.classList.add(
      'bg-gradient-to-r',
      'from-purple-100',
      'to-pink-100',
      'text-white',
    )
    previouslyHighlighted = { item, index }
  }

  const handleShowingProjectTitle = () => {
    const navigationTopOffset = 32
    const navigationOffset = container.getBoundingClientRect().top

    if (navigationOffset === navigationTopOffset) {
      listHeader.classList.toggle('hidden', false)
    } else {
      listHeader.classList.toggle('hidden', true)
    }
  }

  highlightCurrentSection({
    navigationList: list,
    summary: summaryItem,
    sections,
    onHighlight: highlightItem,
  })

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
