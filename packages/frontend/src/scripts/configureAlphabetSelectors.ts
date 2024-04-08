import { makeQuery } from './query'

export function configureAlphabetSelectors() {
  const { $ } = makeQuery(document.body)

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

    if (
      hash &&
      alphabetSelectorItem.getAttribute('data-char') === hash.charAt(1)
    ) {
      changeSelected(alphabetSelectorItem)
    }

    alphabetSelectorItem.addEventListener('click', () =>
      changeSelected(alphabetSelectorItem),
    )
  })

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash
    const toSelect = alphabetSelectorItems.find(
      (alphabetSelectorItem) =>
        alphabetSelectorItem.getAttribute('data-char') === hash.charAt(1),
    )
    if (toSelect) {
      changeSelected(toSelect)
    }
  })
}
