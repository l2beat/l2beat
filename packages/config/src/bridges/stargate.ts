import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('stargate')

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
      'StarGate is built on top of LayerZero protocol and is a liquidity network for cross-chain transfer for assets. It leverages an oracle and relayer for cross-chain security for the protocol. \
      Note that StarGate UI also supports omnichain tokens built directly on top of LayerZero protocol, e.g. JOE.',
    category: 'Liquidity Network',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56'),
        sinceTimestamp: new UnixTime(1647511732),
        tokens: ['USDC'],
        description: 'USDC Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x38EA452219524Bb87e18dE1C24D3bB59510BD783'),
        sinceTimestamp: new UnixTime(1647511732),
        tokens: ['USDT'],
        description: 'USDT Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x692953e758c3669290cb1677180c64183cEe374e'),
        sinceTimestamp: new UnixTime(1656354769),
        tokens: ['USDD'],
        description: 'USDD Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0Faf1d2d3CED330824de3B8200fc8dc6E397850d'),
        sinceTimestamp: new UnixTime(1668459527),
        tokens: ['DAI'],
        description: 'DAI Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xfA0F307783AC21C39E939ACFF795e27b650F6e68'),
        sinceTimestamp: new UnixTime(1668459527),
        tokens: ['FRAX'],
        description: 'FRAX Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE8F55368C82D38bbbbDb5533e7F56AfC2E978CC2'),
        sinceTimestamp: new UnixTime(1668459587),
        tokens: ['LUSD'],
        description: 'LUSD Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xd8772edBF88bBa2667ed011542343b0eDDaCDa47'),
        sinceTimestamp: new UnixTime(1673830559),
        tokens: ['Metis'],
        description: 'METIS Escrow',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x430Ebff5E3E80A6C58E7e6ADA1d90F5c28AA116d'),
        sinceTimestamp: new UnixTime(1673830559),
        tokens: ['USDT'],
        description: 'USDT Pool 2',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1CE66c52C36757Daf6551eDc04800A0Ec9983A09'),
        sinceTimestamp: new UnixTime(1677032255),
        tokens: ['WOO'],
        description: 'WOO Pool',
      }),
      {
        address: EthereumAddress('0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c'),
        sinceTimestamp: new UnixTime(1656108257),
        tokens: ['ETH'],
      },
      //      "0x590d4f8A68583639f215f675F3a259Ed84790580": "sUSD Pool",
      //      "0x9cef9a0b1bE0D289ac9f4a98ff317c33EAA84eb8": "MAI Pool",
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Router',
        'Entry point for the user interaction with StarGate Bridge, handles the logic of swaps and adding liquidity, send messages to the bridge.',
      ),
      discovery.getContractDetails(
        'Bridge',
        'Main bridge contract, receives messages from LayerZero Endpoint, stores bridge configuration.',
      ),
      discovery.getContractDetails(
        'Factory',
        'Factory contract managing all liquidity pools.',
      ),
      {
        //Probably outdated
        address: EthereumAddress('0x902F09715B6303d4173037652FA7377e5b98089E'),
        name: 'LayerZero Relayer',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0xA658742d33ebd2ce2F0bdFf73515Aa797Fd161D9'),
          implementation: EthereumAddress(
            '0x76A15d86FbBe691557C8b7A9C4BebF1d8AFE00A7',
          ),
        },
      },
      {
        address: EthereumAddress('0x5a54fe5234E811466D5366846283323c954310B2'),
        name: 'LayerZero Oracle',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8'),
          implementation: EthereumAddress(
            '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
          ),
        },
      },
      discovery.getContractDetails('Endpoint', 'LayerZero Ethereum Endpoint.'),
      //Probably outdated
      {
        address: EthereumAddress('0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C'),
        name: 'UltraLightNode',
        description:
          'LayerZero UltraLight Node. Used by oracles to checkpoint source chain block hashes.',
      },
      discovery.getContractDetails(
        'UltraLightNodeV2',
        'LayerZero UltraLight Node.',
      ),
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'StarGate Multisig',
      'Bridge owner, can create new pools, chainpaths, set fees.',
    ),
    ...discovery.getMultisigPermission(
      'LayerZero Multisig',
      'The owner of Endpoint, UltraLightNode and Treasury contracts. Can switch to a new UltraLightNode for an Endpoint. Can switch proof library for an UltraLightNode and change Treasury.',
    ),
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x902F09715B6303d4173037652FA7377e5b98089E',
          ),
          type: 'Contract',
        },
      ],
      name: 'LayerZero Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x76F6d257CEB5736CbcAAb5c48E4225a45F74d6e5',
          ),
          type: 'EOA',
        },
      ],
      name: 'LayerZero Relayer Admin owner',
      description: 'Can upgrade LayerZero relayer contract with no delay.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x7B80f2924E3Ad59a55f4bcC38AB63480599Be6c8',
          ),
          type: 'EOA',
        },
      ],
      name: 'LayerZero Oracle Admin owner',
      description: 'Can upgrade LayerZero oracle contract with no delay.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
    {
      title: 'StarGate Bridge architecture',
      url: 'https://twitter.com/bkiepuszewski/status/1518568490147450880',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
