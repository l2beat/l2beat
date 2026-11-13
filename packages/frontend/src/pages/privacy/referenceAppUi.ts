import { ChainSpecificAddress } from '@l2beat/shared-pure'
import lowerFirst from 'lodash/lowerFirst'
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
  rebuildLink: 'Build recipe',
  methodologyLink: 'How we pick the reference',
  methodologyHref: `${PRIVACY_METHODOLOGY_PATH}#${PRIVACY_REFERENCE_APP_ANCHOR}`,
} as const

/**
 * How the app's code reaches the user, most checkable first, and how the app
 * relates to public source. The methodology page lists both under Reference
 * app, in these words. The sentiment follows each order and colours the
 * symbol: it grades what a user can check, not the app's privacy. Public
 * source earns its colour on the source symbol alone, so a hosted app is red
 * with or without it.
 */
export const DELIVERY = {
  kinds: {
    pinned: {
      label: 'Pinned',
      sentiment: 'good',
      description:
        'Every user can get the build we reviewed and check its hash or contract address against ours.',
    },
    latestOnly: {
      label: 'Latest only',
      sentiment: 'warning',
      description:
        'The store gives every user the same build per version but offers only the latest, so the reviewed one can disappear. Only the version can be checked.',
    },
    hosted: {
      label: 'Hosted',
      sentiment: 'bad',
      description:
        'The website serves the code at each visit and can change it at any time, even for one user alone.',
    },
  },
  sources: {
    reproducible: {
      label: 'Reproducible',
      sentiment: 'good',
      description: 'A rebuild of the public source gives the same app.',
    },
    open: {
      label: 'Open',
      sentiment: 'warning',
      description:
        'The source is public, but no rebuild confirms the app comes from it.',
    },
    closed: {
      label: 'Closed',
      sentiment: 'bad',
      description:
        "The source is closed, so our review rests on the app's observed behaviour.",
    },
  },
} as const

/** The app's name with the release the review covers. */
export function getReferenceAppLabel(app: PrivacyReferenceApp) {
  return app.version ? `${app.name} v${app.version}` : app.name
}

/**
 * What the summary stat adds under the app's name. The delivery sits next to
 * the name, as symbols in the HTML and as words in the markdown.
 */
export function getReferenceAppNotes(app: PrivacyReferenceApp) {
  return [
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

/**
 * The delivery: how the code arrives (`kind`) and how the app relates to
 * public source (`source`), a label of both like "Pinned, reproducible", and
 * the pin or store version to check the app against.
 */
export function getReferenceAppDelivery(app: PrivacyReferenceApp) {
  const delivery = app.delivery
  const rebuild = delivery.type === 'hosted' ? undefined : delivery.rebuild
  const kind = { id: delivery.type, ...DELIVERY.kinds[delivery.type] }
  const sourceId = rebuild ? 'reproducible' : app.source ? 'open' : 'closed'
  const source = { id: sourceId, ...DELIVERY.sources[sourceId] } as const
  return {
    kind,
    source,
    label: `${kind.label}, ${lowerFirst(source.label)}`,
    check: getDeliveryCheck(app),
    rebuild,
  }
}

/** What the user compares: a label, and the pinned value when there is one. */
function getDeliveryCheck({ delivery, version }: PrivacyReferenceApp) {
  if (delivery.type === 'hosted') return undefined
  if (delivery.type === 'latestOnly') {
    return {
      label: version ? `${delivery.store}, version ${version}` : delivery.store,
    }
  }
  const pin = delivery.pin
  switch (pin.type) {
    case 'ipfs':
      return { label: 'IPFS hash', value: pin.cid }
    case 'contract':
      return {
        label: 'Contract',
        value: ChainSpecificAddress.address(pin.address),
      }
    case 'sha256':
      return { label: `SHA-256 of ${pin.file}`, value: pin.hash }
  }
}

export function getCheckedAppSourceLabel(app: PrivacyCheckedApp) {
  return app.checked ? `Source (checked ${app.checked})` : 'Source'
}
