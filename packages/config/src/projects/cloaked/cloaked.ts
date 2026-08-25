import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

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
      'A wallet service with a closed-source hosted frontend that keeps spending keys client-side and gives recipients a fresh stealth address for every payment through reusable ENS names.',
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
    // Cloaked balances live in arbitrary one-time EOAs and cannot be
    // attributed using public chain data. Its Privacy Pools integration uses
    // pools that L2BEAT tracks on the separate Privacy Pools project page.
    tokens: [],
    summaryTrackedItemName: 'address',
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'Under the documented key model, existing stealth balances are held in user-controlled EOAs and can be recovered with the published client-side recovery tool. The hosted service cannot spend them without obtaining client-side key material.',
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
        'The production web wallet is closed source and cannot be self-hosted. The published derivation code and API schema can nevertheless be used to build a local client that creates an account, derives keys, and signs and submits payments through the hosted API. The backend implementations of the API, ENS gateway, indexer, and relay service are not published, so the complete service cannot be reproduced.',
    },
    privacy: {
      value: 'Admin view key',
      sentiment: 'bad',
      description:
        'Cloaked holds a private, per-account viewing capability that lets its service derive and link every stealth address for that account. Its relay also sees both sides of Privacy Pools activity. This centralized visibility does not provide spending authority, and users can keep spending keys outside the closed-source wallet by using an inspected local client.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.stealthAddresses,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
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
