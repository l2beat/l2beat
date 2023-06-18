import { State } from './state/State'

type UserChartSettings = Partial<
  Pick<State['controls'], 'isLogScale' | 'days' | 'currency'>
>

interface SerializedChartSettings extends Omit<UserChartSettings, 'days'> {
  days?: string
}

export function persistUserChartSettings(state: State) {
  const chartSettings: SerializedChartSettings = {
    isLogScale: state.controls.isLogScale,
    days: String(state.controls.days),
    currency: state.controls.currency,
  }

  localStorage.setItem(
    userChartSettingsKey(state.controls.pagePathname),
    JSON.stringify(chartSettings),
  )
}

export function getUserChartSettings(pagePathname: string) {
  const raw = localStorage.getItem(userChartSettingsKey(pagePathname))
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

  return userChartSettings
}

function userChartSettingsKey(pagePathname: string) {
  return `${pagePathname}chartSettings`
}
