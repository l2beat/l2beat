import { clamp } from '../utils'
import { makeQuery } from './query'
import { isMobile } from './utils/isMobile'

export function configureTooltips() {
  const { $, $$ } = makeQuery(document.body)

  if (!document.querySelector('.Tooltip-Popup')) {
    return
  }

  const elements = $$('.Tooltip[title]')

  const tooltip = $('.Tooltip-Popup')
  const tooltipText = $('.Tooltip-Popup span')
  const tooltipTriangle = $('.Tooltip-Triangle')

  let activeElement: HTMLElement | undefined
  let visible = false

  function show(
    element: HTMLElement,
    title: string,
    isDisabledOnMobile: boolean,
  ) {
    if (isDisabledOnMobile && isMobile()) return
    visible = true
    activeElement = element
    tooltip.classList.toggle('max-w-[300px]', !element.dataset.tooltipBig)
    const rect = activeElement.getBoundingClientRect()
    tooltipText.innerHTML = title
    tooltip.style.display = 'block'
    const tooltipHeight = tooltip.getBoundingClientRect().height
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const left = clamp(
      rect.left + rect.width / 2 - tooltipWidth / 2,
      10,
      window.innerWidth - 10 - tooltipWidth,
    )
    tooltip.style.left = `${left}px`
    if (rect.y + rect.height + 7 + tooltipHeight < window.innerHeight) {
      tooltip.style.top = `${rect.bottom + 7}px`
      tooltipTriangle.style.top = `${rect.bottom}px`
      tooltipTriangle.classList.remove('rotate-180')
    } else {
      tooltip.style.top = `${rect.top - 7 - tooltipHeight}px`
      tooltipTriangle.style.top = `${rect.top - 7}px`
      tooltipTriangle.classList.add('rotate-180')
    }

    tooltip.style.textAlign =
      element.dataset.tooltipAlign === 'right' ? 'right' : 'left'

    const triangleLeft = clamp(
      rect.left + rect.width / 2 - 8,
      10,
      window.innerWidth - 10 - 16,
    )
    tooltipTriangle.style.left = `${triangleLeft}px`
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
  document
    .querySelectorAll('[data-role="table"]')
    .forEach((x) => x.addEventListener('scroll', hide))
  document.body.addEventListener('scroll', hide)
  window.addEventListener('scroll', hide)
  window.addEventListener('scroll', hide)
  document.body.addEventListener('click', (e) => {
    if (e.currentTarget !== tooltip) {
      hide()
    }
  })

  for (const element of elements) {
    const title = element.getAttribute('title') ?? ''
    element.removeAttribute('title')
    element.setAttribute('tabindex', '0')
    const isDisabledOnMobile = Boolean(
      element.getAttribute('data-tooltip-mobile-disabled'),
    )

    let mouseEnteredAt = Date.now()

    element.addEventListener('mouseenter', () => {
      mouseEnteredAt = Date.now()
      show(element, title, isDisabledOnMobile)
    })
    element.addEventListener('mouseleave', hide)
    element.addEventListener('focus', () =>
      show(element, title, isDisabledOnMobile),
    )
    element.addEventListener('blur', hide)

    element.addEventListener('click', (e) => {
      e.stopPropagation()
      if (isMobile() && !isDisabledOnMobile) {
        e.preventDefault()
      }
      if (activeElement === element) {
        // only hide if immediately preceded by mouse enter
        if (Date.now() - mouseEnteredAt > 50) {
          hide()
        }
      } else {
        show(element, title, isDisabledOnMobile)
      }
    })
  }
}
