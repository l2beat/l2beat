import { ProjectId } from '@l2beat/shared-pure'
import { Layer2 } from './types'
import { RISK_VIEW } from '../../common/riskView'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { formatEther } from 'ethers/lib/utils'

const discovery = new ProjectDiscovery('fuel')
const depositLimitGlobal = formatEther(
  discovery.getContractValue<number>('FuelMessagePortal', 'depositLimitGlobal'),
)
const isErc20whitelistActive = discovery.getContractValue<boolean>(
  'FuelERC20Gateway',
  'whitelistRequired',
)

export const fuel: Layer2 = {
  id: ProjectId('fuel'),
  display: {
    name: 'Fuel',
    slug: 'fuel',
    description:
      'Fuel plans to build the fastest execution layer for the modular blockchain stack.',
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
  permissions: [
    {
      name: 'ERC20Gateway pausers',
      description: 'Whitelisted addresses that can pause the ERC20Gateway.',
      accounts: discovery.getAccessControlRolePermission(
        'ERC20Gateway',
        'PAUSER_ROLE',
      ),
    },
    {
      name: 'FuelMessagePortal pausers',
      description:
        'Whitelisted addresses that can pause the FuelMessagePortal and blacklist L2->L1 messages.',
      accounts: discovery.getAccessControlRolePermission(
        'FuelMessagePortal',
        'PAUSER_ROLE',
      ),
    },
    ...discovery.getMultisigPermission(
      'FuelMultisig',
      'Can upgrade the FuelERC20Gateway, FuelMessagePortal and FuelChainState contracts, potentially gaining access to all funds. It can unpause contracts and remove L2->L1 messages from the blacklist. It can also limit the tokens that can be bridged to L2.',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('FuelERC20Gateway', {
        description: `Standard gateway to deposit and withdraw ERC20 tokens. It implements rate limits and a whitelist for tokens. The whitelist is currently ${isErc20whitelistActive ? 'active' : 'inactive'}.`,
      }),
      discovery.getContractDetails('FuelMessagePortal', {
        description: `Contract that allows to send and receive arbitrary messages to and from L2. It implements a max deposit limit for ETH, currently set to ${depositLimitGlobal} ETH, and rate limits withdrawals. Pausers are allowed to blacklist L2->L1 messages.`,
      }),
    ],
    risks: [],
  },
}
