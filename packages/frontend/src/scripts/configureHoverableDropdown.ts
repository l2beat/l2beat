export function configureHoverableDropdown() {
  const hoverableDropdowns = document.querySelectorAll('.HoverableDropdown')

  if (!hoverableDropdowns) return

  const show = (hoverableDrodpownMenu: Element) => {
    hoverableDrodpownMenu.classList.remove('opacity-0', 'pointer-events-none')
  }

  const hide = (hoverableDrodpownMenu: Element) => {
    hoverableDrodpownMenu.classList.add('opacity-0', 'pointer-events-none')
  }

  hoverableDropdowns.forEach((hoverableDropdown) => {
    const hoverableDropdownToggle = hoverableDropdown.querySelector(
      '.HoverableDropdownToggle',
    )
    const hoverableDropdownMenu = hoverableDropdown.querySelector(
      '.HoverableDropdownMenu',
    )
    if (!hoverableDropdownToggle || !hoverableDropdownMenu) return

    hoverableDropdownToggle.addEventListener('mouseenter', () => {
      show(hoverableDropdownMenu)
    })

    hoverableDropdown.addEventListener('mouseleave', () => {
      hide(hoverableDropdownMenu)
    })
  })
}
