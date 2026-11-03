import { useEffect, useSyncExternalStore } from 'react'
import {
  type ThemeSetting,
  useGlobalSettingsStore,
} from './apps/discovery/store/global-settings-store'

export type Theme = 'light' | 'dark'

const PREFERS_LIGHT_QUERY = '(prefers-color-scheme: light)'

export function resolveTheme(
  setting: ThemeSetting,
  systemPrefersLight: boolean,
): Theme {
  if (setting === 'system') {
    return systemPrefersLight ? 'light' : 'dark'
  }
  return setting
}

export function useTheme(): Theme {
  const setting = useGlobalSettingsStore((s) => s.theme)
  const systemPrefersLight = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersLight,
  )
  return resolveTheme(setting, systemPrefersLight)
}

// index.html applies the saved theme before the first paint; this keeps the
// page in sync once the app runs.
export function useApplyTheme() {
  const theme = useTheme()
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  const query = window.matchMedia(PREFERS_LIGHT_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getSystemPrefersLight(): boolean {
  return window.matchMedia(PREFERS_LIGHT_QUERY).matches
}
