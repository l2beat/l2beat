import { formatCurrency } from '../../../utils/format'
import { getPercentageChange } from '../../../utils/utils'
import { makeQuery } from '../../query'
import { ChartRenderer, RenderParams } from '../renderer/ChartRenderer'
import { getActivityRenderParams } from './charts/getActivityRenderParams'
import { getDetailedTvlRenderParams } from './charts/getDetailedTvlRenderParams'
import { getTokenTvlRenderParams } from './charts/getTokenTvlRenderParams'
import { getTvlRenderParams } from './charts/getTvlRenderParams'
import { getScalingFactor } from './header/getScalingFactor'
import { ChartControlsState, ChartData } from './types'

interface Header {
  value: HTMLElement
  valueChange?: HTMLElement
  currency?: HTMLElement
}

type ChartState = 'empty' | 'loading' | null

export class ChartViewController {
  private state?: ChartControlsState
  private chartState: ChartState
  private readonly header?: Header

  constructor(
    private readonly chart: HTMLElement,
    private readonly chartRenderer: ChartRenderer,
  ) {
    const { $ } = makeQuery(chart)
    this.chartState = (chart.dataset.state ?? null) as ChartState
    const header = $.maybe('[data-role="chart-header"]')
    this.header = header ? this.getHeaderElements(header) : undefined
  }

  init(state: ChartControlsState) {
    this.state = state
    this.render()
  }

  configure(values: Partial<ChartControlsState>) {
    if (this.state) {
      this.state = { ...this.state, ...values }
      this.render()
    }
  }

  render() {
    if (!this.state?.data || this.chartState === 'empty') {
      return
    }

    this.setChartState(null)

    this.chartRenderer.render(this.getRenderParams())
    this.updateFeaturedValue()
  }

  showLoader() {
    this.setChartState('loading')
  }

  hideLoader() {
    if (this.chartState !== 'empty') {
      this.setChartState(null)
    }
  }

  setChartState(state: ChartState | null) {
    console.log(state)
    this.chartState = state
    if (!state) {
      delete this.chart.dataset.state
      return
    }

    this.chart.dataset.state = state
  }

  private getHeaderElements(header: HTMLElement) {
    const { $ } = makeQuery(header)
    const value = $('[data-role="chart-header-value"]')
    const valueChange = $.maybe('[data-role="chart-header-value-change"]')
    const currency = $.maybe('[data-role="chart-header-currency"]')

    return { value, valueChange, currency }
  }

  private updateFeaturedValue() {
    if (!this.header) {
      return
    }
    if (
      this.state?.data?.type === 'tvl' ||
      this.state?.data?.type === 'detailed-tvl'
    ) {
      const currency = this.state.useAltCurrency ? 'eth' : 'usd'
      const { tvl, tvlWeeklyChange } = getTvlWithChange(
        this.state.data,
        currency,
      )
      this.header.value.innerHTML = formatCurrency(tvl, currency)
      if (this.header.valueChange) {
        this.header.valueChange.innerHTML = getChangeHtml(tvlWeeklyChange)
      }
      if (this.header.currency) {
        this.header.currency.innerHTML = currency.toUpperCase()
      }
    }

    if (this.state?.data?.type === 'activity') {
      const scalingFactor = getScalingFactor(this.state.data.values)
      this.header.value.innerHTML = scalingFactor
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getRenderParams(): RenderParams<any> {
    switch (this.state?.data?.type) {
      case 'tvl':
        return getTvlRenderParams(this.state)
      case 'activity':
        return getActivityRenderParams(this.state)
      case 'token-tvl':
        return getTokenTvlRenderParams(this.state)
      case 'detailed-tvl':
        return getDetailedTvlRenderParams(this.state)
      default:
        throw new Error('Unknown data type')
    }
  }
}

function getChangeHtml(value: string) {
  const isMore = value.startsWith('+')
  const isLess = value.startsWith('-')

  const arrowDown = `
  <svg width="10" height="5" viewBox="0 0 10 5" fill="var(--text)" role="img" aria-label="Arrow down icon" alt-text="-" class="inline-block rotate-180 fill-red-300 absolute top-1/2 translate-y-[-50%]">
    <path d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z"></path>
  </svg>
  `
  const arrowUp = `
  <svg width="10" height="5" viewBox="0 0 10 5" fill="var(--text)" role="img" aria-label="Arrow up icon" alt-text="+" class="inline-block fill-green-300 dark:fill-green-450 absolute top-1/2 translate-y-[-50%]">
    <path th d="M4.85588 0.149769C4.93456 0.0680026 5.06544 0.0680024 5.14412 0.149769L9.00424 4.16132C9.1265 4.28839 9.03645 4.5 8.86012 4.5L1.13988 4.5C0.963547 4.5 0.873499 4.28839 0.995763 4.16132L4.85588 0.149769Z"></path>
  </svg>
  `
  return `
  <span class="relative ${isLess ? 'text-red-300' : ''}${
    isMore ? 'text-green-300 dark:text-green-450' : ''
  }">
    ${isMore ? arrowUp : ''}
    ${isLess ? arrowDown : ''}
    <span class="relative pl-3.5">${value.substring(1)}</span>
  </span>`
}

export function getTvlWithChange(
  chartType: Extract<ChartData, { type: 'tvl' | 'detailed-tvl' }>,
  currency: 'usd' | 'eth',
) {
  const dataIndex = getDataIndex(chartType, currency)
  const data = chartType.values.hourly.data
  const tvl = data.at(-1)?.[dataIndex] ?? 0
  const tvlSevenDaysAgo = data.at(0)?.[dataIndex] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}

function getDataIndex(
  chartType: Extract<ChartData, { type: 'tvl' | 'detailed-tvl' }>,
  currency: 'usd' | 'eth',
) {
  if (chartType.type === 'tvl') {
    return currency === 'usd' ? 1 : 2
  }

  return currency === 'usd' ? 1 : 5
}
