import { Milestone } from '@l2beat/config'

import { makeQuery } from '../query'
import { ChartDataController, ChartType } from './ChartDataController'
import { ChartSettings, ChartSettingsManager } from './ChartSettings'
import { Milestones } from './types'
import { ChartViewController } from './view-controller/ChartViewController'

export class ChartControls {
  private chartType?: ChartType

  constructor(
    private readonly chart: HTMLElement,
    private readonly chartSettings: ChartSettingsManager,
    private readonly chartViewController: ChartViewController,
    private readonly chartDataController: ChartDataController,
  ) {}

  init() {
    const milestones = this.getMilestones(this.chart)
    this.chartType = this.getChartType(this.chart)
    const settings = this.chartSettings.for(
      this.chart.dataset.settingsId ?? 'unknown',
    )
    this.setupControls(this.chart, settings)

    this.chartViewController.init({
      data: undefined,
      timeRangeInDays: settings.getTimeRange(),
      useAltCurrency: settings.getUseAltCurrency(),
      useLogScale: settings.getUseLogScale(),
      showEthereumTransactions: settings.getShowEthereumTransactions(),
      milestones,
    })
    this.chartDataController.setChartType(this.chartType)
  }

  private setupControls(chart: HTMLElement, settings: ChartSettings) {
    const { $, $$ } = makeQuery(chart)

    const scaleControls = $$<HTMLInputElement>(
      '[data-role="chart-scale-controls"] input',
    )
    scaleControls.forEach((scaleControl) => {
      scaleControl.checked =
        settings.getUseLogScale() === (scaleControl.value === 'LOG')
      scaleControl.addEventListener('change', () => {
        const useLogScale = scaleControl.value === 'LOG'
        settings.setUseLogScale(useLogScale)
        this.chartViewController.configure({ useLogScale })
      })
    })

    const currencyControls = $$<HTMLInputElement>(
      '[data-role="chart-currency-controls"] input',
    )
    currencyControls.forEach((currencyControl) => {
      currencyControl.checked =
        settings.getUseAltCurrency() === (currencyControl.value === 'ETH')
      currencyControl.addEventListener('change', () => {
        const useAltCurrency = currencyControl.value === 'ETH'
        settings.setUseAltCurrency(useAltCurrency)
        this.chartViewController.configure({ useAltCurrency })
      })
    })

    const timeRangeControls = $$<HTMLInputElement>(
      '[data-role="chart-range-controls"] input',
    )
    timeRangeControls.forEach((timeRangeControl) => {
      timeRangeControl.checked =
        settings.getTimeRange() === this.toDays(timeRangeControl.value)
      timeRangeControl.addEventListener('change', () => {
        const timeRangeInDays = this.toDays(timeRangeControl.value)
        settings.setTimeRange(timeRangeInDays)
        this.chartViewController.configure({ timeRangeInDays })
      })
    })

    const showEthereumTransactionToggle = $.maybe<HTMLInputElement>(
      '[data-role="toggle-ethereum-activity"]',
    )
    if (showEthereumTransactionToggle) {
      showEthereumTransactionToggle.checked =
        settings.getShowEthereumTransactions()
      showEthereumTransactionToggle.addEventListener('change', () => {
        const showEthereumTransactions = !!showEthereumTransactionToggle.checked
        settings.setShowEthereumTransactions(showEthereumTransactions)
        this.chartViewController.configure({ showEthereumTransactions })
      })
    }

    const chartTypeControls = $$<HTMLInputElement>(
      '[data-role="radio-chart-type-controls"] input',
    )
    chartTypeControls.forEach((chartTypeControl) => {
      chartTypeControl.addEventListener('change', () => {
        const type = chartTypeControl.value as
          | 'tvl'
          | 'detailedTvl'
          | 'activity'

        const slug =
          this.chartType && 'slug' in this.chartType && this.chartType.slug

        if (slug) {
          this.chartDataController.setChartType(
            type === 'tvl'
              ? { type: 'project-tvl', slug }
              : type === 'detailedTvl'
              ? { type: 'project-detailed-tvl', slug }
              : { type: 'project-activity', slug },
          )
        }

        // TODO: show / hide currency, token and ethereum transaction controls
      })
    })
  }

  private getMilestones(chart: HTMLElement) {
    const milestones = chart.dataset.milestones
      ? Milestones.parse(JSON.parse(chart.dataset.milestones))
      : []
    const result: Record<number, Milestone> = {}
    for (const milestone of milestones) {
      const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
      result[timestamp] = milestone
    }
    return result
  }

  private getChartType(chart: HTMLElement) {
    return ChartType.parse(JSON.parse(chart.dataset.initialType ?? ''))
  }

  private toDays(value: string) {
    if (value.endsWith('D')) {
      return parseInt(value.slice(0, -1))
    } else if (value.endsWith('Y')) {
      return parseInt(value.slice(0, -1)) * 365
    } else {
      return Infinity
    }
  }
}
