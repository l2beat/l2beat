import debounce from 'lodash/debounce'

import { makeQuery } from './query'
import { highlightCurrentSection } from './utils/highlightCurrentSection'
import { scrollVerticallyToItem } from './utils/scrollToItem'

export function configureGlossarySideNav() {
  const { $: document$, $$: document$$ } = makeQuery()
  const navList = document$.maybe('[data-role=glossary-side-nav]')

  if (!navList) return

  const sections = document$$('section')

  const { $, $$ } = makeQuery(navList)
  const overflowingContainer = $('ul')
  const navItems = $$<HTMLAnchorElement>('[data-role=glossary-side-nav-item]')

  let selectedNavItem = navItems.find(
    (item) => item.href === window.location.href,
  )

  function highlightItem(item: HTMLAnchorElement) {
    const isAlreadySelected = item.getAttribute('data-selected') === 'true'
    if (isAlreadySelected) return

    selectedNavItem?.removeAttribute('data-selected')
    item.setAttribute('data-selected', 'true')
    selectedNavItem = item
  }

  const scrollToItem = debounce(
    (item: HTMLAnchorElement) =>
      scrollVerticallyToItem({ item, overflowingContainer }),
    50,
  )

  if (selectedNavItem) {
    highlightItem(selectedNavItem)
    scrollToItem(selectedNavItem)
  }

  window.addEventListener('scroll', () => {
    highlightCurrentSection({
      navigationList: navList,
      sections,
      onHighlight: (item) => {
        highlightItem(item)
        scrollToItem(item)
      },
      threshold: {
        desktop: '164px',
        mobile: '132px',
      },
    })
  })
}
