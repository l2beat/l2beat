import debounce from 'lodash/debounce'

import { getMobileElements } from './getElements'
import { highlightCurrentSection } from './highlightCurrentSection'

export function configureMobileProjectNavigation() {
  const elements = getMobileElements()

  if (!elements) return

  const { content, summaryItem, sections } = elements

  let previouslyHighlightedItem: Element | null = null
  let destinationItem: HTMLAnchorElement | null = null

  const scrollToItem = debounce((item: HTMLAnchorElement) => {
    if (destinationItem && destinationItem !== item) {
      return
    }
    const scrollPosition =
      item.offsetLeft -
      content.getBoundingClientRect().width / 2 +
      item.offsetWidth / 2
    content.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    })
    destinationItem = null
  }, 50)

  const highlightItem = (item: Element | HTMLAnchorElement) => {
    previouslyHighlightedItem?.removeAttribute('data-selected')
    item.setAttribute('data-selected', 'true')
    previouslyHighlightedItem = item
  }

  highlightCurrentSection({
    navigationList: content,
    sections,
    summary: summaryItem,
    onHighlight: highlightItem,
  })

  const projectNavigationItems = content.querySelectorAll('a')
  projectNavigationItems.forEach((item) => {
    item.addEventListener('click', () => {
      destinationItem = item
    })
  })

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: content,
      sections,
      summary: summaryItem,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
    })
  })
}
