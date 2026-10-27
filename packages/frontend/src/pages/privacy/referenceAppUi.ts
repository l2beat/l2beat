import type { PrivacyReferenceApp } from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import {
  PRIVACY_METHODOLOGY_PATH,
  PRIVACY_REFERENCE_APP_ANCHOR,
} from './methodology/paths'

export const REFERENCE_APP = {
  title: 'Reference app',
  tooltip: 'The most private app we checked. The privacy ratings assume it.',
  methodologyHref: `${PRIVACY_METHODOLOGY_PATH}#${PRIVACY_REFERENCE_APP_ANCHOR}`,
} as const

/** The app's name with the release the review covers. */
export function getReferenceAppLabel(app: PrivacyReferenceApp) {
  return app.version ? `${app.name} v${app.version}` : app.name
}

/** Apps the review compared, the reference one included. */
export function getCheckedAppsCount(app: PrivacyReferenceApp) {
  return app.alternatives.length > 0 ? app.alternatives.length + 1 : undefined
}
