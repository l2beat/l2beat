import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import {
  PRIVACY_EXIT_WINDOW,
  PRIVACY_REPRODUCIBILITY,
} from '../../common/privacySummaryValues'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { fluidkeyAdversaries } from './adversaries'
import { fluidkeyRiskSummary } from './riskSummary'

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
      'A stealth-address wallet that receives every payment on a fresh Safe, with optional yield and bank transfers.',
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
    referenceApp: {
      name: 'Fluidkey web app',
      url: 'https://app.fluidkey.com',
      since: '2026-10-13',
      delivery: { type: 'hosted' },
      // Expo web entry bundle of the served app, which shows version 1.79.5w.
      build: 'entrypoint-77ace9b9b65d7dc8cdf54db0e9150210',
      checked: '2026-11-18',
    },
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
      ...PRIVACY_EXIT_WINDOW.infinite,
      description:
        "The user's funds sit in Safes controlled only by their keys. The open recovery app finds them and Eternal Safe withdraws them, both without Fluidkey. Money in auto-earn vaults follows the vaults' withdrawal rules.",
      walkawayTest: {
        passed: false,
        reason:
          "Name lookups, new addresses in the app, finding the user's Safes and submitting sends all run on Fluidkey's servers.",
      },
    },
    reproducibility: {
      ...PRIVACY_REPRODUCIBILITY.partial,
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
    compliance: {
      none: "No check on onchain payments is known, and each payment's sender is public. Bank transfers need identity verification by Noah and Sumsub.",
    },
    riskSummary: fluidkeyRiskSummary,
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
