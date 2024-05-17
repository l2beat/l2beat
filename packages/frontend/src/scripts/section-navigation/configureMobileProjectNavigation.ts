import debounce from 'lodash/debounce'

import { highlightCurrentSection } from '../utils/highlightCurrentSection'
import { scrollHorizontallyToItem } from '../utils/scrollToItem'
import { getMobileElements } from './getElements'

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
    scrollHorizontallyToItem({
      item,
      overflowingContainer: content,
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
    topItem: summaryItem,
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
      topItem: summaryItem,
      onHighlight: (item) => {
        scrollToItem(item)
      },
    })
  })
}
