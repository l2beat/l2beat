import { makeQuery } from './query'

export function configureAlphabetSelectors() {
  const { $ } = makeQuery(document.body)

  const alphabetSelector = $.maybe('[data-role=alphabet-selector]')
  if (!alphabetSelector) return

  const hash = window.location.hash
  configureAlphabetSelector(alphabetSelector, hash)
}

function configureAlphabetSelector(
  alphabetSelector: HTMLElement,
  hash: string,
) {
  const { $$ } = makeQuery(alphabetSelector)
  const alphabetSelectorItems = $$('[data-role=alphabet-selector-item]')

  let selectedAlphabetSelectorItem: HTMLElement | null = null
  alphabetSelectorItems.forEach((alphabetSelectorItem) => {
    const isDisabled =
      alphabetSelectorItem.getAttribute('aria-disabled') === 'true'
    if (isDisabled) return

    if (hash && alphabetSelectorItem.getAttribute('href') === hash) {
      alphabetSelectorItem.setAttribute('data-selected', 'true')
      selectedAlphabetSelectorItem = alphabetSelectorItem
    }

    alphabetSelectorItem.addEventListener('click', () => {
      selectedAlphabetSelectorItem?.removeAttribute('data-selected')
      alphabetSelectorItem.setAttribute('data-selected', 'true')
      selectedAlphabetSelectorItem = alphabetSelectorItem
    })
  })
}
