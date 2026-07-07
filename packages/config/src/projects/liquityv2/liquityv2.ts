import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

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
    links: {
      websites: ['https://www.liquity.org/'],
    },
    badges: [],
  },
  defiInfo: {
    category: 'CDP / Stablecoin',
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
