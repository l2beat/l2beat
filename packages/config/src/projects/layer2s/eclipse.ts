import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer2 } from './types'

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
    ],
    risks: [],
  },
  type: 'layer2',
  riskView: {
    validatedBy: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    sourceUpgradeability: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    destinationToken: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    stateValidation: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    dataAvailability: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    exitWindow: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    sequencerFailure: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
    proposerFailure: {
      description:
        'Risk cannot be evaluated since smart contract source is unavailable.',
      sentiment: 'bad',
      value: 'Unverified',
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  technology: {},
  permissions: [
    ...discovery.getMultisigPermission(
      'EclipseMultisig',
      'Can upgrade system contracts.',
    ),
  ],
}
