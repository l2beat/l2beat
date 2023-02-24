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
      'This page gathers Omnichain Tokens built on top of LayerZero AMB protocol. Risk associated with using any of them varies, depending on the technological decisions made by the developers. LayerZero as a framework to build omnichain application does not provide any base security as applications can define their own security settings, however applications and tokens choosing the default security settings will leverage security provided by default Oracle, Relayer, Verification Library and Proof Library. Default settings are managed by LayerZero team.',
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
        Once block hash is submitted, Relayers can provide the merkle proof for the transfers. The Oracle and Relayer used can be either default LayerZero contracts, or custom built by the token developers.',
      references: [
        {
          text: 'LayerZero security model analysis',
          href: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
        },
      ],
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
      {
        address: EthereumAddress('0x4fa745fccc04555f2afa8874cd23961636cdf982'),
        sinceTimestamp: new UnixTime(1657699079),
        tokens: ['agEUR']
      },
      {
        address: EthereumAddress('0x1A36E24D61BC1aDa68C21C2Da1aD53EaB8E03e55'),
        sinceTimestamp: new UnixTime(1663003197),
        tokens: ['BOBA']
      },
      {
        address: EthereumAddress('0xb0003eb166654f7e57c0463f8d1a438eb238c490'),
        sinceTimestamp: new UnixTime(1661794745),
        tokens: ['BOBA']
      },
      {
        address: EthereumAddress('0x6f537839714761388b6d7ed61bc09579d5da2f41'),
        sinceTimestamp: new UnixTime(1660932033),
        tokens: ['BOBA']
      },
      {
        address: EthereumAddress('0xee381e476b4335b8584a2026f3e845edac2c69de'),
        sinceTimestamp: new UnixTime(1663802015),
        tokens: ['LINK']
      },
      {
        address: EthereumAddress('0x4F52b41a778761bd2EEa5b7b7ed8cBDAA02cEF3E'),
        sinceTimestamp: new UnixTime(1665428735),
        tokens: ['USDC']
      },
      {
        address: EthereumAddress('0xb5D4D94b82722EAFe067887a2FB596Bb37B3AAd2'),
        sinceTimestamp: new UnixTime(1669580819),
        tokens: ['MATIC']
      },
      {
        address: EthereumAddress('0x07b6eb9d3be334098e5af77185344bb3a34e0017'),
        sinceTimestamp: new UnixTime(1669581635),
        tokens: ['CRV']
      },
      {
        address: EthereumAddress('0xab6Ebe9472e2e4B6FE720Dad16701F32ab905CC6'),
        sinceTimestamp: new UnixTime(1666769735),
        tokens: ['WBTC']
      },
      {
        address: EthereumAddress('0x242d6e16653b30c830c1918b5cc23d27253b2d26'),
        sinceTimestamp: new UnixTime(1669583471),
        tokens: ['UNI']
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x902F09715B6303d4173037652FA7377e5b98089E'),
        name: 'Default LayerZero Relayer',
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
        name: 'Default LayerZero Oracle',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x967bAf657ec4d4b1cb00b06f7Cc6E8BA604e3AC8'),
          implementation: EthereumAddress(
            '0xA0Cc33Dd6f4819D473226257792AFe230EC3c67f',
          ),
        },
      },
      {
        address: EthereumAddress('0x462F7eC57C6492B983a8C8322B4369a7f149B859'),
        name: 'Default LayerZero Inbound Proof Library',
        description:
          'Contract used to validate messages coming from other chains.',
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
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK, CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x902F09715B6303d4173037652FA7377e5b98089E',
          ),
          type: 'Contract',
        },
      ],
      name: 'Default Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x5a54fe5234E811466D5366846283323c954310B2',
          ),
          type: 'Contract',
        },
      ],
      name: 'Default Oracle',
      description:
        'Contract that submits source chain block hashes to the destination chain.',
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
        'Contract authorize to update default security parameters (Relayer, Oracle, Libraries). Owner of the Endpoint and UltraLightNodeV2 contract.',
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
