import { clamp } from '../utils'
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
    const hiddenItems = dropdown.querySelectorAll<HTMLElement>('.Dropdown-Item')
    const transparentItems = dropdown.querySelectorAll<HTMLElement>(
      '.Dropdown-Transparent-Item',
    )

    const closeDropdown = () => {
      hiddenItems.forEach((item) => {
        item.classList.add('hidden')
      })
      transparentItems.forEach((item) => {
        item.classList.add('opacity-0')
        item.classList.add('pointer-events-none')
      })
    }

    const openDropdown = () => {
      hiddenItems.forEach((item) => {
        item.classList.toggle('hidden')
      })
      transparentItems.forEach((item) => {
        item.classList.toggle('opacity-0')
        item.classList.toggle('pointer-events-none')
      })
      onResize(dropdown, hiddenItems, transparentItems)
    }

    button.addEventListener('click', () => {
      openDropdown()
    })

    document.addEventListener('click', (event) => {
      const isClickInsideDropdown = dropdown.contains(event.target as Node)

      if (!isClickInsideDropdown) {
        closeDropdown()
      }
    })

    window.addEventListener('resize', () => {
      onResize(dropdown, hiddenItems, transparentItems)
    })
  }
}

function onResize(
  dropdown: HTMLElement,
  hiddenItems: NodeListOf<HTMLElement>,
  transparentItems: NodeListOf<HTMLElement>,
) {
  hiddenItems.forEach((item) => {
    if (isCentered(item)) {
      recenter(dropdown, item)
    }
  })
  transparentItems.forEach((item) => {
    if (isCentered(item)) {
      recenter(dropdown, item)
    }
  })
}

function recenter(dropdown: HTMLElement, item: HTMLElement) {
  const togglerRect = dropdown.getBoundingClientRect()
  const contentRect = item.getBoundingClientRect()

  const left = clamp(
    togglerRect.left + togglerRect.width / 2 - contentRect.width / 2,
    24,
    window.innerWidth - 24 - contentRect.width,
  )

  item.style.left = `${left}px`
}

function isCentered(element: HTMLElement): boolean {
  return (
    element.dataset.centered !== undefined &&
    element.dataset.centered === 'true'
  )
}
