import { makeQuery } from './query'

export function configureTooltips() {
  const { $, $$ } = makeQuery(document.body)

  const elements = $$('.Tooltip[title]')

  const tooltip = $('.Tooltip-Popup')
  const tooltipText = $('.Tooltip-Popup span')
  const tooltipTriangle = $('.Tooltip-Triangle')

  let activeElement: HTMLElement | undefined
  let visible = false

  function show(element: HTMLElement, title: string) {
    visible = true
    activeElement = element
    const rect = activeElement.getBoundingClientRect()
    tooltipText.innerText = title
    tooltip.style.display = 'block'
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const left = clamp(
      rect.left + rect.width / 2 - tooltipWidth / 2,
      10,
      window.innerWidth - 10 - tooltipWidth
    )
    tooltip.style.left = left + 'px'
    tooltip.style.top = rect.bottom + 7 + 'px'

    tooltipTriangle.style.left =
      clamp(rect.left + rect.width / 2 - 8, 10, window.innerWidth - 10 - 16) +
      'px'
    tooltipTriangle.style.top = rect.bottom + 'px'
  }

  function hide() {
    if (visible) {
      visible = false
      tooltip.style.display = 'none'
      activeElement = undefined
    }
  }

  window.addEventListener('resize', hide)
  document
    .querySelectorAll('.TableView')
    .forEach((x) => x.addEventListener('scroll', hide))
  document.body.addEventListener('scroll', hide)
  document.body.addEventListener('click', (e) => {
    if (e.currentTarget !== tooltip) {
      hide()
    }
  })

  for (const element of elements) {
    const title = element.getAttribute('title') ?? ''
    element.removeAttribute('title')

    let mouseEnteredAt = Date.now()

    element.addEventListener('mouseenter', () => {
      mouseEnteredAt = Date.now()
      show(element, title)
    })
    element.addEventListener('mouseleave', hide)

    element.addEventListener('click', (e) => {
      e.stopPropagation()
      if (activeElement === element) {
        // only hide if immediately preceded by mouse enter
        if (Date.now() - mouseEnteredAt > 50) {
          hide()
        }
      } else {
        show(element, title)
      }
    })
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
