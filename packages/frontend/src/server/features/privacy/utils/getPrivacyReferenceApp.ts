import type {
  ProjectPrivacyClientAlternative,
  ProjectPrivacyReferenceClient,
} from '@l2beat/config'
import { manifest } from '~/utils/Manifest'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'

/** The reference app and the other apps checked, with icons resolved. */
export interface PrivacyReferenceApp
  extends Omit<ProjectPrivacyReferenceClient, 'icon' | 'alternatives'> {
  iconUrl: string
  alternatives: PrivacyCheckedApp[]
}

export interface PrivacyCheckedApp
  extends Omit<ProjectPrivacyClientAlternative, 'icon'> {
  iconUrl: string
}

export function getPrivacyReferenceApp(
  { icon, alternatives, ...app }: ProjectPrivacyReferenceClient,
  projectIconUrl: string,
): PrivacyReferenceApp {
  return {
    ...app,
    iconUrl: icon ? getIconUrl(icon) : projectIconUrl,
    alternatives: (alternatives ?? []).map(({ icon, ...alternative }) => ({
      ...alternative,
      iconUrl: icon ? getIconUrl(icon) : TOKEN_PLACEHOLDER_ICON_URL,
    })),
  }
}

function getIconUrl(icon: string) {
  return manifest.getUrl(`/icons/${icon}.png`)
}
