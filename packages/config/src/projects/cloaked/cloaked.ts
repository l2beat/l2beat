import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { cloakedAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('cloaked')

export const cloaked: BaseProject = {
  id: ProjectId('cloaked'),
  slug: 'cloaked',
  name: 'Cloaked',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-08-21')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A stealth-address wallet that receives every payment on a fresh address, with passkey login and an Incognito balance in Privacy Pools.',
    detailedDescription: readProjectMarkdown('cloaked', 'detailedDescription'),
    links: {
      websites: ['https://app.clkd.xyz'],
      documentation: [
        'https://clkd.xyz/docs',
        'https://clkd.xyz/docs/ens-names',
        'https://clkd.xyz/openapi.json',
      ],
      repositories: [
        'https://github.com/cloakedxyz/clkd-stealth',
        'https://github.com/cloakedxyz/clkd-recovery',
        'https://github.com/cloakedxyz/account',
        'https://github.com/cloakedxyz/clkd-privacy-pools',
      ],
      socialMedia: ['https://x.com/staycloakedxyz'],
    },
    badges: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.stealthAddress,
    trackedOn: ['ethereum'],
    // Cloaked balances live in arbitrary one-time EOAs and cannot be
    // attributed using public chain data. Its Privacy Pools integration uses
    // pools that L2BEAT tracks on the separate Privacy Pools project page.
    tokens: [],
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Cloaked sends funds to one-time stealth addresses instead of mixing deposits in a shared pool.',
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'Balances sit in addresses your keys control, and the open recovery tool exports their keys. Cloaked can spend them only with your key material.',
      walkawayTest: {
        passed: false,
        reason:
          'New payment-address generation, ENS resolution, address indexing, transaction construction, and relaying depend on the hosted Cloaked service.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The web app, its vault and the browser extension are closed source. The open stealth library and recovery tool derive keys and recover funds without Cloaked. The API, ENS gateway, indexer and relay are closed.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.stealthAddresses,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: cloakedAdversaries,
    riskSummary: readProjectMarkdown('cloaked', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('cloaked', 'upgradesAndGovernance'),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
