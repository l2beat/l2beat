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
    const items = dropdown.querySelectorAll('.Dropdown-Item')

    button.addEventListener('click', () => {
      items.forEach((item) => item.classList.toggle('hidden'))
    })
  }
}
