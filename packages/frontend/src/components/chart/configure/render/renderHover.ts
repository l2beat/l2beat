import { formatTps } from '../../../../utils/formatTps'
import { ChartElements } from '../elements'
import { State } from '../state/State'
import { formatCurrencyExactValue } from '../update/view/format'

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

  const isActivity = state.view.chart.type === 'ActivityChart'
  const showEthereum = state.controls.showEthereum
  elements.hover.circle?.classList.toggle('hidden', isActivity)
  elements.hover.redCircle?.classList.toggle('hidden', !isActivity)
  elements.hover.blueSquare?.classList.toggle(
    'hidden',
    !(isActivity && showEthereum),
  )

  const rect = elements.view.view?.getBoundingClientRect()
  if (!rect) {
    return
  }

  elements.hover.hover?.classList.remove('hidden')
  const point = state.view.chart.points[state.view.showHoverAtIndex]

  const left = point.x * rect.width
  const bottom1 = Math.max(0, point.y * (rect.height - 20))
  const bottom2 =
    'y2' in point && state.controls.showEthereum
      ? Math.max(0, point.y2 * (rect.height - 20))
      : bottom1

  if (elements.hover.line) {
    elements.hover.line.style.left = `${left - 1}px`
  }

  if (elements.hover.circle) {
    elements.hover.circle.style.left = `${left - 4}px`
    elements.hover.circle.style.bottom = `${bottom1 - 4}px`
  }

  if (elements.hover.redCircle) {
    elements.hover.redCircle.style.left = `${left - 4}px`
    elements.hover.redCircle.style.bottom = `${bottom1 - 4}px`
  }

  if (elements.hover.blueSquare) {
    elements.hover.blueSquare.style.left = `${left - 4}px`
    elements.hover.blueSquare.style.bottom = `${bottom2 - 4}px`
  }

  if (elements.hover.contents) {
    const rows: string[] = []
    rows.push(renderDateRow(point.date))
    if (state.view.chart.type === 'AggregateTvlChart' && 'eth' in point) {
      if (state.controls.currency === 'eth') {
        rows.push(renderCurrencyRow(point.eth, 'ETH'))
        rows.push(renderCurrencyRow(point.usd, 'USD'))
      } else {
        rows.push(renderCurrencyRow(point.usd, 'USD'))
        rows.push(renderCurrencyRow(point.eth, 'ETH'))
      }
    } else if (
      state.view.chart.type === 'TokenTvlChart' &&
      'balance' in point
    ) {
      rows.push(renderCurrencyRow(point.balance, point.symbol))
      rows.push(renderCurrencyRow(point.usd, 'USD'))
    } else if (state.view.chart.type === 'ActivityChart' && 'tps' in point) {
      if (state.controls.showEthereum) {
        if (point.ethereumTps > point.tps) {
          rows.push(renderTpsRow(point.ethereumTps, 'ETH'))
          rows.push(renderTpsRow(point.tps, 'L2'))
        } else {
          rows.push(renderTpsRow(point.tps, 'L2'))
          rows.push(renderTpsRow(point.ethereumTps, 'ETH'))
        }
      } else {
        rows.push(renderTpsRow(point.tps, 'L2'))
      }
    }

    elements.hover.contents.innerHTML = rows.join('\n')
  }

  if (elements.hover.contents) {
    const { height } = elements.hover.contents.getBoundingClientRect()
    const bottom = (bottom1 + bottom2) / 2
    const contentsBottom = Math.min(
      rect.height - height - 8,
      Math.max(bottom - height / 2, 8),
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

function renderDateRow(date: string) {
  return `<div class="mb-1">${date}</div>`
}

function renderCurrencyRow(value: number, ticker: string) {
  const formatted = formatCurrencyExactValue(value, ticker)
  return `<div><span class="font-bold">${formatted}</span> <span>${ticker}</span></div>`
}

function renderTpsRow(value: number, source: 'L2' | 'ETH') {
  const sourceHTML = `<span class="font-bold">${source}</span>`
  const formatted = formatTps(value)
  const formattedHTML = `<span class="font-bold">${formatted}</span>`
  const customStyles =
    source === 'L2' ? 'bg-red-300 rounded-full' : 'bg-blue-600 rotate-45'
  const circleClass = `inline-block mr-1 w-2 h-2 relative -top-px border-2 border-current ${customStyles}`
  const circleHTML = `<div class="${circleClass}"></div>`
  return `<div>${circleHTML} ${sourceHTML} avg. TPS: ${formattedHTML}</div>`
}
