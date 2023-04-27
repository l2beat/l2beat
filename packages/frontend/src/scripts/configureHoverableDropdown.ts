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
