import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, NUGGETS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import {
  INBOUND_PROOF_LIBRARIES,
  OMNICHAN_ESCROWS,
  ORACLES,
  RELAYERS,
} from './lzOmnichain.contracts'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('lzomnichain')

export const lzOmnichain: Bridge = {
  type: 'bridge',
  id: ProjectId('lzomnichain'),
  display: {
    name: 'Omnichain (LayerZero)',
    slug: 'omnichain',
    warning:
      'The security parameters of each individual token must be individually assessed, and can be changed by the developers. Omnichain tokens are are in the early stages of development, use at your own risk.',
    category: 'Token Bridge',
    links: {
      websites: ['https://layerzero.network/'],
      repositories: [
        'https://github.com/LayerZero-Labs/',
        'https://github.com/stargate-protocol',
        'https://github.com/harmony-one/layerzero-bridge.frontend',
      ],
      documentation: [
        'https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids',
      ],
      socialMedia: ['https://twitter.com/LayerZero_Labs'],
    },
    description:
      'This page gathers Omnichain Tokens built on top of LayerZero AMB protocol',
    detailedDescription:
      'Currently they are: STG, Harmony Bridge OFT, BOBA, STONE, WAGMI and agEUR. Risk associated with using any of them varies, depending on the technological decisions made by the developers. LayerZero as a framework to build omnichain application does not provide any base security as applications can define their own security settings, however applications and tokens choosing the default security settings will leverage security provided by default Oracle, Relayer, Verification Library and Proof Library. Default settings are managed by LayerZero team.',
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
    escrows: OMNICHAN_ESCROWS,
  },
  contracts: {
    addresses: [
      {
        multipleAddresses: OMNICHAN_ESCROWS.map((e) => e.address),
        name: 'Omnichain Tokens (OFT)',
        description:
          'Contracts using LayerZero smart contracts to transfer tokens between chains. The implementation details may vary between each individual omnichain token and must be individually assessed. LayerZero as a framework to build omnichain application does not provide any base security as applications can define their own security settings, however applications and tokens choosing the default security settings will leverage security provided by default Oracle, Relayer, Verification Library and Proof Library. Default settings are managed by LayerZero team.',
      },
      discovery.getContractDetails(
        'TSS Oracle',
        'Contract used to submit source chain block hashes. One of the default Oracles.',
      ),
      discovery.getContractDetails(
        'Google Cloud Oracle',
        'Contract used to submit source chain block hashes. One of the default Oracles.',
      ),
      discovery.getContractDetails(
        'LayerZero Relayer',
        'Contract used to provide the merkle proof for the transfers on source chains.',
      ),
      {
        multipleAddresses: INBOUND_PROOF_LIBRARIES,
        name: 'Default LayerZero Inbound Proof Libraries',
        description:
          'Contracts used to validate messages coming from source chains.',
      },
      discovery.getContractDetails(
        'Endpoint',
        'Contract used for cross-chain messaging.',
      ),
      discovery.getContractDetails(
        'UltraLightNodeV2',
        'Default send and receive library.',
      ),
      discovery.getContractDetails(
        'TreasuryV2',
        'Contract responsible for fee mechanism.',
      ),
      discovery.getContractDetails('NonceContract'),
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK, CONTRACTS.UPGRADE_NO_DELAY_RISK],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: RELAYERS.map((address) =>
        discovery.formatPermissionedAccount(address),
      ),
      name: 'Default Relayer',
      description:
        'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
    },
    {
      accounts: ORACLES.map((address) =>
        discovery.formatPermissionedAccount(address),
      ),
      name: 'Default Oracles',
      description:
        'Contracts that submit source chain block hashes to the destination chain.',
    },
    ...discovery.getMultisigPermission(
      'LayerZero Multisig',
      'Contract authorize to update default security parameters (Relayer, Oracle, Libraries). Owner of the Endpoint and UltraLightNodeV2 contract.',
    ),
  ],
  knowledgeNuggets: [
    {
      title: 'Security models: isolated vs shared',
      url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
  ],
}
