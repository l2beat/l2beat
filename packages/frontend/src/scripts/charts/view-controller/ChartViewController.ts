import { formatCurrency } from '../../../utils/format'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWithChange'
import { makeQuery } from '../../query'
import { ChartRenderer, RenderParams } from '../renderer/ChartRenderer'
import { getActivityRenderParams } from './charts/getActivityRenderParams'
import { getDetailedTvlRenderParams } from './charts/getDetailedTvlRenderParams'
import { getTokenTvlRenderParams } from './charts/getTokenTvlRenderParams'
import { getTvlRenderParams } from './charts/getTvlRenderParams'
import { getChangeHtml } from './header/getChangeHtml'
import { getScalingFactor } from './header/getScalingFactor'
import { ChartControlsState } from './types'

interface Header {
  value: HTMLElement
  valueChange?: HTMLElement
  currency?: HTMLElement
}

type ChartState = 'empty' | 'loading' | 'error' | null

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

    this.chartRenderer.render(this.getRenderParams())
    this.updateFeaturedValue()
  }

  showLoader() {
    this.setChartState('loading')
  }

  hideLoader() {
    this.setChartState(null)
  }

  showEmptyState() {
    this.setChartState('empty')
  }

  showErrorState() {
    this.setChartState('error')
  }

  private setChartState(state: ChartState | null) {
    this.chartState = state
    switch (state) {
      case null:
        delete this.chart.dataset.state
        delete this.chart.dataset.interactivityDisabled
        break
      case 'empty':
      case 'error':
        this.chart.dataset.state = state
        this.chart.dataset.interactivityDisabled = 'true'
        break
      case 'loading':
        this.chart.dataset.state = state
        delete this.chart.dataset.interactivityDisabled
        break
      default:
        throw new Error('Unknown chart state')
    }
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
        this.state.data.values,
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
