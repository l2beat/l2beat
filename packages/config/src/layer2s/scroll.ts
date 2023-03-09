import { ProjectId } from '@l2beat/shared'

import {
  EMPTY_TECHNOLOGY_CHOICE,
  makeBridgeCompatible,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'

export const scroll: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('scroll'),
  display: {
    name: 'Scroll',
    slug: 'scroll',
    description:
      'Scroll is a zkEVM-based zkRollup on Ethereum that enables native compatibility for existing Ethereum applications and tools.',
    purpose: 'Universal',
    links: {
      websites: ['https://scroll.io/'],
      apps: ['https://scroll.io/alpha/bridge'],
      documentation: ['https://guide.scroll.io/', 'https://scroll.io/alpha'],
      explorers: ['https://blockscout.scroll.io/'],
      repositories: [
        'https://github.com/scroll-tech/zkevm-circuits',
        'https://github.com/scroll-tech/go-ethereum',
        'https://github.com/scroll-tech/scroll-zkevm',
        'https://github.com/scroll-tech',
      ],
      socialMedia: [
        'https://www.discord.gg/scroll',
        'https://www.youtube.com/@Scroll_ZKP',
        'https://twitter.com/Scroll_ZKP',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.EMPTY,
    dataAvailability: RISK_VIEW.EMPTY,
    upgradeability: RISK_VIEW.EMPTY,
    sequencerFailure: RISK_VIEW.EMPTY,
    validatorFailure: RISK_VIEW.EMPTY,
    destinationToken: RISK_VIEW.EMPTY,
    validatedBy: RISK_VIEW.EMPTY,
  }),
  technology: {
    category: 'ZK Rollup',
    stateCorrectness: EMPTY_TECHNOLOGY_CHOICE,
    dataAvailability: EMPTY_TECHNOLOGY_CHOICE,
    operator: EMPTY_TECHNOLOGY_CHOICE,
    forceTransactions: EMPTY_TECHNOLOGY_CHOICE,
    exitMechanisms: [],
  },
  contracts: {
    addresses: [],
    risks: [],
  },
}
