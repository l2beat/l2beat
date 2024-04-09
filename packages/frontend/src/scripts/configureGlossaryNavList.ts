import { makeQuery } from './query'

export function configureGlossaryNavList() {
  const { $ } = makeQuery()

  const navList = $.maybe('[data-role=glossary-nav-list]')

  if (!navList) return

  const { $$ } = makeQuery(navList)
  const navItems = $$<HTMLAnchorElement>('[data-role=glossary-nav-item]')
  let selectedNavItem: HTMLElement | undefined = navItems.find(
    (item) => item.href === window.location.href,
  )

  function onClick(item: HTMLElement) {
    const isAlreadySelected = item.getAttribute('data-selected') === 'true'
    if (isAlreadySelected) return

    selectedNavItem?.removeAttribute('data-selected')
    item.setAttribute('data-selected', 'true')
    // item.scrollIntoView({ block: 'center', behavior: 'smooth' })
    selectedNavItem = item
  }

  if (selectedNavItem) {
    onClick(selectedNavItem)
  }

  navItems.forEach((navItem) => {
    navItem.addEventListener('click', () => onClick(navItem))
  })

  window.addEventListener('hashchange', () => {
    const item = navItems.find(
      (navItem) => navItem.href === window.location.href,
    )
    if (!item) return

    onClick(item)
  })
}
