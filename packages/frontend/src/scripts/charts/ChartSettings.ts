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

  for(settingsId: string) {
    return {
      getUseLogScale: () => {
        return this.get(settingsId).useLogScale
      },
      setUseLogScale: (value: boolean) => {
        this.update(settingsId, { useLogScale: value })
      },
      getUseAltCurrency: () => {
        return this.get(settingsId).useAltCurrency
      },
      setUseAltCurrency: (value: boolean) => {
        this.update(settingsId, { useAltCurrency: value })
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
    return this.state[chartId] ?? { ...DEFAULT_VALUES }
  }

  private update(chartId: string, values: Partial<SavedChartSettings>) {
    const settings = this.state[chartId] ?? { ...DEFAULT_VALUES }
    this.state[chartId] = { ...settings, ...values }
    LocalStorage.setItem('chart-settings', this.state)
  }
}
