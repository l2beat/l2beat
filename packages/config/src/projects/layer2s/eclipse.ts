import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Layer2 } from './types'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('eclipse')

export const eclipse: Layer2 = {
  isUnderReview: true,
  id: ProjectId('eclipse'),
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a Layer 2 powered by the Solana Virtual Machine (SVM).',
    purposes: ['Universal'],
    category: 'Optimium',
    links: {
      websites: ['https://eclipse.xyz/'],
      apps: [],
      documentation: ['https://docs.eclipse.xyz/'],
      explorers: ['https://explorer.eclipse.xyz/'],
      repositories: ['https://github.com/Eclipse-Laboratories-Inc'],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://mirror.xyz/eclipsemainnet.eth',
      ],
    },
  },
  // rpcUrl: 'https://mainnetbeta-rpc.eclipse.xyz', custom VM, i guess it's different
  config: {
    escrows: [
      {
        chain: 'ethereum',
        address: EthereumAddress('0xd7e4b67e735733ac98a88f13d087d8aac670e644'),
        sinceTimestamp: new UnixTime(1722140987),
        tokens: ['ETH'],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('Contract1'),
      discovery.getContractDetails('Contract2'),
      discovery.getContractDetails('Contract3'),
      discovery.getContractDetails('Contract4'),
      discovery.getContractDetails('Contract5'),
      discovery.getContractDetails('Contract6'),
    ],
    risks: [],
  },
  type: 'layer2',
  riskView: {
    validatedBy: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    destinationToken: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    stateValidation: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    dataAvailability: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    exitWindow: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    sequencerFailure: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
    proposerFailure: {
      value: '?',
      description: '',
      sentiment: 'bad',
    },
  },
  stage: 'NotApplicable',
  technology: {},
}
