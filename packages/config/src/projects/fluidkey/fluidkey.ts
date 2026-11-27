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
  milestones: [
    // Fluidkey's report: self-hosted SigNoz v0.121.1 (GHSA-v549-7j2x-qjm5,
    // GHSA-w5pf-xwjh-vr5v) let the attacker read logs from 12 to 19 November.
    // Unauthorized transfers 17:28 to 18:05 UTC on six chains (BNB Chain
    // included), processing offline at 18:05, back with v1.79.22 on
    // 2026-11-20 15:27 UTC. Tether froze 1,549,450 USDT of the traced funds on
    // 2026-11-23, not yet returned (update of 2026-11-27).
    {
      title: 'Attacker drains $1.6M from 52 accounts',
      url: 'https://docs.fluidkey.com/security/incident-2026-11-19',
      date: '2026-11-19T00:00:00Z',
      description:
        "Session tokens from Fluidkey's logs let an attacker queue transfers that open apps signed.",
      type: 'incident',
    },
    {
      // 70 accounts in the first report (38 emails, 37 names, 17 IBANs, 24
      // postal addresses), more after the log review of 2026-11-25, no count.
      title: "Attacker reads 54 accounts' viewing keys",
      url: 'https://docs.fluidkey.com/security/incident-2026-11-19',
      date: '2026-11-19T00:00:00Z',
      description:
        'The same logs expose names, bank account numbers or addresses of more than 70 accounts.',
      type: 'incident',
    },
    {
      // "What we changed" in the report. Before, the user's key signed any
      // transfer the server marked approved. The web build of 2026-11-26
      // (entrypoint-5acd0edd) signs a Safe transaction only when each step
      // carries the spending key's EIP-712 signature over recipient, value and
      // data (isOwnAcceptProof), which the app makes after the user's PIN.
      title: 'Session tokens no longer approve transfers',
      url: 'https://docs.fluidkey.com/security/incident-2026-11-19#what-we-changed',
      date: '2026-11-20T00:00:00Z',
      description:
        "From v1.79.22, the user's key signs a transfer only after the user confirms it in the app.",
      type: 'general',
    },
  ],
  privacyInfo: {
    category: PRIVACY_CATEGORIES.stealthAddress,
    referenceApp: {
      name: 'Fluidkey web app',
      url: 'https://app.fluidkey.com',
      since: '2026-10-13',
      delivery: { type: 'hosted' },
      // Expo web entry bundle of the served app.
      build: 'entrypoint-5acd0edd730f7f2af1e2fe5d61e8bb57',
      checked: '2026-11-27',
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
