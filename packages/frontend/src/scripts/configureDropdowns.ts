import { makeQuery } from './query'

export function configureDropdowns() {
  const { $$ } = makeQuery(document.body)

  if (!document.querySelector('.Dropdown')) {
    return
  }

  const dropdowns = $$('.Dropdown')

  for (const dropdown of dropdowns) {
    const button = dropdown.querySelector('.Dropdown-Button')
    if (!button) continue
    const hiddenItems = dropdown.querySelectorAll('.Dropdown-Item')
    const transparentItems = dropdown.querySelectorAll(
      '.Dropdown-Transparent-Item',
    )

    button.addEventListener('click', () => {
      hiddenItems.forEach((item) => item.classList.toggle('hidden'))
      transparentItems.forEach((item) => item.classList.toggle('opacity-0'))
      transparentItems.forEach((item) =>
        item.classList.toggle('pointer-events-none'),
      )
    })
  }
}
