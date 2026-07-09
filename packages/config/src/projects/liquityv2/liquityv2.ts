import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('liquityv2')

export const liquityv2: BaseProject = {
  id: ProjectId('liquityv2'),
  slug: 'liquityv2',
  name: 'Liquity V2 (BOLD)',
  shortName: undefined,
  addedAt: UnixTime(0),
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
      'Liquity V2 is an immutable, decentralized borrowing protocol where users draw the BOLD stablecoin against ETH, wstETH, and rETH collateral at a user-set interest rate. Each collateral is an isolated branch, backed by its own Stability Pool and price feed.',
    detailedDescription: readProjectMarkdown(
      'liquityv2',
      'detailedDescription',
    ),
    links: {
      websites: ['https://www.liquity.org/'],
      documentation: ['https://docs.liquity.org/'],
      repositories: ['https://github.com/liquity/bold'],
      socialMedia: [
        'https://x.com/LiquityProtocol',
        'https://discord.com/invite/HFKpCdgQm6',
      ],
    },
    references: [
      {
        title: 'Liquity V2 Whitepaper',
        url: 'https://liquity.gitbook.io/v2-whitepaper',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'Stablecoin',
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
