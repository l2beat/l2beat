import type {
  ProjectPrivacyCheckedApp,
  ProjectPrivacyReferenceApp,
} from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

/** The reference app and the other apps checked, with icons resolved. */
export interface PrivacyReferenceApp
  extends Omit<ProjectPrivacyReferenceApp, 'icon' | 'checkedApps'> {
  iconUrl: string
  checkedApps: PrivacyCheckedApp[]
}

export interface PrivacyCheckedApp
  extends Omit<ProjectPrivacyCheckedApp, 'icon'> {
  iconUrl: string
}

export function getPrivacyReferenceApp(
  { icon, checkedApps, ...app }: ProjectPrivacyReferenceApp,
  projectIconUrl: string,
): PrivacyReferenceApp {
  return {
    ...app,
    iconUrl: icon ? getIconUrl(icon) : projectIconUrl,
    checkedApps: (checkedApps ?? []).map(({ icon, ...checkedApp }) => ({
      ...checkedApp,
      iconUrl: icon ? getIconUrl(icon) : TOKEN_PLACEHOLDER_ICON_URL,
    })),
  }
}

function getIconUrl(icon: string) {
  return manifest.getUrl(`/icons/${icon}.png`)
}
