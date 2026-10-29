import type {
  PrivacyCheckedApp,
  PrivacyReferenceApp,
} from '~/server/features/privacy/utils/getPrivacyReferenceApp'
import {
  PRIVACY_METHODOLOGY_PATH,
  PRIVACY_REFERENCE_APP_ANCHOR,
} from './methodology/paths'

/** Copy shared by the HTML page and its markdown alternate. */
export const REFERENCE_APP = {
  title: 'Reference app',
  tooltip: 'The most private app we checked. The privacy ratings assume it.',
  listTitle: 'Apps',
  referenceChip: 'Reference',
  checkedChip: 'Leaks more',
  fixLabel: 'Fix',
  methodologyLink: 'How we pick the reference',
  methodologyHref: `${PRIVACY_METHODOLOGY_PATH}#${PRIVACY_REFERENCE_APP_ANCHOR}`,
} as const

/** The app's name with the release the review covers. */
export function getReferenceAppLabel(app: PrivacyReferenceApp) {
  return app.version ? `${app.name} v${app.version}` : app.name
}

/** What the summary stat adds under the app's name. */
export function getReferenceAppNotes(app: PrivacyReferenceApp) {
  return [
    ...(app.source ? [] : ['closed source']),
    ...(app.checkedApps.length > 0
      ? [`most private of ${app.checkedApps.length + 1} checked`]
      : []),
  ]
}

export function getReferenceAppSince(app: PrivacyReferenceApp) {
  return `The ratings assume this app, since ${app.since}`
}

/**
 * The reviewed code: a short hash linking to its tree, or for a closed app the
 * served build and the day the review traced it.
 */
export function getReferenceAppSource(app: PrivacyReferenceApp) {
  if (!app.source) {
    return {
      label: [
        'Closed source',
        ...(app.build ? [`build ${app.build}`] : []),
        ...(app.checked ? [`checked ${app.checked}`] : []),
      ].join(', '),
    }
  }
  return {
    label: 'Source',
    commit: {
      label: app.source.commit.slice(0, 7),
      href: `${app.source.repository}/tree/${app.source.commit}`,
    },
  }
}

export function getCheckedAppSourceLabel(app: PrivacyCheckedApp) {
  return app.checked ? `Source (checked ${app.checked})` : 'Source'
}
