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
  const { $, $$ } = makeQuery(alphabetSelector)
  const alphabetSelectorItems = $$<HTMLAnchorElement>(
    '[data-role=alphabet-selector-item]',
  )
  const hash = window.location.hash

  let destinationItem: HTMLAnchorElement | null = null
  let selectedAlphabetSelectorItem: HTMLElement | null = null
  const overflowingList = $('[data-role=overflow-wrapper-content]')

  function highlightItem(item: HTMLElement) {
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

  alphabetSelectorItems.forEach((alphabetSelectorItem) => {
    const isDisabled =
      alphabetSelectorItem.getAttribute('aria-disabled') === 'true'
    if (isDisabled) return

    if (hash && isItemCharEqualToHash(alphabetSelectorItem, hash)) {
      highlightItem(alphabetSelectorItem)
    }

    alphabetSelectorItem.addEventListener(
      'click',
      () => (destinationItem = alphabetSelectorItem),
    )
  })

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: alphabetSelector,
      sections: Array.from(document.querySelectorAll('section')),
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
      projectNavigationItemQuerySelector: (sectionId) =>
        `a[data-char="${sectionId.charAt(0)}"]`,
    })
  })
}

function isItemCharEqualToHash(item: HTMLElement, hash: string) {
  const char = hash.charAt(1)
  const itemChar = item.getAttribute('data-char')

  if (startsWithNumber(char)) return itemChar === '#'

  return itemChar === char
}
