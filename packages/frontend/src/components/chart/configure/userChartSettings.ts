import { State } from './state/State'

interface PersistableState {
  controls: Pick<
    State['controls'],
    'pagePathname' | 'isLogScale' | 'days' | 'currency' | 'showEthereum'
  >
}

type UserChartSettings = Omit<PersistableState['controls'], 'pagePathname'>

type SerializedChartSettings = Partial<Omit<UserChartSettings, 'days'>> & {
  days?: string
}

export function persistUserChartSettings(state: PersistableState) {
  const chartSettings: SerializedChartSettings = {
    isLogScale: state.controls.isLogScale,
    days: String(state.controls.days),
    currency: state.controls.currency,
    showEthereum: state.controls.showEthereum,
  }

  localStorage.setItem(
    userChartSettingsKey(state.controls.pagePathname),
    JSON.stringify(chartSettings),
  )
}

export function getUserChartSettings(pagePathname: string): UserChartSettings {
  const raw = localStorage.getItem(userChartSettingsKey(pagePathname))
  const serialized: SerializedChartSettings = raw
    ? (JSON.parse(raw) as SerializedChartSettings)
    : {}

  const userChartSettings: Partial<UserChartSettings> = {
    ...('isLogScale' in serialized
      ? { isLogScale: serialized.isLogScale }
      : {}),
    ...('days' in serialized ? { days: Number(serialized.days) } : {}),
    ...('currency' in serialized ? { currency: serialized.currency } : {}),
    ...('showEthereum' in serialized
      ? { showEthereum: serialized.showEthereum }
      : {}),
  }

  return { ...DEFAULT_CHART_SETTINGS, ...userChartSettings }
}

function userChartSettingsKey(pagePathname: string) {
  return `${pagePathname}chartSettings`
}

const DEFAULT_CHART_SETTINGS: UserChartSettings = {
  isLogScale: false,
  days: 365,
  currency: 'usd',
  showEthereum: true,
}
