import { State } from './state/State'

interface PersistedSettings {
  isLogScale: boolean
}

const DEFAULT_SETTINGS = {
  isLogScale: false,
}

export function persistSettings(state: State) {
  const settings: PersistedSettings = {
    isLogScale: state.controls.isLogScale,
  }
  localStorage.setItem(
    chartStorageKey(state.controls.chartId),
    JSON.stringify(settings),
  )
}

export function getPersistedSettings(chartId: string) {
  return getPersitedSettings(chartId) ?? DEFAULT_SETTINGS
}

function getPersitedSettings(chartId: string) {
  const saved = localStorage.getItem(chartStorageKey(chartId))
  if (!saved) {
    return
  }
  return JSON.parse(saved) as PersistedSettings
}

function chartStorageKey(chartId: string) {
  return `${chartId}chartSettings`
}
