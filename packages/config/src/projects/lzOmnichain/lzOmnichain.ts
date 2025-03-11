import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { CONTRACTS } from '../../common'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { languageJoin } from '../../utils/languageJoin'
import {
  INBOUND_PROOF_LIBRARIES,
  OMNICHAIN_ESCROWS,
  OMNICHAIN_TOKENS,
  ORACLES,
  RELAYERS,
} from './lzOmnichain.contracts'

const discovery = new ProjectDiscovery('lzomnichain')

export const lzOmnichain: Bridge = {
  type: 'bridge',
  id: ProjectId('lzomnichain'),
  addedAt: UnixTime(1677513767), // 2023-02-27T16:02:47Z
  display: {
    name: 'Omnichain (LayerZero)',
    slug: 'omnichain',
    warning:
      'The security parameters of each individual token must be individually assessed, and can be changed by the developers. Omnichain tokens are in the early stages of development, use at your own risk.',
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
      'This page gathers Omnichain Tokens built on top of LayerZero AMB protocol that have a market cap over 100k USD.',
    detailedDescription:
      'Currently they are: ' +
      languageJoin(OMNICHAIN_TOKENS) +
      '. Risk associated with using any of them varies, depending on the technological decisions made by the developers.\
       LayerZero as a framework to build omnichain application does not provide any base security as applications can define their own security settings,\
       however applications and tokens choosing the default security settings will leverage security provided by default Oracle, Relayer, Verification Library and Proof Library.\
       Default settings are managed by LayerZero team.',
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing proof of the transfer event.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description:
        "Omnichain tokens can be individually upgradable and it's security assumptions must be individually assessed for each individual token.",
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Various'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Omnichain tokens are tokenized Token Bridges. Usually, one chain is designated as main and acts as a token escrow. In this case, transfers from the main chain are done using typical lock-mint model. Transfers between\
        other (non-main) chains are made using burn-mint model. The implementation details may vary between each individual omnichain token and must be individually assessed.',
      risks: [],
      references: [],
    },
    validation: {
      name: 'Oracles and Relayers',
      description:
        'Omnichain tokens are built on top of LayerZero protocol. LayerZero relies on Oracles to periodically submit source chain block hashes to the destination chain.\
        Once block hash is submitted, Relayers can provide the proof for the transfers. The Oracle and Relayer used can be either default LayerZero contracts, or custom built by the token developers.',
      references: [
        {
          title: 'LayerZero security model analysis',
          url: 'https://medium.com/l2beat/circumventing-layer-zero-5e9f652a5d3e',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'oracles or relayers fail to facilitate the transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'oracles and relayers collude to submit fraudulent block hash and relay fraudulent transfer.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'omnichain token owner changes Oracle/Relayer pair for their own.',
        },
      ],
      isIncomplete: true,
    },
  },
  config: {
    escrows: OMNICHAIN_ESCROWS,
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
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
        ...INBOUND_PROOF_LIBRARIES.map((l) =>
          discovery.getContractDetails(
            l,
            'Contracts used to validate messages coming from source chains.',
          ),
        ),
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
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Default Relayer',
          discovery.formatPermissionedAccounts(RELAYERS),
          'Contract authorized to relay messages and - as a result - withdraw funds from the bridge.',
        ),
        discovery.getPermissionDetails(
          'Default Oracles',
          discovery.formatPermissionedAccounts(ORACLES),
          'Contracts that submit source chain block hashes to the destination chain.',
        ),
        discovery.getMultisigPermission(
          'LayerZero Multisig',
          'Contract authorize to update default security parameters (Relayer, Oracle, Libraries). Owner of the Endpoint and UltraLightNodeV2 contract.',
        ),
      ],
    },
  },
}
