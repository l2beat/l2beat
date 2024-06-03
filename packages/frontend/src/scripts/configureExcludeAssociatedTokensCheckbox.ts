import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'

const SORTING_ARROW_NAMES = [
  'total',
  'mkt-share',
  'canonical',
  'external',
  'native',
]

export function configureExcludeAssociatedTokensCheckbox() {
  const { $, $$ } = makeQuery()
  const checkbox = $<HTMLInputElement>('#exclude-associated-tokens-checkbox')
  const elements = $$('[data-role="exclude-associated-tokens-wrapper"]')

  checkbox.addEventListener('change', () => {
    const value = checkbox.checked
    elements.forEach((element) => {
      if (value) {
        element.setAttribute('data-associated-tokens-excluded', 'true')
        return
      }
      element.removeAttribute('data-associated-tokens-excluded')
    })
    SORTING_ARROW_NAMES.forEach((name) =>
      setSortingArrowsOrderKey(
        name,
        value ? 'excluded-associated-tokens' : 'included-associated-tokens',
      ),
    )
  })
}
