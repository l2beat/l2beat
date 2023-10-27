const overflowThreshold = 24

export function configureHoverableDropdown() {
  const hoverableDropdowns =
    document.querySelectorAll<HTMLElement>('.HoverableDropdown')

  const show = (menu: HTMLElement) => {
    menu.classList.remove('opacity-0', 'pointer-events-none')
  }

  const hide = (menu: HTMLElement) => {
    menu.classList.add('opacity-0', 'pointer-events-none')
  }

  hoverableDropdowns.forEach((hoverableDropdown) => {
    const elements = getHoverableDropdownElements(hoverableDropdown)

    if (!elements) return

    const { menu, toggle } = elements

    toggle.addEventListener('mouseenter', () => {
      show(menu)
    })

    hoverableDropdown.addEventListener('mouseleave', () => {
      hide(menu)
    })
  })

  window.addEventListener('load', () => moveOverflowingMenu(hoverableDropdowns))

  window.addEventListener('resize', () =>
    moveOverflowingMenu(hoverableDropdowns),
  )
}

function moveOverflowingMenu(hoverableDropdowns: NodeListOf<HTMLElement>) {
  hoverableDropdowns.forEach((hoverableDropdown) => {
    const elements = getHoverableDropdownElements(hoverableDropdown)

    if (!elements) return

    const { menu } = elements

    const hoverableDropdownRect = hoverableDropdown.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    const diff =
      hoverableDropdownRect.left +
      menuRect.width +
      overflowThreshold -
      window.innerWidth
    menu.classList.toggle('right-0', diff > 0)
  })
}

function getHoverableDropdownElements(hoverableDropdown: HTMLElement) {
  const toggle = hoverableDropdown.querySelector<HTMLElement>(
    '.HoverableDropdownToggle',
  )

  const menu = hoverableDropdown.querySelector<HTMLElement>(
    '.HoverableDropdownMenu',
  )

  if (!toggle || !menu) return

  return {
    toggle,
    menu,
  }
}
