import { State } from './state/State'

type UserChartSettings = Partial<
  Pick<State['controls'], 'isLogScale' | 'days' | 'currency'>
>

interface SerializedChartSettings extends Omit<UserChartSettings, 'days'> {
  days?: string
}

const DEFAULT_CHART_SETTINGS = {
  isLogScale: false,
  days: 365,
  currency: 'usd',
} as const

export function persistUserChartSettings(state: State) {
  const chartSettings: SerializedChartSettings = {
    isLogScale: state.controls.isLogScale,
    days: String(state.controls.days),
    currency: state.controls.currency,
  }

  localStorage.setItem(
    userChartSettingsKey(state.controls.chartId),
    JSON.stringify(chartSettings),
  )
}

export function getUserChartSettings(chartId: string) {
  const raw = localStorage.getItem(userChartSettingsKey(chartId))
  const serialized: SerializedChartSettings = raw
    ? (JSON.parse(raw) as SerializedChartSettings)
    : {}

  const userChartSettings: UserChartSettings = {
    ...('isLogScale' in serialized
      ? { isLogScale: serialized.isLogScale }
      : {}),
    ...('days' in serialized ? { days: Number(serialized.days) } : {}),
    ...('currency' in serialized ? { currency: serialized.currency } : {}),
  }

  return { ...DEFAULT_CHART_SETTINGS, ...userChartSettings }
}

function userChartSettingsKey(chartId: string) {
  return `${chartId}chartSettings`
}
