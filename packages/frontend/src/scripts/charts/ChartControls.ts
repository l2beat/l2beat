import { Milestone } from '@l2beat/config'

import {
  AggregateDetailedTvlResponse,
  Milestones,
} from '../../components/chart/configure/state/State'
import { makeQuery } from '../query'
import { ChartSettings, ChartSettingsManager } from './ChartSettings'
import detailedTvl from './detailed-tvl.json'
import { ChartViewController } from './view-controller/ChartViewController'

export class ChartControls {
  constructor(
    readonly chart: HTMLElement,
    private readonly chartSetttings: ChartSettingsManager,
    private readonly chartViewController: ChartViewController,
  ) {
    const milestones = this.getMilestones(chart)
    //TODO: Add chart id
    const settings = this.chartSetttings.for('CHART ID')
    this.setupControls(chart, settings)

    chartViewController.init({
      data: {
        type: 'detailed-tvl',
        values: detailedTvl as AggregateDetailedTvlResponse,
      },
      timeRangeInDays: settings.getTimeRange(),
      useAltCurrency: settings.getUseAltCurrency(),
      useLogScale: settings.getUseLogScale(),
      showEthereumTransactions: settings.getShowEthereumTransactions(),
      tokenType: 'CBV',
      milestones,
    })
  }

  setupControls(chart: HTMLElement, settings: ChartSettings) {
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

    const tokenControls = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '[data-role="chart-token-controls"] input',
      ),
    )

    tokenControls.forEach((tokenControl) => {
      tokenControl.addEventListener('change', () => {
        const tokenType = tokenControl.dataset.assetType
        if (!tokenType) {
          throw new Error('Invalid token type')
        }
        this.chartViewController.configure({
          tokenType: tokenType as 'CBV' | 'EBV' | 'NMV',
        })
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
