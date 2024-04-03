import { LocalStorage } from '../local-storage/LocalStorage'
import { SavedChartSettings, SavedChartState } from '../local-storage/types'
import { getChartType } from './getChartType'
import { ChartType } from './types'
import { ChartUnit } from './view-controller/types'

export type ChartSettings = ReturnType<
  typeof ChartSettingsManager.prototype.for
>

interface ChartSettingsManagerOptions {
  disableLocalStorage?: boolean
}

export class ChartSettingsManager {
  private readonly defaultSettings: SavedChartSettings
  private readonly state: SavedChartState

  constructor(chart: HTMLElement, opts?: ChartSettingsManagerOptions) {
    const chartType = getChartType(chart)
    this.defaultSettings = this.getDefaultSettings(chartType)

    this.state = opts?.disableLocalStorage
      ? {}
      : LocalStorage.getItem('chart-settings') ?? {}
  }

  for(settingsId: string) {
    return {
      getUseLogScale: () => {
        return this.get(settingsId).useLogScale
      },
      setUseLogScale: (value: boolean) => {
        this.update(settingsId, { useLogScale: value })
      },
      getUnit: () => {
        return this.get(settingsId).unit
      },
      setUnit: (value: ChartUnit) => {
        this.update(settingsId, { unit: value })
      },
      getTimeRange: () => {
        const value = this.get(settingsId).timeRangeInDays
        return value === -1 ? Infinity : value
      },
      setTimeRange: (value: number) => {
        if (value === Infinity) {
          value = -1
        }
        this.update(settingsId, { timeRangeInDays: value })
      },
      getShowEthereumTransactions: () => {
        return this.get(settingsId).showEthereumTransactions
      },
      setShowEthereumTransactions: (value: boolean) => {
        this.update(settingsId, { showEthereumTransactions: value })
      },
    }
  }

  private get(chartId: string) {
    return this.state[chartId] ?? { ...this.defaultSettings }
  }

  private update(chartId: string, values: Partial<SavedChartSettings>) {
    const settings = this.state[chartId] ?? { ...this.defaultSettings }
    this.state[chartId] = { ...settings, ...values }
    LocalStorage.setItem('chart-settings', this.state)
  }

  private getDefaultSettings(chartType: ChartType): SavedChartSettings {
    switch (chartType.type) {
      case 'scaling-tvl':
      case 'scaling-detailed-tvl':
      case 'scaling-activity':
      case 'bridges-tvl':
      case 'project-tvl':
      case 'project-token-tvl':
      case 'project-detailed-tvl':
      case 'project-activity':
      case 'storybook-fake-tvl':
      case 'storybook-fake-activity':
      case 'storybook-fake-detailed-tvl':
        return {
          useLogScale: false,
          unit: 'USD',
          timeRangeInDays: 365,
          showEthereumTransactions: true,
        }
      case 'scaling-costs':
      case 'project-costs':
        return {
          useLogScale: false,
          unit: 'USD',
          timeRangeInDays: 7,
          showEthereumTransactions: true,
        }
    }
  }
}
