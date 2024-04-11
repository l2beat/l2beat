import debounce from 'lodash/debounce'

import { startsWithNumber } from '../utils/startsWithLetterOrNumber'
import { makeQuery } from './query'
import { highlightCurrentSection } from './utils/highlightCurrentSection'
import { scrollHorizontallyToItem } from './utils/scrollToItem'

export function configureAlphabetSelectors() {
  const { $ } = makeQuery()

  const alphabetSelector = $.maybe('[data-role=alphabet-selector]')
  if (!alphabetSelector) return

  configureAlphabetSelector(alphabetSelector)
}

function configureAlphabetSelector(alphabetSelector: HTMLElement) {
  const { $$: document$$ } = makeQuery()
  const { $, $$ } = makeQuery(alphabetSelector)
  const alphabetSelectorItems = $$<HTMLAnchorElement>(
    '[data-role=alphabet-selector-item]',
  )
  const sections = document$$('section')
  const hash = window.location.hash

  let destinationItem: HTMLAnchorElement | null = null
  let selectedAlphabetSelectorItem = alphabetSelectorItems.find(
    (item) =>
      isItemCharEqualToHash(item, hash) &&
      !(item.getAttribute('aria-disabled') === 'true'),
  )
  const overflowingList = $('[data-role=overflow-wrapper-content]')

  function highlightItem(item: HTMLAnchorElement) {
    selectedAlphabetSelectorItem?.removeAttribute('data-selected')
    item.setAttribute('data-selected', 'true')
    selectedAlphabetSelectorItem = item
  }

  const scrollToItem = debounce(
    (item: HTMLAnchorElement) =>
      scrollHorizontallyToItem({
        item,
        destinationItem,
        overflowingContainer: overflowingList,
      }),
    50,
  )

  if (selectedAlphabetSelectorItem) {
    highlightItem(selectedAlphabetSelectorItem)
    scrollToItem(selectedAlphabetSelectorItem)
  }

  alphabetSelectorItems.forEach((item) =>
    item.addEventListener('click', () => (destinationItem = item)),
  )

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: alphabetSelector,
      sections,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
      projectNavigationItemQuerySelector: (sectionId) => {
        const char = getCharFromSectionId(sectionId)
        return `a[data-char="${char}"]`
      },
      threshold: {
        mobile: 0.2,
      },
    })
  })
}

function getCharFromSectionId(sectionId: string) {
  return startsWithNumber(sectionId) ? '#' : sectionId.charAt(0)
}

function isItemCharEqualToHash(item: HTMLElement, hash: string) {
  const char = hash.charAt(1)
  const itemChar = item.getAttribute('data-char')

  if (startsWithNumber(char)) return itemChar === '#'

  return itemChar === char
}
