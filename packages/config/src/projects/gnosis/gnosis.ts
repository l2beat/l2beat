import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('gnosis')

const chainId = 100

const bridgeGovernance = {
  upgradableBy: [{ name: 'Gnosis Bridge Multisig (Ethereum)', delay: 'no' }],
}

const xDaiBridgeRequiredSignatures = discovery.getContractValue<number>(
  'XDaiForeignBridge',
  'requiredSignatures',
)

const xDaiBridgeValidatorCount = discovery.getContractValue<number>(
  'XDai Bridge Validators',
  'validatorCount',
)

const ambBridgeRequiredSignatures = discovery.getContractValue<number>(
  'ForeignAMB',
  'requiredSignatures',
)

const ambBridgeValidatorCount = discovery.getContractValue<number>(
  'AMB Validators',
  'validatorCount',
)

const xDaiBridgeHashiMandatory = discovery.getContractValue<boolean>(
  'XDaiForeignBridge',
  'HASHI_IS_MANDATORY',
)

const ambHashiMandatory = discovery.getContractValue<boolean>(
  'ForeignAMB',
  'HASHI_IS_MANDATORY',
)

export const gnosis: ScalingProject = {
  type: 'layer2',
  id: ProjectId('gnosis'),
  capability: 'universal',
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
  reasonsForBeingOther: [
    {
      ...REASON_FOR_BEING_OTHER.NO_PROOFS,
      explanation:
        'Gnosis Chain has an external validator set that validates its state transitions. This is an additional trust assumption since Ethereum does not, the external validators do not commit or stake anything on Ethereum.',
    },
  ],
  display: {
    name: 'Gnosis Chain',
    shortName: undefined,
    aliases: ['xDai'],
    slug: 'gnosis',
    purposes: ['Universal'],
    description:
      'Gnosis Chain is a community-owned EVM-based sidechain operated by a proof-of-stake validator set aiming to be the first chain in the Ethereum Economic Zone (EEZ). Its canonical Ethereum bridge is validated by dedicated bridge validator multisigs (not the PoS validator set) and supports the native xDAI bridge, AMB messages, and Omnibridge token transfers. This page looks at both the PoS chain and the canonical bridge to Ethereum from an Ethereum-centric perspective.',
    detailedDescription:
      "Gnosis chain in its current form does not derive or benefit from Ethereum's decentralisation apart from being developed as a close fork to re-use Ethereum tooling and infrastructure. Its censorship resistance relies on an open validator set with over 100 thousand diverse validators, although the clustering and stake distribution among entities is intransparent. Users who are censored selectively on an otherwise live network benefit from the fast 5s block time and non-committee-gated, stake-weighted proposer rotation, resulting in an inclusion probability of 99% in less than a minute even if up to 50% of the Gnosis stake is censoring them. There are also a few thousand validators who run custom 'shutter network' nodes that support threshold-encrypted transactions. For a case of active blanket censorship (>50% stake) by all current validators, users have no way apart from a hardfork to get their transactions included or save the chain. In the operator walkaway scenario, new sequencers could stake and join the set permissionlessly.",
    links: {
      websites: ['https://gnosis.io/chain'],
      explorers: ['https://gnosisscan.io/', 'https://gnosis.blockscout.com/'],
      bridges: ['https://bridge.gnosischain.com'],
      repositories: ['https://github.com/gnosischain'],
      documentation: ['https://docs.gnosischain.com/'],
      socialMedia: [
        'https://x.com/gnosischain',
        'https://discord.com/invite/gnosis',
        'https://t.me/gnosischain',
        'https://forum.gnosis.io/',
        'https://gnosis.io/blog',
      ],
    },
  },
  proofSystem: undefined,
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['GNO'],
    escrows: [
      discovery.getEscrowDetails({
        // xDAI bridge escrow, currently accepting USDS and still supporting DAI withdrawals.
        address: ChainSpecificAddress(
          'eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016',
        ),
        sinceTimestamp: UnixTime(1573689600),
        tokens: ['DAI', 'USDS', 'sDAI'],
        ...bridgeGovernance,
      }),
      discovery.getEscrowDetails({
        // Omnibridge escrow for ERC20 assets bridged from Ethereum to Gnosis.
        address: ChainSpecificAddress(
          'eth:0x88ad09518695c6c3712AC10a214bE5109a655671',
        ),
        tokens: '*',
        excludedTokens: ['DAI', 'USDS', 'sDAI'],
        ...bridgeGovernance,
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'gnosis',
    chainId,
    gasTokens: ['XDAI'],
    explorerUrl: 'https://gnosisscan.io',
    sinceTimestamp: UnixTime(1539028166),
    coingeckoPlatform: 'xdai',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 21022491,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.gnosischain.com',
        callsPerMinute: 300,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://gnosis.blockscout.com/api/v2' },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.GNOSIS_DA,
    bridge: {
      value: 'Gnosis validators',
      sentiment: 'warning',
      description:
        'Transaction data is published to Gnosis Chain and made available by its proof-of-stake validator network. Ethereum contracts do not receive transaction data or data commitments.',
    },
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        'Ethereum contracts do not validate Gnosis Chain state transitions. Bridge messages are accepted after threshold signatures from dedicated bridge validators.',
    },
    dataAvailability: RISK_VIEW.DATA_POS_NOBRIDGE,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: {
      value: 'Decentralized Sequencer Set',
      sentiment: 'good',
      description:
        'Users can permissionlessly become a sequencer (validator) by staking a minimum of 1 GNO to join the queue and wait to obtain block production rights. There is no specific censorship resistance mechanism against selective censorship by parts of the active validator set nor a way to force transactions from Ethereum L1.', // TODO: rm hardcode
    },
    proposerFailure: {
      value: 'Cannot withdraw',
      description: `The Gnosis Chain bridge is not validated by its PoS validator set. Withdrawals through the xDAI bridge require ${xDaiBridgeRequiredSignatures}/${xDaiBridgeValidatorCount} validator signatures, while AMB and Omnibridge withdrawals require ${ambBridgeRequiredSignatures}/${ambBridgeValidatorCount} validator signatures. The bridge validators can freeze bridge transactions and/or steal bridge-locked and minted assets. Transactions on Gnosis Chain itself cannot be forced from Ethereum. If the chain has a liveness failure due to blanket censorship or operator walkaway the only recourse are new validators joining the open validator set.`,
      sentiment: 'bad',
    },
  },
  stateValidation: {
    categories: [
      {
        title: 'No state validation',
        description: `Gnosis Chain is an independent proof-of-stake chain. Ethereum contracts do not check whether Gnosis state transitions are valid. Cross-chain messages are executed when the relevant bridge contract receives enough validator signatures: ${xDaiBridgeRequiredSignatures}/${xDaiBridgeValidatorCount} for the xDAI bridge and ${ambBridgeRequiredSignatures}/${ambBridgeValidatorCount} for AMB and Omnibridge.`,
        references: [
          {
            title: 'xDAI Bridge documentation',
            url: 'https://docs.gnosischain.com/bridges/About%20Token%20Bridges/xdai-bridge',
          },
          {
            title: 'Omnibridge documentation',
            url: 'https://docs.gnosischain.com/bridges/About%20Token%20Bridges/omnibridge',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'bridge validators sign fraudulent messages that release more assets on Ethereum than were burned or locked on Gnosis.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the Gnosis validator set finalizes an invalid chain state and the bridge validators sign messages derived from it.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'bridge validators stop signing messages or Gnosis Chain stops finalizing blocks.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      name: 'Transaction data is stored on Gnosis Chain',
      description:
        'Gnosis Chain transaction data is published to Gnosis Chain and propagated by its validator and node network. The Ethereum bridge contracts do not verify data availability and only process bridge messages after bridge-validator signatures are submitted.',
      references: [
        {
          title: 'Gnosis specifications',
          url: 'https://docs.gnosischain.com/about/specs/',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'transaction data is unavailable and bridge validators cannot reconstruct or sign the messages needed to exit.',
        },
      ],
    },
    otherConsiderations: [
      {
        name: 'Hashi validation is not mandatory',
        description: `Hashi managers are configured for the xDAI bridge and AMB bridge, but Hashi validation is not mandatory for either path. The current mandatory flags are ${xDaiBridgeHashiMandatory ? 'enabled' : 'disabled'} for the xDAI bridge and ${ambHashiMandatory ? 'enabled' : 'disabled'} for AMB, so the bridge can rely on validator multisigs without requiring Hashi agreement.`,
        references: [
          {
            title: 'Bridge management documentation',
            url: 'https://docs.gnosischain.com/bridges/management/',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'bridge validators sign a fraudulent message and optional Hashi validation does not prevent execution.',
          },
        ],
      },
      {
        name: 'Encrypted mempool (Shutter Network Beta)',
        description:
          "A subset of Gnosis Chain validators is currently running a modified node version that supports threshold-encrypted transaction payloads. This allows to 'encrypt the mempool' and protect against malicious MEV and censorship with significant caveats. To encrypt the transaction, users have to either use custom wallets or a trusted encrypting rpc proxy. Decryption is handled by participating validators sharing their decryption key shares at the target block, allowing the proposer to decrypt the transaction and include and execute (or censor) it.",
        references: [
          {
            title: 'Shutterized Gnosis Chain Beta Release',
            url: 'https://blog.shutter.network/shutterized-gnosis-chain-is-now-live/',
          },
          {
            title: 'Gnosis Docs: Shutterized Gnosis Chain',
            url: 'https://docs.gnosischain.com/shutterized-gc/',
          },
        ],
        risks: [],
      },
      {
        name: 'Destination tokens can be upgradeable',
        description:
          'Omnibridge uses token factories to deploy wrapped ERC20 representations for assets native to the other chain. The token factory owner can change the implementation used for newly deployed wrapped tokens.',
        references: [
          {
            title: 'Omnibridge documentation',
            url: 'https://docs.gnosischain.com/bridges/About%20Token%20Bridges/omnibridge',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'a malicious or vulnerable wrapped token implementation is configured for newly bridged assets.',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: discovery.getDiscoveredPermissions(),
  discoveryInfo: getDiscoveryInfo([discovery]),
  milestones: [
    {
      title: 'Fusaka upgrade',
      url: 'https://github.com/gnosischain/specs',
      date: '2026-04-14T00:00:00Z',
      description: 'Gnosis Chain activates its Fusaka network upgrade.',
      type: 'general',
    },
    {
      title: 'USDS migration on xDAI bridge',
      url: 'https://docs.gnosischain.com/bridges/management/decisions',
      date: '2025-11-07T00:00:00Z',
      description:
        'The xDAI bridge makes USDS the default Ethereum-side backing asset.',
      type: 'general',
    },
    {
      title: 'Pectra upgrade',
      url: 'https://github.com/gnosischain/specs',
      date: '2025-04-30T00:00:00Z',
      description: 'Gnosis Chain activates its Pectra network upgrade.',
      type: 'general',
    },
    {
      title: 'Gnosis Chain Merge',
      url: 'https://docs.gnosischain.com/about/specs/hard-forks/merge',
      date: '2022-12-08T00:00:00Z',
      description:
        'Gnosis Chain switches from AuRa proof of authority to proof of stake.',
      type: 'general',
    },
    {
      title: 'xDAI and Gnosis merge',
      url: 'https://forum.gnosis.io/t/gip-16-gnosis-chain-xdai-gnosis-merge/1904',
      date: '2021-11-08T00:00:00Z',
      description:
        'The xDAI and Gnosis communities propose combining their ecosystems under the Gnosis Chain name.',
      type: 'general',
    },
  ],
}
