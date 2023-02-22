import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS } from '../layer2s/common'
import { ProjectDiscovery } from '../layer2s/common/ProjectDiscovery'
import { RISK_VIEW } from './common'
import * as config from './lzOmnichain-config.json'
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
      'This page gathers Omnichain Tokens built on top of LayerZero AMB protocol. Risk associated with using any of them varies, depending on the technological decisions made by the developers. It is worth pointing out, that using LayerZero does not guarantee additional security, in only provides default infrastructure (Relayer, Oracle, Inbound and Outbound Library) which can be arbitrarily changed by the token owner.',
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
    escrows: config.escrows.map((escrow) => ({
      address: EthereumAddress(escrow.address),
      sinceTimestamp: new UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
    })),
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x462F7eC57C6492B983a8C8322B4369a7f149B859'),
        name: 'Default Inbound Proof Library',
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
