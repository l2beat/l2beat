import { makeQuery } from './query'
import { setSortingArrowsOrderKey } from './table/configureSorting'

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
    setSortingArrowsOrderKey(
      'total',
      value ? 'excluded-associated-tokens' : 'included-associated-tokens',
    )
    setSortingArrowsOrderKey(
      'mkt-share',
      value ? 'excluded-associated-tokens' : 'included-associated-tokens',
    )
  })
}
