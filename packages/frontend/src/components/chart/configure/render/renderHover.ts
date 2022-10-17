import { ChartElements } from '../elements'
import { State } from '../state/State'

export function renderHover(
  elements: ChartElements,
  previousState: State,
  state: State,
) {
  if (
    state.view.showHoverAtIndex === previousState.view.showHoverAtIndex &&
    state.view.chart === previousState.view.chart
  ) {
    return
  }

  if (
    state.view.showHoverAtIndex === undefined ||
    state.view.chart === undefined
  ) {
    elements.hover.hover?.classList.add('hidden')
    return
  }

  const rect = elements.view.view?.getBoundingClientRect()
  if (!rect) {
    return
  }

  elements.hover.hover?.classList.remove('hidden')
  const point = state.view.chart.points[state.view.showHoverAtIndex]

  const left = point.x * rect.width
  const bottom = Math.max(0, point.y * (rect.height - 20))

  if (elements.hover.line) {
    elements.hover.line.style.left = `${left - 1}px`
  }

  if (elements.hover.circle) {
    elements.hover.circle.style.left = `${left - 4}px`
    elements.hover.circle.style.bottom = `${bottom - 4}px`
  }

  if (elements.hover.date) {
    elements.hover.date.innerHTML = point.date
  }

  if (elements.hover.valueA) {
    if ('eth' in point) {
      elements.hover.valueA.innerHTML = point.usd
    }
    if ('balance' in point) {
      elements.hover.valueA.innerHTML = point.balance
    }
    if ('tps' in point) {
      elements.hover.valueA.innerHTML = point.tps
    }
  }

  if (elements.hover.valueB) {
    if ('eth' in point) {
      elements.hover.valueB.innerHTML = point.eth
    }
    if ('balance' in point) {
      elements.hover.valueB.innerHTML = point.usd
    }
    if ('tps' in point) {
      elements.hover.valueB.innerHTML = point.ethereumTps + ' (ETH)'
    }
  }

  if (elements.hover.contents) {
    const contentsBottom = Math.min(
      rect.height - 76 - 8,
      Math.max(bottom - 38, 8),
    )
    elements.hover.contents.style.bottom = `${contentsBottom}px`
    if (point.x < 0.5) {
      elements.hover.contents.style.removeProperty('right')
      elements.hover.contents.style.left = `${left + 8}px`
    } else {
      elements.hover.contents.style.removeProperty('left')
      elements.hover.contents.style.right = `${rect.width - left + 8}px`
    }
  }
}
