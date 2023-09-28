import { Milestone } from '@l2beat/config'

import {
  ActivityResponse,
  Milestones,
} from '../../components/chart/configure/state/State'
import { makeQuery } from '../query'
import activity from './activity.json'
import { ChartViewController } from './view-controller/ChartViewController'

export class ChartControls {
  constructor(
    readonly chart: HTMLElement,
    private readonly chartViewController: ChartViewController,
  ) {
    const milestones = this.getMilestones(chart)
    const values = this.setupControls(chart)

    chartViewController.init({
      data: {
        type: 'activity',
        values: activity as ActivityResponse,
      },
      timeRangeInDays: values.timeRangeInDays,
      useAltCurrency: values.useAltCurrency,
      useLogScale: values.useLogScale,
      showEthereumTransactions: values.showEthereumTransactions,
      tokenType: 'CBV',
      milestones,
    })
  }

  setupControls(chart: HTMLElement) {
    const { $, $$ } = makeQuery(chart)

    const scaleControls = $$<HTMLInputElement>(
      '[data-role="chart-scale-controls"] input',
    )
    // TODO: init with settings
    scaleControls.forEach((scaleControl) =>
      scaleControl.addEventListener('change', () => {
        this.chartViewController.configure({
          useLogScale: scaleControl.value === 'LOG',
        })
      }),
    )
    const useLogScale =
      scaleControls.find((control) => control.checked)?.value === 'LOG'

    const currencyControls = $$<HTMLInputElement>(
      '[data-role="chart-currency-controls"] input',
    )
    // TODO: init with settings
    currencyControls.forEach((currencyControl) => {
      currencyControl.addEventListener('change', () => {
        this.chartViewController.configure({
          useAltCurrency: currencyControl.value === 'ETH',
        })
      })
    })
    const useAltCurrency =
      scaleControls.find((control) => control.checked)?.value === 'ETH'

    const timeRangeControls = $$<HTMLInputElement>(
      '[data-role="chart-range-controls"] input',
    )
    // TODO: init with settings
    timeRangeControls.forEach((timeRangeControl) => {
      timeRangeControl.addEventListener('change', () => {
        this.chartViewController.configure({
          timeRangeInDays: this.toDays(timeRangeControl.value),
        })
      })
    })
    const timeRangeInDays = this.toDays(
      timeRangeControls.find((control) => control.checked)?.value ?? '1Y',
    )

    const showEthereumTransactionToggle = $.maybe<HTMLInputElement>(
      '[data-role="toggle-ethereum-activity"]',
    )

    showEthereumTransactionToggle?.addEventListener('change', () => {
      this.chartViewController.configure({
        showEthereumTransactions: !!showEthereumTransactionToggle.checked,
      })
    })

    const showEthereumTransactions = !!showEthereumTransactionToggle?.checked

    return {
      useLogScale,
      useAltCurrency,
      timeRangeInDays,
      showEthereumTransactions,
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
