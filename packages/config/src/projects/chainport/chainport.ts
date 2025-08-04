import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

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
  addedAt: UnixTime(1696938823), // 2023-10-10T11:53:43Z
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
        address: ChainSpecificAddress(
          'eth:0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19',
        ), // Vault 1
        tokens: '*',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x450aD18B4442ce2972Af2a7A12439984db4Afaf9',
        ), // Vault 2
        tokens: '*',
      }),
      {
        address: EthereumAddress('0xD2238E8c085E5059F8DFC52256530210bc7250F6'), // Vault 3
        sinceTimestamp: UnixTime(1626181305),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x873089bC765a1C0AFAd48e34fCd305d17D81be87'), // Vault 5
        sinceTimestamp: UnixTime(1636903885),
        tokens: '*',
        chain: 'ethereum',
      },
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a',
        ), // Vault 6
        tokens: '*',
      }),
      {
        address: EthereumAddress('0x894107B7b5051409f279E8300774B2f62Febe057'),
        tokens: '*',
        sinceTimestamp: UnixTime(1626181305),
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xfE83475880d3592833249BAAacfEC5eD51E29D82'),
        tokens: '*',
        sinceTimestamp: UnixTime(1626181305),
        chain: 'ethereum',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Transfers are controlled by the Chainport Congress.',
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
        },
        {
          category: 'Funds can be stolen if',
          text: 'third party actors relay a fake messages.',
        },
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
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
          `Registry of the Chainport Congress members. Acts as a ${congressThreshold} / ${congressSize} multisig.`,
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Congress members',
          discovery.getPermissionedAccounts(
            'ChainportCongressMembersRegistry',
            'allMembers',
          ),
          'Members of the Chainport Congress.',
        ),
        discovery.getMultisigPermission('MultisigVault1', 'Vault 1.'),
        discovery.getMultisigPermission('MultisigVault2', 'Vault 2.'),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
