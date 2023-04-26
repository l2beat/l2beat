import { configureDesktopProjectNavigation } from './configureDesktopProjectNavigation'
import { configureMobileProjectNavigation } from './configureMobileProjectNavigation'

export function configureProjectNavigation() {
  configureDesktopProjectNavigation()
  configureMobileProjectNavigation()
}
