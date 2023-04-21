import { configureDesktopSectionNavigation } from './configureDesktopSectionNavigation'
import { configureMobileSectionNavigation } from './configureMobileSectionNavigation'

export function configureSectionNavigation() {
  configureDesktopSectionNavigation()
  configureMobileSectionNavigation()
}
