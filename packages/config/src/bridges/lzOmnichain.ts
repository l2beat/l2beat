import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS } from '../layer2s/common'
import { ProjectDiscovery } from '../layer2s/common/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('lzOmnichain')

export const lzOmnichain: Bridge = {
  type: 'bridge',
  id: ProjectId('lzomnichain'),
  display: {
    name: 'Omnichain (LayerZero)',
    slug: 'omnichain',
    links: {
      websites: ['https://layerzero.network/'],
      repositories: [
        'https://github.com/LayerZero-Labs/',
        'https://github.com/stargate-protocol',
      ],
      socialMedia: ['https://twitter.com/StargateFinance'],
    },
    description:
      'Omnichain tokens are built on top of LayerZero AMB protocol. They inherit its security and add on top of it their own additional security assumptions.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        "Omnichain tokens can be individually upgradable and it's security assumptions must be individually assessed for each individual token.",
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Various'],
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Omnichain tokens are tokenized Token Bridges. One chain is designated as main and acts as an token escrow. Transfers from the main chain are done using typical lock-mint model. Transfers between\
        other (non-main) chains are made using burn-mint model. The implementation details may vary between each individual omnichain token and must be individually assessed.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracles and Relayers',
      description:
        'Omnichain tokens are built on top of LayerZero protocol. LayerZero relies on Oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, Relayers can provide the merkle proof for the transfers. Omnichain token owner can withdraw all funds from the bridge escrow\
        by changing Oracle/Relayer pair.',
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
        {
          category: 'Funds can be stolen if',
          text: 'omnichain token owner changes Oracle/Relayer pair for their own.',
          isCritical: true,
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6'),
        sinceTimestamp: new UnixTime(1647504559),
        tokens: ['STG'],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: discovery.getContract('StargateToken').address,
        name: 'StargateToken',
        description: 'StarGate (STG) omnichain token.',
      },
      {
        address: discovery.getContract('Endpoint').address,
        name: 'Endpoint',
        description:
          'Layer Zero Enpoint contract used for cross-chain messaging.',
      },
      {
        address: discovery.getContract('UltraLightNodeV2').address,
        name: 'UltraLightNodeV2',
        description: 'LayerZero default send and receive library.',
      },
      {
        address: discovery.getContract('TreasuryV2').address,
        name: 'TreasuryV2',
        description: 'LayerZero contract responsible for fees mechanism.',
      },
      {
        address: discovery.getContract('NonceContract').address,
        name: 'NonceContract',
        description: 'LayerZero nonce contract.',
      },
      {
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
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK, CONTRACTS.UPGRADE_NO_DELAY_RISK],
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
      name: 'StarGate owner',
      description:
        'Can pause STG token, can configure Oracle/Relayer of Layer Zero AMB bridge, can set/change destination address of STG token for any chain.',
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
      name: 'Omnichain Tokens Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
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
      description: 'Owner of the Endpoint and UltraLightNodeV2 contract.',
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
