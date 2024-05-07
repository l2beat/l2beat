import { makeQuery } from './query'

export function configureDropdowns() {
  const { $$ } = makeQuery(document.body)

  const dropdowns = $$('[data-role=dropdown]')

  for (const dropdown of dropdowns) {
    const {$} = makeQuery(dropdown)

    const trigger = $<HTMLInputElement>(
      '[data-role=dropdown-trigger]',
    )
    const content = $<HTMLElement>(
      '[data-role=dropdown-content]',
    )

    const close = () =>
      content.removeAttribute('data-open')

    const open = () =>
      content.setAttribute('data-open', 'true')

    trigger.addEventListener('change', () => {
      if (trigger.checked) open()
      else close()
    })

    document.addEventListener('click', (event) => {
      const isClickInsideDropdown = dropdown.contains(event.target as Node)

      if (!isClickInsideDropdown && trigger.checked) {
        close()
        trigger.checked = false
      }
    })
  }
}
