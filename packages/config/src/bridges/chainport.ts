import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('chainport')
const congressSize = discovery.getContractValue<number>(
  'ChainportCongressMembersRegistry',
  'getNumberOfMembers',
)
const congressThreshold = discovery.getContractValue<number>(
  'ChainportCongressMembersRegistry',
  'getMinimalQuorum',
)

export const chainport: Bridge = {
  type: 'bridge',
  id: ProjectId('chainport'),
  display: {
    name: 'Chainport',
    slug: 'chainport',
    description: 'ChainPort Cross-Chain Bridge: Port across 15+ Chains.',
    category: 'Token Bridge',
    links: {
      websites: ['https://chainport.io/'],
      documentation: ['https://docs.chainport.io/'],
      socialMedia: ['https://twitter.com/chain_port'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19'), // Vault 1
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x450aD18B4442ce2972Af2a7A12439984db4Afaf9'), // Vault 2
        tokens: '*',
      }),
      {
        address: EthereumAddress('0xD2238E8c085E5059F8DFC52256530210bc7250F6'), // Vault 3
        sinceTimestamp: new UnixTime(1626181305),
        tokens: '*',
      },
      {
        address: EthereumAddress('0x873089bC765a1C0AFAd48e34fCd305d17D81be87'), // Vault 5
        sinceTimestamp: new UnixTime(1636903885),
        tokens: '*',
      },
      discovery.getEscrowDetails({
        address: EthereumAddress('0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a'), // Vault 6
        tokens: '*',
      }),
      {
        address: EthereumAddress('0x894107B7b5051409f279E8300774B2f62Febe057'),
        tokens: '*',
        sinceTimestamp: new UnixTime(1626181305),
      },
      {
        address: EthereumAddress('0xfE83475880d3592833249BAAacfEC5eD51E29D82'),
        tokens: '*',
        sinceTimestamp: new UnixTime(1626181305),
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Transfers are controlled by the Chainport Congress.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
  },
  technology: {
    destination: [
      'Optimism',
      'Arbitrum',
      'Polygon',
      'BSC',
      'Avax',
      'Ethereum',
      'Fuse',
      'Fantom',
      'Moonriver',
      'Aurora',
      'Cardano',
      'Dogechain',
      'Telos',
      'Milkomeda',
      'Conflux',
      'Base',
      'Meld',
      'opBNB',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Funds are moved between escrows and chains using third party actors.',
      references: [],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'third party actors decide to not relay selected messages between chains.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'third party actors relay a fake messages.',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Vault6',
        'Escrow controlled by the Chainport Congress.',
      ),
      discovery.getContractDetails(
        'ChainportCongress',
        'Contains the logic to create proposal, vote and execute them.',
      ),
      discovery.getContractDetails(
        'ChainportCongressMembersRegistry',
        `Registry of the Chainport Congress members. Acts as a ${congressThreshold}-of-${congressSize} multisig.`,
      ),
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Congress members',
      accounts: discovery.getPermissionedAccounts(
        'ChainportCongressMembersRegistry',
        'allMembers',
      ),
      description: 'Members of the Chainport Congress.',
    },
    ...discovery.getMultisigPermission('MultisigVault1', 'Vault 1.'),
    ...discovery.getMultisigPermission('MultisigVault2', 'Vault 2.'),
  ],
}
