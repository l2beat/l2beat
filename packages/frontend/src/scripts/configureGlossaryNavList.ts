import debounce from 'lodash/debounce'

import { makeQuery } from './query'
import { highlightCurrentSection } from './utils/highlightCurrentSection'
import { scrollVerticallyToItem } from './utils/scrollToItem'

export function configureGlossaryNavList() {
  const { $: document$ } = makeQuery()

  const navList = document$.maybe('[data-role=glossary-side-nav]')

  if (!navList) return
  let destinationItem: HTMLAnchorElement | null = null

  const { $, $$ } = makeQuery(navList)
  const overflowingContainer = $('ul')

  const navItems = $$<HTMLAnchorElement>('[data-role=glossary-side-nav-item]')
  let selectedNavItem: HTMLElement | undefined = navItems.find(
    (item) => item.href === window.location.href,
  )

  function highlightItem(item: HTMLElement) {
    const isAlreadySelected = item.getAttribute('data-selected') === 'true'
    if (isAlreadySelected) return

    selectedNavItem?.removeAttribute('data-selected')
    item.setAttribute('data-selected', 'true')
    selectedNavItem = item
  }

  if (selectedNavItem) {
    highlightItem(selectedNavItem)
  }

  navItems.forEach((navItem) =>
    navItem.addEventListener('click', () => (destinationItem = navItem)),
  )

  const scrollToItem = debounce(
    (item: HTMLAnchorElement) =>
      scrollVerticallyToItem({ item, overflowingContainer, destinationItem }),
    50,
  )

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: navList,
      sections: Array.from(document.querySelectorAll('section')),
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
    })
  })
}
