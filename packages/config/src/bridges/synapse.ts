import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const synapse: Bridge = {
  type: 'bridge',
  id: ProjectId('synapse'),
  display: {
    name: 'Synapse',
    slug: 'synapse',
    links: {
      websites: ['https://synapseprotocol.com/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
        sinceTimestamp: new UnixTime(1629082107),
        tokens: [
          'ETH',
          'WETH',
          //'gOHM',
          //'HIGH',
          'FRAX',
        ],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Various'], // TODO: list the chains
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Transfers out of the bridge are validated by EOA.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '3 hour delay',
      description:
        'Bridge can be upgraded after 3 hour delay by a 2/3 Admin MultiSig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  contracts: {
    addresses: [
      {
        name: 'L1BridgeZap',
        description: '',
        address: '0x6571d6be3d8460CF5F7d6711Cd9961860029D85F',
      },
      {
        name: 'SynapseBridge',
        description: '',
        address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55',
          implementation: '0x31fe393815822edacBd81C2262467402199EFD0D',
        },
      },
    ],
    risks: [],
  },

  permissions: [
    {
      name: 'Bridge Governance 2/3 MultiSig',
      description:
        'Can update chain gas amount, weth address, manage roles, add kappas, withdraw fees, pause and unpause,   ',
      accounts: [
        {
          address: '0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55',
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Participants in Bridge Governance 2/3 MultiSig',
      description:
        'Can sign the transaction which will be executed by the Multisig contract.',
      accounts: [
        {
          address: '0xb3DAD3C24A861b84fDF380B212662620627D4e15',
          type: 'EOA',
        },
        {
          address: '0x42980E3e602178354E065723d9652BEf79Ae3673',
          type: 'EOA',
        },
        {
          address: '0x0d745Ad687F2b1E1941569f09f612F60ad4aD5BC',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Nodes',
      description: 'Can withdraw funds, mint SynERC20 Wrapped tokens.',
      accounts: [
        {
          address: '0x230A1AC45690B9Ae1176389434610B9526d2f21b',
          type: 'EOA',
        },
      ],
    },
  ],
}
