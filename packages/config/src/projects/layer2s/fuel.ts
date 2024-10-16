import { ProjectId } from '@l2beat/shared-pure'
import { Layer2 } from './types'
import { RISK_VIEW } from '../../common/riskView'

export const fuel: Layer2 = {
  id: ProjectId('fuel'),
  display: {
    name: 'Fuel',
    slug: 'fuel',
    description:
      'At Fuel we are building the fastest execution layer for the modular blockchain stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://fuel.network/'],
      apps: ['https://alpha.fuel.network/ecosystem/'],
      documentation: ['https://docs.fuel.network/'],
      explorers: ['https://fuellabs.github.io/block-explorer-v2/beta-4/#/'],
      repositories: ['https://github.com/FuelLabs/'],
      socialMedia: [
        'https://twitter.com/fuel_network',
        'https://discord.com/invite/fuelnetwork',
        'https://forum.fuel.network/',
      ],
    },
  },
  type: 'layer2',
  config: {
    escrows: [],
  },
  riskView: {
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    stateValidation: {
      description: '',
      sentiment: 'UnderReview',
      value: '',
    },
    dataAvailability: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    exitWindow: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    sequencerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
    proposerFailure: {
      description: '',
      sentiment: 'bad',
      value: '',
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  technology: {},
  contracts: {
    addresses: [],
    risks: [],
  },
}
