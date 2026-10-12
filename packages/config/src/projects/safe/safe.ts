import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CROP_NOTES } from '../../common/crops'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('safe')

const v130 = discovery.getContractValue<string>('GnosisSafe', 'VERSION')
const v141 = discovery.getContractValue<string>('Safe_v1_4_1', 'VERSION')
const v150 = discovery.getContractValue<string>('Safe_v1_5_0', 'VERSION')

export const safe: BaseProject = {
  id: ProjectId('safe'),
  slug: 'safe',
  name: 'Safe',
  shortName: undefined,
  addedAt: UnixTime(1791763200), // 2026-10-12
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: `Safe is a multisig wallet: a contract account that executes transactions once enough of its owners have signed. This page covers Safe v${v130}, v${v141} and v${v150}, whose implementations are immutable and have no owner.`,
    detailedDescription: readProjectMarkdown('safe', 'detailedDescription', {
      v130,
      v141,
      v150,
    }),
    links: {
      websites: ['https://safe.global/', 'https://app.safe.global/'],
      documentation: ['https://docs.safe.global/'],
      repositories: [
        'https://github.com/safe-global/safe-smart-account',
        'https://github.com/safe-global/safe-wallet-monorepo',
      ],
      socialMedia: ['https://x.com/safe'],
    },
    references: [
      {
        title: `Safe v${v150} audit reports (Certora, Ackee Blockchain)`,
        url: `https://github.com/safe-global/safe-smart-account/blob/v${v150}/docs/audit_1_5_0.md`,
      },
      {
        title: `Safe v${v141} audit report (Ackee Blockchain)`,
        url: `https://github.com/safe-global/safe-smart-account/blob/v${v141}/docs/audit_1_4_0.md`,
      },
      {
        title: `Safe v${v130} audit report (G0 Group)`,
        url: `https://github.com/safe-global/safe-smart-account/blob/v${v130}/docs/audit_1_3_0.md`,
      },
      {
        title: 'Safe signature formats',
        url: `https://github.com/safe-global/safe-smart-account/blob/v${v141}/docs/signatures.md`,
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Multisig',
  },
  // Declared empty on purpose: accounts depend on no oracle, bridge or other
  // external contract. Modules and guards are chosen per account by its owners.
  externalDependencies: [],
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        'Anyone can create an account, and anyone can submit a transaction once enough owners have signed it.',
        "Only an account's owners can act for it or change its rules.",
        CROP_NOTES.passesWalkawayTest(
          'owners do not need the Safe{Wallet} interface or the Safe transaction service.',
        ),
      ],
      notReviewed: ['Modules and guards an account enables.'],
    },
    openSource: {
      sentiment: 'good',
      license: 'LGPL-3.0',
      points: [
        'The contracts are under the LGPL and the Safe{Wallet} interface under the GPL.',
        'The contracts are verified onchain and can be built and run locally.',
      ],
      additionalConsiderations: [
        'Since February 2026, new code in the Safe transaction service is under the source-available FSL, converting to MIT after two years. The contracts do not need the service, and its earlier MIT version can be self-hosted.',
      ],
    },
    privacy: {
      status: 'fullyTransparent',
      points: [
        'The protocol does not make privacy claims, and is fully transparent.',
        'Owners, thresholds and transactions are public onchain.',
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'The implementations, factories and default fallback handlers are immutable and have no owner.',
        'No external dependency: no oracle, no bridge.',
        `v${v130} was audited by G0 Group, v${v141} by Ackee Blockchain except for one small ERC-4337 compatibility fix, and v${v150} by Certora and Ackee Blockchain.`,
      ],
      additionalConsiderations: [
        "Owners sign a transaction hash, so a compromised interface can make them sign something else. This is how Bybit's account was drained in February 2025.",
        'Delegatecalls, modules and guards are as safe as the code they point to.',
        'No circuit breakers or rate limits beyond what an account adds itself. A bug in an implementation would reach every account using it.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
