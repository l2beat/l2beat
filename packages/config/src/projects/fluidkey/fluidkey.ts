import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('fluidkey')

export const fluidkey: BaseProject = {
  id: ProjectId('fluidkey'),
  slug: 'fluidkey',
  name: 'Fluidkey',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-09-08')),
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
      'A wallet service with a closed-source hosted frontend that keeps spending keys client-side and gives recipients a fresh stealth Safe account for every payment through reusable ENS names.',
    detailedDescription: readProjectMarkdown('fluidkey', 'detailedDescription'),
    links: {
      websites: ['https://app.fluidkey.com'],
      documentation: [
        'https://docs.fluidkey.com',
        'https://docs.fluidkey.com/technical-documentation/technical-walkthrough/',
        'https://docs.fluidkey.com/readme/recovery/',
      ],
      repositories: [
        'https://github.com/fluidkey/fluidkey-stealth-account-kit',
        'https://github.com/fluidkey/sara',
        'https://github.com/fluidkey/fluidkey-earn-module',
        'https://github.com/fluidkey/fluidkey-hydrator',
      ],
      socialMedia: ['https://x.com/fluidkey'],
    },
    badges: [],
  },
  privacyInfo: {
    deployedOn: [
      'ethereum',
      'base',
      'arbitrum',
      'optimism',
      'polygonpos',
      'gnosis',
    ],
    // Balances live in individual stealth Safes. Earn-module events identify
    // only a subset of accounts, not a complete set of Fluidkey balances.
    tokens: [],
    summaryTrackedItemName: 'address',
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'Under the documented key model, existing stealth balances are held in user-controlled Safes and can be recovered with the published client-side recovery tool and original Safe initialization parameters. Auto-earn positions remain subject to the withdrawal conditions and risks of their underlying vaults.',
      walkawayTest: {
        passed: false,
        reason:
          'New payment-address generation through the app and ENS, address indexing, transaction construction, and relaying depend on the hosted Fluidkey service.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The production web wallet is closed source and cannot be self-hosted. The published derivation code and recovery client can nevertheless be used to derive keys, verify service-generated receiving addresses, and recover funds independently. A local client can also register and authenticate through the hosted API. The backend implementations of the API, ENS gateway, indexer, and relay service are not published, so the complete service cannot be reproduced.',
    },
    privacy: {
      value: 'Admin view key',
      sentiment: 'bad',
      description:
        'Fluidkey holds a private, per-account viewing capability that lets its service derive and link the stealth addresses generated for that account.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.stealthAddresses,
      PRIVACY_ATTRIBUTES.anyAmount,
      {
        ...PRIVACY_ATTRIBUTES.defi,
        description: 'Interop with DeFi vaults through stealth Safes.',
      },
    ],
    riskSummary: readProjectMarkdown('fluidkey', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('fluidkey', 'upgradesAndGovernance'),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
