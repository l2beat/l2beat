import { makeQuery } from './query'

export function configureDropdowns() {
  const { $$ } = makeQuery(document.body)

  if (!document.querySelector('.Dropdown')) {
    return
  }

  const dropdowns = $$('.Dropdown')

  for (const dropdown of dropdowns) {
    const button = dropdown.querySelector('.Dropdown-Button')
    const items = dropdown.querySelector('.Dropdown-Items')
    const arrow = dropdown.querySelector('.Dropdown-Arrow')

    document.body.addEventListener('click', (e) => {
      if (e.currentTarget !== dropdown) {
        items?.classList.add('hidden')
        arrow?.classList.remove('rotate-180')
      }
    })

    button?.addEventListener('click', (e) => {
      e.stopPropagation()
      items?.classList.toggle('hidden')
      arrow?.classList.toggle('rotate-180')
    })
  }
}
