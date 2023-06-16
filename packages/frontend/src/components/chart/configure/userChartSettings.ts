import { State } from './state/State'

interface UserChartSettings {
  isLogScale?: boolean
}

const DEFAULT_CHART_SETTINGS = {
  isLogScale: false,
}

export function persistUserChartSettings(state: State) {
  const chartSettings: UserChartSettings = {
    isLogScale: state.controls.isLogScale,
  }
  localStorage.setItem(
    userChartSettingsKey(state.controls.chartId),
    JSON.stringify(chartSettings),
  )
}

export function getUserChartSettings(chartId: string) {
  const raw = localStorage.getItem(userChartSettingsKey(chartId))
  const userChartSettings = raw ? (JSON.parse(raw) as UserChartSettings) : {}

  return { ...DEFAULT_CHART_SETTINGS, ...userChartSettings }
}

function userChartSettingsKey(chartId: string) {
  return `${chartId}chartSettings`
}
