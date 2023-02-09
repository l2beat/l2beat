import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../layer2s/common/ProjectDiscovery'
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
        address: EthereumAddress('0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56'),
        sinceTimestamp: new UnixTime(1647511732),
        tokens: ['USDC'],
      },
      {
        address: EthereumAddress('0x38EA452219524Bb87e18dE1C24D3bB59510BD783'),
        sinceTimestamp: new UnixTime(1647511860),
        tokens: ['USDT'],
      },
      //   {
      //     address: EthereumAddress('0x692953e758c3669290cb1677180c64183cEe374e'),
      //     sinceTimestamp: new UnixTime(1656354769),
      //     tokens: ['USDD'],
      //   },
      {
        address: EthereumAddress('0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c'),
        sinceTimestamp: new UnixTime(1656108257),
        tokens: ['ETH'],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: discovery.getContract('Router').address,
        name: 'StarGate Router',
        description:
          'Entry point for the user interaction with StarGate Bridge, handles the logic of swaps and adding liquidity, send messages to the bridge.',
      },
      {
        address: discovery.getContract('Bridge').address,
        name: 'StarGate Bridge',
        description:
          'Main bridge contract, receives messages from LayerZero Endpoint, stores bridge configuration.',
      },
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
      {
        address: discovery.getContract('Endpoint').address,
        name: 'Endpoint',
        description: 'LayerZero Ethereum Endpoint.',
      },
      //Probably outdated
      {
        address: EthereumAddress('0x5B19bd330A84c049b62D5B0FC2bA120217a18C1C'),
        name: 'UltraLightNode',
        description:
          'LayerZero UltraLight Node. Used by oracles to checkpoint source chain block hashes.',
      },
      {
        address: discovery.getContract('UltraLightNodeV2').address,
        name: 'UltraLightNodeV2',
        description: 'LayerZero UltraLight Node.',
      },
      {
        address: EthereumAddress('0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56'),
        name: 'USDC Pool',
        description: 'USDC Pool.',
      },
      {
        address: EthereumAddress('0x38EA452219524Bb87e18dE1C24D3bB59510BD783'),
        name: 'USDT Pool',
        description: 'USDT Pool.',
      },
      {
        address: EthereumAddress('0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c'),
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
          address: EthereumAddress(
            '0x65bb797c2B9830d891D87288F029ed8dACc19705',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'StarGate Multisig',
      description: 'Bridge owner, can create new pools, chainpaths, set fees.',
    },
    {
      name: 'StarGate MultiSig Participants',
      accounts: discovery
        .getContractValue<string[]>(
          '0x65bb797c2B9830d891D87288F029ed8dACc19705',
          'getOwners',
        )
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        '0x65bb797c2B9830d891D87288F029ed8dACc19705',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>(
          '0x65bb797c2B9830d891D87288F029ed8dACc19705',
          'getOwners',
        ).length
      } StarGate MultiSig.`,
    },
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
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92',
          ),
          type: 'MultiSig',
        },
      ],
      name: 'LayerZero Multisig',
      description:
        'The owner of Endpoint, UltraLightNode and Treasury contracts. Can switch to a new UltraLightNode for an Endpoint. Can switch proof library for an UltraLightNode and change Treasury.',
    },
    {
      name: 'LayerZero MultiSig Participants',
      accounts: discovery
        .getContractValue<string[]>(
          '0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92',
          'getOwners',
        )
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        '0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>(
          '0xCDa8e3ADD00c95E5035617F970096118Ca2F4C92',
          'getOwners',
        ).length
      } LayerZero MultiSig.`,
    },
  ],
}
