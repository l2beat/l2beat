import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('satellite')

const mintLimiterSigners = discovery.getContractValue<string[]>(
  'Multisig',
  'signerAccounts',
)
const mintLimiterThreshold = discovery.getContractValue<number>(
  'Multisig',
  'signerThreshold',
)

export const satellite: Bridge = {
  type: 'bridge',
  id: ProjectId('satellite'),
  display: {
    name: 'Satellite (Axelar)',
    slug: 'satellite',
    description:
      'Satellite is a token bridge powered by Axelar network. It allows for cross-chain transfers of assets between Ethereum and other chains, typically to/from Cosmos ecosystem. Axelar is used as both escrow and message relayer.',
    category: 'Hybrid',
    links: {
      websites: ['https://satellite.money/', 'https://axelar.network/'],
      explorers: ['https://axelarscan.io/'],
      repositories: ['https://github.com/axelarnetwork/axelar-examples'],
      socialMedia: [
        'https://twitter.com/axelarnetwork',
        'https://discord.com/invite/aRZ3Ra6f7D',
        'https://linkedin.com/company/axelarnetwork/',
        'https://t.me/axelarcommunity',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x4F4495243837681061C4743b74B3eEdf548D56A5'), // AxerlR Gateway
        sinceTimestamp: new UnixTime(1634135918),
        tokens: [
          'USDC',
          'WBTC',
          'WETH',
          'USDT',
          'DAI',
          'LINK',
          'FRAX',
          'MKR',
          'UNI', //TODO: Add more tokens
        ],
      },
    ],
  },
  technology: {
    canonical: true,
    destination: ['Various'], // TODO: list the chains
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a hybrid bridge that can pass arbitrary messages as well as act as a lock-mint Token Bridge. Different external Routers can be built on top of it, for example Squid Router. It acts as a canonical bridge for many tokens on Cosmos.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validators running PoS consensus',
      description:
        'Transfers are verified by the Validators running the Axelar network which, technically is a Cosmos chain. As in any standard Cosmos chain, Validators are bonded by staking tokens and can be slashed for misbehavior.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators on Axelar decide to not mint tokens after observing an event on Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: "validators relay a withdraw request that wasn't originated on the source chain.",
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens are upgradeable',
      description:
        'Tokens transferred end up as wrapped ERC20 proxies (axlTokens), some of them may be upgradable. The contract is typically BurnableMintableCappedERC20.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: "2/3 Validators' Stake",
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: "2/3 Validators' Stake",
      description:
        'Contracts are upgradable by the same Validators that validate message transfers.',
      sentiment: 'warning',
    },
  },
  permissions: [
    {
      name: 'MintLimiter Multisig',
      accounts: discovery.getPermissionedAccounts('Multisig', 'signerAccounts'),
      description: 'Members of the Multisig that can set mint limits.',
    },
    {
      name: 'Operators',
      accounts: [],
      description:
        'Axelar operators are a list of Axelar validators for the current epoch that can relay messages.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Gateway',
        'Main Gateway contract acting also as an escrow for bridged tokens.',
      ),
      discovery.getContractDetails(
        'AxelarAuthWeighted',
        'Contract verifying  Axelar network Verifier signatures. It stores the list of operators that can relay messages. Operators can be changed by the owner of this contract. Owner is set to be the Gateway itself.',
      ),
      discovery.getContractDetails(
        'InterchainGovernance',
        'Governance contract that executes on-chain governance proposals from Axelar network. It is authorised to upgrade Axelar Gateway.',
      ),
      discovery.getContractDetails(
        'Multisig',
        `Admin Multisig setting mint limits. Acts as a ${mintLimiterThreshold}-of-${mintLimiterSigners.length} multisig.`,
      ),
    ],
    risks: [],
  },
}
