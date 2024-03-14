import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('immutablezkevm')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const immutablezkevm: Bridge = {
  type: 'bridge',
  id: ProjectId('immutablezkevm'),
  display: {
    name: 'Immutable zkEVM',
    slug: 'immutablezkevm',
    description:
      'Immutable zkEVM is a sidechain focused on gaming and powered by Polygon stack. It plans to eventually transition to a ZK Rollup.',
    category: 'Token Bridge',
    links: {
      websites: ['https://immutable.com/products/immutable-zkevm'],
      apps: [],
      documentation: ['https://docs.x.immutable.com/docs/zkEVM/overview'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Immutable'],
    },
  },
  config: {
    associatedTokens: ['IMX'],
    escrows: [
      {
        address: EthereumAddress('0xBa5E35E26Ae59c7aea6F029B68c6460De2d13eB6'),
        sinceTimestamp: new UnixTime(1702962563),
        tokens: ['IMX', 'USDC'], // TODO: Add more tokens
      },
    ],
  },
  technology: {
    destination: ['Immutable zkEVM'],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        "Immutable zkEVM bridge makes use of Axelar network to transfer assets between Ethereum and Immutable zkEVM. A deposit starts by a user depositing tokens on the Bridge contract and then the tokens are minted on the destination chain.\n\nWithdrawals to Ethereum can be delayed by a predefined time with a flow rate mechanism that controls outflows of the bridge escrow. The ProxyAdmin or an address with the rate_control role can define so-called buckets for each token: Each bucket has a capacity and a refill rate. All withdrawals that exceed the tokens bucket capacity trigger the withdrawal queue, which delays subsequent withdrawals of *any* of the bridges' assets for a time defined in withdrawalDelay.",
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validators running PoS consensus',
      description:
        'Messages are verified by the Validators running the Axelar network which, technically, is a Cosmos chain. As in any standard Cosmos chain, Validators are bonded by staking tokens and can be slashed for misbehavior.',
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
      name: 'Destination tokens are not upgradable',
      description:
        'Tokens on the destination end up as wrapped ERC20 proxies that are not upgradable, using EIP-1167.',
      references: [],
      risks: [],
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
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'Multisig controlling the ProxyAdmin, potentially stealing all locked funds.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ProxyAdmin'),
      'Contract allowed to upgrade the Bridge, its flow rate control and the Axelar adaptor.',
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('Bridge', {
        description: 'Main escrow for tokens.',
        ...upgradeability,
      }),
      discovery.getContractDetails('RootAxelarBridgeAdaptor', {
        description: 'Axelar adaptor contract used by the bridge.',
        ...upgradeability,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
