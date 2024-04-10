import { clamp } from '../utils'
import { makeQuery } from './query'
import { isMobile } from './utils/isMobile'

export function configureTooltips() {
  const { $, $$ } = makeQuery()

  const tooltip = $('[data-role=tooltip-popup]')
  const tooltipContent = $('[data-role=tooltip-popup] span')
  const tooltipTriangle = $('[data-role=tooltip-popup-triangle]')
  const elements = $$('[data-role=tooltip]')

  let activeElement: HTMLElement | undefined
  let visible = false

  function show(
    element: HTMLElement,
    trigger: Element,
    content: Element,
    isDisabledOnMobile: boolean,
  ) {
    if ((isDisabledOnMobile && isMobile()) || !content.innerHTML) return
    visible = true
    activeElement = element
    tooltip.classList.toggle('max-w-[300px]', !element.dataset.tooltipBig)
    const rect = trigger.getBoundingClientRect()
    tooltipContent.innerHTML = content.innerHTML
    const prefferedPosition = content.getAttribute('data-preffered-position')
    tooltip.style.display = 'block'
    const tooltipHeight = tooltip.getBoundingClientRect().height
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const left = clamp(
      rect.left + rect.width / 2 - tooltipWidth / 2,
      10,
      window.innerWidth - 10 - tooltipWidth,
    )
    tooltip.style.left = `${left}px`
    const isOverflowingOnBottom =
      rect.y + rect.height + 7 + tooltipHeight >= window.innerHeight
    const isOverflowingOnTop = rect.top - tooltipHeight <= 7

    if (
      (prefferedPosition === 'top' && !isOverflowingOnTop) ||
      isOverflowingOnBottom
    ) {
      tooltip.style.top = `${rect.top - 7 - tooltipHeight}px`
      tooltipTriangle.style.top = `${rect.top - 7}px`
      tooltipTriangle.classList.add('rotate-180')
    } else {
      tooltip.style.top = `${rect.bottom + 7}px`
      tooltipTriangle.style.top = `${rect.bottom}px`
      tooltipTriangle.classList.remove('rotate-180')
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
    .querySelectorAll('[data-role="table"]')
    .forEach((x) => x.addEventListener('scroll', hide))
  document.body.addEventListener('scroll', hide)
  window.addEventListener('scroll', hide)
  document.body.addEventListener('click', (e) => {
    if (e.currentTarget !== tooltip) {
      hide()
    }
  })

  for (const element of elements) {
    const trigger = element.children.item(0)
    const content = element.children.item(1)

    if (!content || !trigger) continue
    if (
      trigger?.getAttribute('data-role') !== 'tooltip-trigger' ||
      content?.getAttribute('data-role') !== 'tooltip-content'
    ) {
      throw new Error('Invalid tooltip structure')
    }

    element.setAttribute('tabindex', '0')
    const isDisabledOnMobile = Boolean(
      element.getAttribute('data-tooltip-mobile-disabled'),
    )
    const isOnClickHideDisabled = Boolean(
      trigger.getAttribute('data-on-click-hide-disabled'),
    )

    let mouseEnteredAt = Date.now()

    trigger.addEventListener('mouseenter', () => {
      mouseEnteredAt = Date.now()
      show(element, trigger, content, isDisabledOnMobile)
    })
    trigger.addEventListener('mouseleave', hide)
    trigger.addEventListener('focus', () =>
      show(element, trigger, content, isDisabledOnMobile),
    )
    trigger.addEventListener('blur', hide)

    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      if (isMobile() && !isDisabledOnMobile) {
        e.preventDefault()
      }
      if (activeElement === element) {
        // only hide if immediately preceded by mouse enter
        if (Date.now() - mouseEnteredAt > 50 && !isOnClickHideDisabled) {
          hide()
        }
      } else {
        show(element, trigger, content, isDisabledOnMobile)
      }
    })
  }
}
