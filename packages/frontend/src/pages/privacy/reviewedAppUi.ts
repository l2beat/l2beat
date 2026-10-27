import type { ProjectPrivacyReferenceClient } from '@l2beat/config'

export const REVIEWED_APP = {
  title: 'Reviewed app',
  tooltip: 'The app the privacy ratings assume.',
} as const

/** The app's name with the release the review covers. */
export function getReviewedAppLabel(app: ProjectPrivacyReferenceClient) {
  return app.version ? `${app.name} v${app.version}` : app.name
}

/** Apps the review compared, the reviewed one included. */
export function getCheckedAppsCount(app: ProjectPrivacyReferenceClient) {
  return app.alternatives?.length ? app.alternatives.length + 1 : undefined
}
