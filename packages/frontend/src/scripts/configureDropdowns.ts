import { makeQuery } from './query'

export function configureDropdowns() {
  const { $$ } = makeQuery(document.body)

  const dropdowns = $$('[data-role=dropdown]')

  for (const dropdown of dropdowns) {
    const button = dropdown.querySelector<HTMLInputElement>(
      '[data-role=dropdown-button]',
    )
    if (!button) continue
    const hiddenItems = dropdown.querySelectorAll<HTMLElement>(
      '[data-role=dropdown-item]',
    )

    const closeDropdown = () => {
      hiddenItems.forEach((item) => {
        item.classList.add('hidden')
        item.classList.add('pointer-events-none')
      })
    }

    const openDropdown = () => {
      hiddenItems.forEach((item) => {
        item.classList.toggle('hidden')
        item.classList.toggle('pointer-events-none')
      })
    }

    button.addEventListener('click', () => {
      openDropdown()
    })

    document.addEventListener('click', (event) => {
      const isClickInsideDropdown = dropdown.contains(event.target as Node)

      if (!isClickInsideDropdown) {
        closeDropdown()
        button.checked = false
      }
    })
  }
}
