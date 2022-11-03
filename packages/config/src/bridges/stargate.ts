import { ProjectId, UnixTime } from '@l2beat/types'

import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const stargate: Bridge = {
  type: 'bridge',
  id: ProjectId('stargate'),
  display: {
    name: 'StarGate (LayerZero)',
    slug: 'stargate',
    links: {
      websites: ['https://stargate.finance/', 'https://layerzero.network/'],
      repositories: [
        'https://github.com/stargate-protocol/stargate',
        'https://github.com/LayerZero-Labs/LayerZero',
      ],
      socialMedia: [
        'https://discord.gg/agEXvDB',
        'https://t.me/joinchat/LEM0ELklmO1kODdh',
        'https://medium.com/stargate-official',
        'https://twitter.com/StargateFinance',
      ],
    },
    description:
      'StarGate is built on top of LayerZero protocol and is a liquidity network for cross-chain transfer for assets. It leverages an oracle and relayer for cross-chain security for the protocol.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'No',
      description: 'Contracts are not upgradable.',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: [
      'BNB Chain',
      'Avalanche',
      'Polygon',
      'Arbitrum',
      'Optimism',
      'Fantom',
    ],
    category: 'Liquidity Network',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'StarGate is a Liquidity Network. It relies on liquidity providers to supply tokens to liquidity pools on each chain. \
        Users can swap tokens between chains by transferring their tokens to a pool and receive token from the pool on the destination chain.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Oracles and relayers',
      description:
        'StarGate is built on top of LayerZero protocol. LayerZero relies on oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, relayers can provide the merkle proof for the transfers / swaps.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracles or relayers fail to facilitate the transfer.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer .',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    // In StarkGate these are pools, there is a separate Pool contract for each supported token. The list of all the pools can be obtained
    // from the pool factory: 0x06d538690af257da524f25d0cd52fd85b1c2173e. For Ether pool (SGETH) there is additional Escrow contract
    escrows: [
      {
        address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
        sinceTimestamp: new UnixTime(1647511732),
        tokens: ['USDC'],
      },
      {
        address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
        sinceTimestamp: new UnixTime(1647511860),
        tokens: ['USDT'],
      },
      //   {
      //     address: '0x692953e758c3669290cb1677180c64183cEe374e',
      //     sinceTimestamp: new UnixTime(1656354769),
      //     tokens: ['USDD'],
      //   },
      {
        address: '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c',
        sinceTimestamp: new UnixTime(1656108257),
        tokens: ['ETH'],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
        name: 'Router',
        description: 'StarGate Router.',
      },
      {
        address: '0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97',
        name: 'Bridge',
        description: 'StarGate Bridge.',
      },
      {
        address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
        name: 'Endpoint',
        description: 'LayerZero Ethereum Endpoint.',
      },
      {
        address: '0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C',
        name: 'UltraLightNode',
        description:
          'LayerZero UltraLight Node. Used by oracles to checkpoint source chain block hashes.',
      },
      {
        address: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
        name: 'UltraLightNodeV2',
        description: 'LayerZero UltraLight Node.',
      },
      {
        address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
        name: 'USDC Pool',
        description: 'USDC Pool.',
      },
      {
        address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
        name: 'USDT Pool',
        description: 'USDT Pool.',
      },
      {
        address: '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c',
        name: 'StargateEthVault',
        description: 'ETH Pool.',
      },
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: [
        {
          address: '0x65bb797c2B9830d891D87288F029ed8dACc19705',
          type: 'MultiSig',
        },
      ],
      name: 'StarGate MultiSig',
      description: 'Can create new pools, chainpaths, set fees.',
    },
    {
      accounts: [
        { address: '0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d', type: 'EOA' },
        { address: '0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1', type: 'EOA' },
        { address: '0x79e2b9C1F6C9ed1375C93AaF139e6C4537f48523', type: 'EOA' },
        { address: '0xF05F4211ad15A8e49b49C0436067CFFfEa783aA4', type: 'EOA' },
        { address: '0xf02CC4dc84aC59Bd6089BAddcEB9d4Ef3AEFb0f0', type: 'EOA' },
      ],
      name: 'MultiSig Participants',
      description: 'Participants of the 2/5 StarGate MultiSig.',
    },
  ],
}
