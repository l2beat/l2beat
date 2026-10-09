import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { fluidkeyAdversaries } from './adversaries'

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
      'A stealth-address wallet that gives you a fresh receiving address for every payment and shows them as one account.',
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
    category: PRIVACY_CATEGORIES.stealthAddress,
    trackedOn: [
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
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Fluidkey sends funds to individual stealth Safes instead of mixing deposits in a shared pool.',
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        "Your funds sit in Safes that only your keys control. The open recovery app finds and withdraws them without Fluidkey. Money in auto-earn vaults follows the vaults' withdrawal rules.",
      walkawayTest: {
        passed: false,
        reason:
          "Name lookups, new addresses in the app, finding your Safes and submitting sends all run on Fluidkey's servers.",
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The web and mobile apps are closed source. The open stealth account kit and recovery app derive keys, verify addresses and recover funds without Fluidkey. The API, ENS gateway, indexer and relayer are closed.',
    },
    adversaries: fluidkeyAdversaries(
      discovery.getContractValue<number>('FluidkeyScore', 'holders'),
    ),
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
