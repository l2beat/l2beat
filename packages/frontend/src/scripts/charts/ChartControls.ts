import { Milestone } from '@l2beat/config'
import isEmpty from 'lodash/isEmpty'

import { getFilteredSlugs } from '../configureProjectFilters'
import { getRichSelectValue } from '../configureRichSelect'
import { makeQuery } from '../query'
import { ChartSettings, ChartSettingsManager } from './ChartSettings'
import { ChartDataController } from './data-controller/ChartDataController'
import { ChartType, Milestones, TokenInfo } from './types'
import { ChartViewController } from './view-controller/ChartViewController'
import { ChartUnit } from './view-controller/types'

export interface ChartControlsCallbacks {
  onTimeRangeChange?: (control: HTMLInputElement) => void
  onUnitChange?: (control: HTMLInputElement) => void
}

export class ChartControls {
  private chartType?: ChartType
  private projectSlug?: string
  private isDetailedTvl?: boolean

  constructor(
    private readonly chart: HTMLElement,
    private readonly chartSettings: ChartSettingsManager,
    private readonly chartViewController: ChartViewController,
    private readonly chartDataController: ChartDataController,
    private readonly callbacks?: ChartControlsCallbacks,
  ) {}

  init() {
    const milestones = this.getMilestones(this.chart)
    const settings = this.chartSettings.for(
      this.chart.dataset.settingsId ?? 'unknown',
    )

    this.chartViewController.init({
      data: undefined,
      timeRangeInDays: settings.getTimeRange(),
      unit: settings.getUnit(),
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
    const query = makeQuery(chart)

    this.configureScaleControls(query, settings)
    const unitControls = this.configureUnitControls(
      query,
      settings,
      this.callbacks?.onUnitChange,
    )
    this.configureTimeRangeControls(
      query,
      settings,
      this.callbacks?.onTimeRangeChange,
    )
    this.configureEthereumTxsToggle(query, settings)
    this.configureTokenSelect(query, unitControls)
    this.configureCanonicalToggle(query)
    this.configureProjectFilters()
    this.configureRefetchButton(query)
  }

  private configureScaleControls(
    query: ReturnType<typeof makeQuery>,
    settings: ChartSettings,
  ) {
    const { $$ } = query
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
  }

  private configureUnitControls(
    query: ReturnType<typeof makeQuery>,
    settings: ChartSettings,
    callback?: ChartControlsCallbacks['onUnitChange'],
  ) {
    const { $$ } = query
    const unitControls = $$<HTMLInputElement>(
      '[data-role="chart-unit-controls"] input',
    )
    unitControls.forEach((unitControl) => {
      const isChecked = settings.getUnit() === unitControl.value

      if (isChecked) {
        unitControl.checked = true
        callback?.(unitControl)
      }

      unitControl.addEventListener('change', () => {
        if (this.chartType?.type === 'project-token-tvl' && this.projectSlug) {
          this.updateChartType({
            type: this.isDetailedTvl ? 'project-detailed-tvl' : 'project-tvl',
            slug: this.projectSlug,
          })
        }
        const unit = unitControl.value as ChartUnit
        settings.setUnit(unit)
        this.chartViewController.configure({ unit })
        callback?.(unitControl)
      })
    })

    return unitControls
  }

  private configureTimeRangeControls(
    query: ReturnType<typeof makeQuery>,
    settings: ChartSettings,
    callback?: ChartControlsCallbacks['onTimeRangeChange'],
  ) {
    const { $$ } = query
    const timeRangeControls = $$<HTMLInputElement>(
      '[data-role="chart-range-controls"] input',
    )

    timeRangeControls.forEach((timeRangeControl) => {
      const isChecked =
        settings.getTimeRange() === this.toDays(timeRangeControl.value)

      if (isChecked) {
        timeRangeControl.checked = true
        callback?.(timeRangeControl)
      }

      timeRangeControl.addEventListener('change', () => {
        const timeRangeInDays = this.toDays(timeRangeControl.value)
        settings.setTimeRange(timeRangeInDays)
        this.chartViewController.configure({ timeRangeInDays })
        callback?.(timeRangeControl)
      })
    })
  }

  private configureEthereumTxsToggle(
    query: ReturnType<typeof makeQuery>,
    settings: ChartSettings,
  ) {
    const { $ } = query
    const showEthereumTransactionToggle = $.maybe<HTMLInputElement>(
      '[data-role="toggle-ethereum-activity"]',
    )
    if (!showEthereumTransactionToggle) return

    showEthereumTransactionToggle.checked =
      settings.getShowEthereumTransactions()
    showEthereumTransactionToggle.addEventListener('change', () => {
      const showEthereumTransactions = !!showEthereumTransactionToggle.checked
      settings.setShowEthereumTransactions(showEthereumTransactions)
      this.chartViewController.configure({ showEthereumTransactions })
    })
  }

  private configureTokenSelect(
    query: ReturnType<typeof makeQuery>,
    unitControls: HTMLInputElement[],
  ) {
    const { $ } = query

    const tokenSelect = $.maybe('[data-role=rich-select]#token-select')
    tokenSelect?.addEventListener('change', () => {
      const value = getRichSelectValue(tokenSelect)
      if (!value) {
        if (this.projectSlug) {
          this.updateChartType({
            type: this.isDetailedTvl ? 'project-detailed-tvl' : 'project-tvl',
            slug: this.projectSlug,
          })
        }
        unitControls.forEach((c) => (c.disabled = false))
        return
      }
      unitControls.forEach((c) => (c.disabled = true))

      const tokenInfo = TokenInfo.parse(JSON.parse(value))
      this.updateChartType({
        type: 'project-token-tvl',
        info: tokenInfo,
      })
    })
  }

  private configureCanonicalToggle(query: ReturnType<typeof makeQuery>) {
    const { $ } = query
    const canonicalToggle = $.maybe<HTMLInputElement>(
      '[data-role="chart-combined"]',
    )

    canonicalToggle?.addEventListener('change', () => {
      const includeCanonical = !!canonicalToggle.checked
      this.updateChartType({ type: 'bridges-tvl', includeCanonical })
    })
  }

  private configureProjectFilters() {
    const { $ } = makeQuery(document.body)
    const projectFilters = $.maybe('#project-filters')

    projectFilters?.addEventListener('change', () => {
      if (
        this.chartType?.type !== 'scaling-tvl' &&
        this.chartType?.type !== 'scaling-detailed-tvl' &&
        this.chartType?.type !== 'scaling-activity'
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
  }

  private configureRefetchButton(query: ReturnType<typeof makeQuery>) {
    const { $ } = query
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
