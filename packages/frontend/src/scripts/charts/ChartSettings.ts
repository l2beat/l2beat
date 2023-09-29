import { LocalStorage } from '../local-storage/LocalStorage'
import { SavedChartSettings, SavedChartState } from '../local-storage/types'

export type ChartSettings = ReturnType<
  typeof ChartSettingsManager.prototype.for
>

const DEFAULT_VALUES: SavedChartSettings = {
  useLogScale: false,
  useAltCurrency: false,
  timeRangeInDays: 365,
  showEthereumTransactions: true,
}

export class ChartSettingsManager {
  private readonly state: SavedChartState

  constructor() {
    this.state = LocalStorage.getItem('chart-settings') ?? {}
  }

  for(chartId: string) {
    return {
      getUseLogScale: () => {
        return this.get(chartId).useLogScale
      },
      setUseLogScale: (value: boolean) => {
        this.update(chartId, { useLogScale: value })
      },
      getUseAltCurrency: () => {
        return this.get(chartId).useAltCurrency
      },
      setUseAltCurrency: (value: boolean) => {
        this.update(chartId, { useAltCurrency: value })
      },
      getTimeRange: () => {
        const value = this.get(chartId).timeRangeInDays
        return value === -1 ? Infinity : value
      },
      setTimeRange: (value: number) => {
        if (value === Infinity) {
          value = -1
        }
        this.update(chartId, { timeRangeInDays: value })
      },
      getShowEthereumTransactions: () => {
        return this.get(chartId).showEthereumTransactions
      },
      setShowEthereumTransactions: (value: boolean) => {
        this.update(chartId, { showEthereumTransactions: value })
      },
    }
  }

  private get(chartId: string) {
    return this.state[chartId] ?? { ...DEFAULT_VALUES }
  }

  private update(chartId: string, values: Partial<SavedChartSettings>) {
    const settings = this.state[chartId] ?? { ...DEFAULT_VALUES }
    this.state[chartId] = { ...settings, ...values }
    LocalStorage.setItem('chart-settings', this.state)
  }
}
