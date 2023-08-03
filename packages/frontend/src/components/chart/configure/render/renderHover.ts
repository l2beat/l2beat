import { renderToString } from 'react-dom/server'

import { formatTps } from '../../../../utils/formatTps'
import { formatUSD } from '../../../../utils/utils'
import { Link } from '../../../Link'
import { ChartElements } from '../elements'
import { State } from '../state/State'
import { formatCurrencyExactValue } from '../update/view/format'
import { isMobile } from './isMobile'

export function renderHover(
  elements: ChartElements,
  previousState: State,
  state: State,
) {
  if (
    state.view.showHoverAtIndex === previousState.view.showHoverAtIndex &&
    state.view.showMilestoneHover === previousState.view.showMilestoneHover &&
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
    !(isActivity && showEthereum && !state.view.showMilestoneHover),
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
    elements.hover.line.classList.remove('dark:bg-green-500', 'bg-green-600')
    if (state.view.showMilestoneHover) {
      elements.hover.line.classList.add('dark:bg-green-500', 'bg-green-600')
    }
  }

  if (elements.hover.circle) {
    elements.hover.circle.style.left = `${left - 4}px`
    elements.hover.circle.style.bottom = `${bottom1 - 4}px`
    elements.hover.circle.classList.remove('hidden')
    if (elements.hover.greenSquare) {
      elements.hover.greenSquare.classList.add('hidden')
      if (state.view.showMilestoneHover) {
        elements.hover.greenSquare.classList.remove('hidden')
        elements.hover.circle.classList.add('hidden')
      }
    }
  }

  if (elements.hover.redCircle) {
    elements.hover.redCircle.style.left = `${left - 4}px`
    elements.hover.redCircle.style.bottom = `${bottom1 - 4}px`
  }

  if (elements.hover.blueSquare) {
    elements.hover.blueSquare.style.left = `${left - 4}px`
    elements.hover.blueSquare.style.bottom = `${bottom2 - 4}px`
  }

  if (elements.hover.greenSquare) {
    elements.hover.greenSquare.style.left = `${left - 4}px`
    elements.hover.greenSquare.style.bottom = `${bottom1 - 4}px`
  }

  if (elements.hover.contents) {
    const rows: string[] = []

    if (state.view.showMilestoneHover && point.milestone) {
      rows.push(renderDateRow(point.date.slice(0, 11)))
      rows.push(renderNameRow(point.milestone.name))
      if (point.milestone.description) {
        rows.push(renderDescriptionRow(point.milestone.description))
      }
      if (isMobile()) {
        rows.push(renderLearnMoreLink('Learn more', point.milestone.link))
      }
    } else {
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
        state.view.chart.type === 'AggregateDetailedTvlChart' &&
        'usd' in point &&
        'usdParts' in point
      ) {
        rows.push(renderHorizontalSeparator())
        rows.push(renderTVLRow(formatUSD(point.usd)))
        rows.push(renderHorizontalSeparator())
        rows.push(renderCBVRow(point.usdParts.cbv))
        rows.push(renderEBVRow(point.usdParts.ebv))
        rows.push(renderNMVRow(point.usdParts.nmv))
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
    }

    elements.hover.contents.innerHTML = rows.join('\n')
  }

  if (elements.hover.contents) {
    const { height } = elements.hover.contents.getBoundingClientRect()
    const bottom = (bottom1 + bottom2) / 2
    const contentsBottom = Math.min(
      rect.height - height - 16,
      Math.max(bottom - height / 2, 16),
    )
    elements.hover.contents.style.bottom = `${contentsBottom}px`
    if (point.x < 0.5) {
      elements.hover.contents.style.removeProperty('right')
      elements.hover.contents.style.left = `${left + 16}px`
    } else {
      elements.hover.contents.style.removeProperty('left')
      elements.hover.contents.style.right = `${rect.width - left + 16}px`
    }
  }
}

function renderDateRow(date: string) {
  return `<div class="mb-1">${date}</div>`
}

function renderHorizontalSeparator() {
  return `<hr class="w-full border-gray-200 dark:border-gray-650 md:border-t-1 my-1"/>`
}

function renderTVLRow(tvl: string) {
  return `<div class="flex w-full justify-between"><div><span class="text-gray-50">Total TVL</span></div><div><span class="font-bold">${tvl}</span></div></div>`
}

const CBVIcon =
  '<svg class="w-2 h-2" xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none"><circle cx="4.5" cy="4.5" r="3.5" fill="#A64EFF" stroke="white"/></svg>'

const EBVIcon =
  '<svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1.16987 8.5L5.5 1L9.83013 8.5H1.16987Z" fill="#EF8F00" stroke="white"/></svg>'

const NMVIcon =
  '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> <g filter="url(#filter0_d_106_14454)"> <rect x="3.5" y="2.5" width="8" height="8" fill="#FF46C0"/> <rect x="4" y="3" width="7" height="7" stroke="white"/> </g> <defs> <filter id="filter0_d_106_14454" x="0.5" y="0.5" width="14" height="14" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"/> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/> <feOffset dy="1"/> <feGaussianBlur stdDeviation="1.5"/> <feComposite in2="hardAlpha" operator="out"/> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_106_14454"/> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_106_14454" result="shape"/> </filter> </defs> </svg>'

function renderCBVRow(ebv: number) {
  return renderDetailedRow(ebv, 'Canonically Bridged Value', CBVIcon)
}

function renderEBVRow(cbv: number) {
  return renderDetailedRow(cbv, 'Externally Bridged Value', EBVIcon)
}

function renderNMVRow(nmv: number) {
  return renderDetailedRow(nmv, 'Natively Minted Value', NMVIcon)
}

function renderDetailedRow(value: number, caption: string, iconSvg: string) {
  return `<div class="text-left"><div><span class="text-gray-50 text-sm">${caption}</span></div><div class="inline-flex items-center gap-1.5"><div>${iconSvg}</div>${renderCurrencyRow(
    value,
    'USD',
  )}</div></div>`
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
    source === 'L2' ? 'bg-red-300 rounded-full' : 'bg-blue-600'
  const circleClass = `inline-block mr-1 w-2 h-2 relative -top-px border-2 border-current ${customStyles}`
  const circleHTML = `<div class="${circleClass}"></div>`
  return `<div>${circleHTML} ${sourceHTML} avg. TPS: ${formattedHTML}</div>`
}

function renderNameRow(name: string) {
  return `<div class="max-w-[216px] mb-2 font-bold flex flex-wrap"><svg class="absolute mt-[2px] md:mt-1 dark:fill-green-500 dark:stroke-white fill-green-600 stroke-green-200" width="11" height="10" viewBox="0 0 11 10">
  <rect x="5.24268" y="0.0502174" width="7" height="7" rx="1.5" transform="rotate(45 5.24268 0.0502174)"/>
  </svg><span class='ml-4 text-left'>${name}</span></div>`
}

function renderDescriptionRow(description: string) {
  return `<div class="max-w-[216px] mb-1 text-left">${description}</div>`
}

function renderLearnMoreLink(text: string, href: string) {
  return renderToString(Link({ href, showArrow: true, children: text }))
}
