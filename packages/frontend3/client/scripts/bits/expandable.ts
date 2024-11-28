export function setupExpandable() {
  const components = document.querySelectorAll<HTMLElement>(
    '[data-bit="expandable"]',
  )
  for (const component of components) {
    component.addEventListener('click', () => {
      component.nextElementSibling?.classList.toggle('hidden')
    })
  }
}
