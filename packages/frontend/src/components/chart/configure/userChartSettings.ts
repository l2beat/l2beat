import { State } from './state/State'

interface UserChartSettings {
  isLogScale?: boolean
  days?: number
}
interface SerializedChartSettings extends Omit<UserChartSettings, 'days'> {
  days?: string
}

const DEFAULT_CHART_SETTINGS = {
  isLogScale: false,
  days: 365,
}

export function persistUserChartSettings(state: State) {
  const chartSettings: SerializedChartSettings = {
    isLogScale: state.controls.isLogScale,
    days: String(state.controls.days),
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
    ...(serialized.isLogScale ? { isLogScale: serialized.isLogScale } : {}),
    ...(serialized.days ? { days: Number(serialized.days) } : {}),
  }

  return { ...DEFAULT_CHART_SETTINGS, ...userChartSettings }
}

function userChartSettingsKey(chartId: string) {
  return `${chartId}chartSettings`
}
