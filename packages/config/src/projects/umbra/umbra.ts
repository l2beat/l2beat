import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('umbra')

export const umbra: BaseProject = {
  id: ProjectId('umbra'),
  slug: 'umbra',
  name: 'Umbra Cash',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-07-31')),
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
      'A stealth-address payment protocol that hides the recipient behind a fresh address for every transfer.',
    detailedDescription: readProjectMarkdown('umbra', 'detailedDescription'),
    links: {
      websites: ['https://app.umbra.cash'],
      documentation: ['https://app.umbra.cash/faq'],
      repositories: ['https://github.com/ScopeLift/umbra-protocol'],
      socialMedia: [
        'https://x.com/UmbraCash',
        'https://discord.com/invite/uw4y5J2p7C',
      ],
      other: [
        'https://diligence.security/audits/2021/03/umbra-smart-contracts/',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    // TODO: Track volume from Announcement events once privacy metrics support
    // volume-only protocols without TVL and withdrawal flows. ETH uses token
    // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE and event topic
    // 0x29877766fa2bfe3b90008d6d92f965eca91cbc5757ed775740e460799fb92219.
    tokens: [],
    summaryTrackedItemName: 'transfer',
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The core contracts are immutable. The owner can change the toll for future payments, but cannot stop recipients from accessing payments that have already been sent.',
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The immutable core contracts, cryptographic library, and frontend are published and can be built and run locally.',
    },
    privacy: {
      value: 'Recipient privacy',
      sentiment: 'good',
      description:
        'There is no protocol-level compliance mechanism or privileged view key. Umbra hides who controls the receiving address, but the sender, amount, and stealth address remain public and privacy can be weakened by transaction patterns or poor withdrawal hygiene.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.stealthAddresses,
    ],
    riskSummary: readProjectMarkdown('umbra', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('umbra', 'upgradesAndGovernance'),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
