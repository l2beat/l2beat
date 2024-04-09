import { startsWithNumber } from '../utils/startsWithLetterOrNumber'
import { makeQuery } from './query'

export function configureAlphabetSelectors() {
  const { $ } = makeQuery()

  const alphabetSelector = $.maybe('[data-role=alphabet-selector]')
  if (!alphabetSelector) return

  configureAlphabetSelector(alphabetSelector)
}

function configureAlphabetSelector(alphabetSelector: HTMLElement) {
  const { $$ } = makeQuery(alphabetSelector)
  const alphabetSelectorItems = $$('[data-role=alphabet-selector-item]')
  const hash = window.location.hash

  let selectedAlphabetSelectorItem: HTMLElement | null = null

  function changeSelected(selectedItem: HTMLElement) {
    selectedAlphabetSelectorItem?.removeAttribute('data-selected')
    selectedItem.setAttribute('data-selected', 'true')
    selectedAlphabetSelectorItem = selectedItem
  }

  alphabetSelectorItems.forEach((alphabetSelectorItem) => {
    const isDisabled =
      alphabetSelectorItem.getAttribute('aria-disabled') === 'true'
    if (isDisabled) return

    if (hash && isItemCharEqualToHash(alphabetSelectorItem, hash)) {
      changeSelected(alphabetSelectorItem)
    }

    alphabetSelectorItem.addEventListener('click', () =>
      changeSelected(alphabetSelectorItem),
    )
  })

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash
    const toSelect = alphabetSelectorItems.find((alphabetSelectorItem) =>
      isItemCharEqualToHash(alphabetSelectorItem, hash),
    )
    if (toSelect) {
      changeSelected(toSelect)
    }
  })
}

function isItemCharEqualToHash(item: HTMLElement, hash: string) {
  const char = hash.charAt(1)
  const itemChar = item.getAttribute('data-char')

  if (startsWithNumber(char)) return itemChar === '#'

  return itemChar === char
}
