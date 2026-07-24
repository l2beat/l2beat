import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('uniswapv3')

export const uniswapv3: BaseProject = {
  id: ProjectId('uniswapv3'),
  slug: 'uniswapv3',
  name: 'Uniswap V3',
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
      'Uniswap v3 is a concentrated-liquidity AMM where anyone can deploy an immutable, adminless pool for any token pair at an enabled fee tier. User funds sit only in the pools, which no one can upgrade or pause. UNI tokenholder governance, acting through a 2-day timelock, holds two bounded powers over the system: enabling new fee tiers and setting a protocol fee capped at 1/4 of LP fees per side, which since the UNIfication proposal flows through the V3OpenFeeAdapter into the TokenJar and is exchanged by the Firepit for burned UNI.',
    links: {
      websites: ['https://app.uniswap.org/'],
      documentation: ['https://docs.uniswap.org/contracts/v3/overview'],
      repositories: ['https://github.com/Uniswap/v3-core'],
      socialMedia: ['https://x.com/Uniswap'],
    },
    references: [
      {
        title: 'Uniswap v3 Core Whitepaper',
        url: 'https://app.uniswap.org/whitepaper-v3.pdf',
      },
      {
        title: 'UNIfication proposal (protocol fees & UNI burn)',
        url: 'https://vote.uniswapfoundation.org/proposals/93',
      },
    ],
    badges: [],
  },
  defiInfo: {
    category: 'DEX',
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
