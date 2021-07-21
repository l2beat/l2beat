export function configureTooltips() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('.tooltip[title]')
  )

  const tooltip = document.createElement('div')
  tooltip.className = 'tooltip__popup'
  const tooltipText = document.createElement('span')
  tooltip.appendChild(tooltipText)
  const tooltipTriangle = document.createElement('div')
  tooltipTriangle.className = 'tooltip__triangle'
  tooltip.appendChild(tooltipTriangle)
  let activeElement: HTMLElement | undefined
  document.body.appendChild(tooltip)

  let visible = false

  function show(element: HTMLElement, title: string) {
    visible = true
    activeElement = element
    const rect = activeElement.getBoundingClientRect()
    tooltipText.innerText = title
    tooltip.style.display = 'block'
    tooltip.style.left = Math.max(rect.left - 8, 10) + 'px'
    tooltip.style.top = rect.bottom + 12 + 'px'
    tooltip.style.right = 'unset'

    tooltipTriangle.style.left = rect.left + rect.width / 2 - 8 + 'px'
    tooltipTriangle.style.top = rect.bottom + 4 + 'px'
    
    if (tooltip.getBoundingClientRect().right >= window.innerWidth - 10) {
      tooltip.style.left = 'unset'
      tooltip.style.right = '10px'
    }
  }

  function hide() {
    if (visible) {
      visible = false
      tooltip.style.display = 'none'
      activeElement = undefined
    }
  }

  window.addEventListener('resize', hide)
  document.querySelector('.financials')?.addEventListener('scroll', hide)
  document.body.addEventListener('scroll', hide)
  document.body.addEventListener('click', (e) => {
    if (e.currentTarget !== tooltip) {
      hide()
    }
  })

  for (const element of elements) {
    const title = element.getAttribute('title') ?? ''
    element.removeAttribute('title')

    element.addEventListener('click', (e) => {
      e.stopPropagation()
      if (activeElement === element) {
        hide()
      } else {
        show(element, title)
      }
    })
  }
}
