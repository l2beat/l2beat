import { Milestone } from '@l2beat/config'
import isEmpty from 'lodash/isEmpty'

import { getFilteredSlugs } from '../configureProjectFilters'
import { getRichSelectValue } from '../configureRichSelect'
import { makeQuery } from '../query'
import { setQueryParams } from '../utils/setQueryParams'
import { ChartSettings, ChartSettingsManager } from './ChartSettings'
import { ChartDataController } from './data-controller/ChartDataController'
import { ChartType, Milestones, TokenInfo } from './types'
import { ChartViewController } from './view-controller/ChartViewController'

export class ChartControls {
  private chartType?: ChartType
  private projectSlug?: string
  private isDetailedTvl?: boolean
  private readonly urlParams = new URLSearchParams(window.location.search)

  constructor(
    private readonly chart: HTMLElement,
    private readonly chartSettings: ChartSettingsManager,
    private readonly chartViewController: ChartViewController,
    private readonly chartDataController: ChartDataController,
  ) {}

  init() {
    const milestones = this.getMilestones(this.chart)
    const settings = this.chartSettings.for(
      this.chart.dataset.settingsId ?? 'unknown',
    )

    this.chartViewController.init({
      data: undefined,
      timeRangeInDays: settings.getTimeRange(),
      useAltCurrency: settings.getUseAltCurrency(),
      useLogScale: settings.getUseLogScale(),
      showEthereumTransactions: settings.getShowEthereumTransactions(),
      milestones,
    })

    const chartType = this.getChartType(this.chart)
    this.updateChartType(chartType)

    this.setupControls(this.chart, settings)
  }

  private updateChartType(chartType: ChartType) {
    this.chartType = chartType
    if ('slug' in this.chartType) {
      this.projectSlug = this.chartType.slug
    }
    if (this.chartType.type === 'project-detailed-tvl') {
      this.isDetailedTvl = true
    }
    this.chartDataController.setChartType(chartType)
  }

  private setupControls(chart: HTMLElement, settings: ChartSettings) {
    const { $, $$ } = makeQuery(chart)
    const tokenSelect = $.maybe('.RichSelect#token-select')
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
        if (this.chartType?.type === 'project-token-tvl' && this.projectSlug) {
          this.updateChartType({
            type: this.isDetailedTvl ? 'project-detailed-tvl' : 'project-tvl',
            slug: this.projectSlug,
          })
        }

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

    const selectedChart = this.urlParams.get('selectedChart')
    chartTypeControls.forEach((chartTypeControl) => {
      chartTypeControl.addEventListener('change', () => {
        const type = chartTypeControl.value as
          | 'tvl'
          | 'detailedTvl'
          | 'activity'

        if (this.projectSlug) {
          const selectValue = tokenSelect && getRichSelectValue(tokenSelect)
          const chartType: ChartType =
            (type === 'tvl' || type === 'detailedTvl') && selectValue
              ? {
                  type: 'project-token-tvl',
                  info: TokenInfo.parse(JSON.parse(selectValue)),
                }
              : type === 'tvl'
              ? { type: 'project-tvl', slug: this.projectSlug }
              : type === 'detailedTvl'
              ? { type: 'project-detailed-tvl', slug: this.projectSlug }
              : { type: 'project-activity', slug: this.projectSlug }

          this.updateChartType(chartType)
        }

        this.urlParams.set('selectedChart', type)
        setQueryParams(this.urlParams)

        $$('[data-tvl-only]').forEach((element) =>
          element.classList.toggle('hidden', type === 'activity'),
        )

        $$('[data-activity-only]').forEach((element) =>
          element.classList.toggle('hidden', type !== 'activity'),
        )
      })

      if (selectedChart === chartTypeControl.value) {
        chartTypeControl.checked = true
        chartTypeControl.dispatchEvent(new Event('change'))
      }
    })

    tokenSelect?.addEventListener('change', () => {
      const value = getRichSelectValue(tokenSelect)
      if (!value) {
        if (this.projectSlug) {
          this.updateChartType({
            type: this.isDetailedTvl ? 'project-detailed-tvl' : 'project-tvl',
            slug: this.projectSlug,
          })
        }
        currencyControls.forEach((c) => (c.disabled = false))
        return
      }
      currencyControls.forEach((c) => (c.disabled = true))

      const tokenInfo = TokenInfo.parse(JSON.parse(value))
      this.updateChartType({
        type: 'project-token-tvl',
        info: tokenInfo,
      })
    })

    const canonicalToggle = document.querySelector<HTMLInputElement>(
      '[data-role="chart-combined"]',
    )
    if (canonicalToggle) {
      canonicalToggle.addEventListener('change', () => {
        const includeCanonical = !!canonicalToggle.checked
        this.updateChartType({ type: 'bridges-tvl', includeCanonical })
      })
    }

    const projectFilters =
      document.querySelector<HTMLElement>('#project-filters')
    projectFilters?.addEventListener('change', () => {
      if (
        this.chartType?.type !== 'layer2-tvl' &&
        this.chartType?.type !== 'layer2-detailed-tvl' &&
        this.chartType?.type !== 'layer2-activity'
      ) {
        return
      }
      const filteredSlugs = getFilteredSlugs(projectFilters)
      if (filteredSlugs !== undefined && isEmpty(filteredSlugs)) {
        this.chartDataController.showEmptyChart()
        return
      }
      this.chartDataController.setChartType({
        ...this.chartType,
        filteredSlugs,
      })
    })

    const refetchButton = $('[data-role="chart-refetch-button"]')
    refetchButton.addEventListener('click', () => {
      this.chartDataController.refetch()
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
