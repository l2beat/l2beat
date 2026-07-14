import {
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_MODES,
  EXITS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { robinhood } from '../robinhood/robinhood'

const discovery = new ProjectDiscovery('lighter-robinhood')

const priorityExpiration = discovery.getContractValue<number>(
  'Lighter',
  'PRIORITY_EXPIRATION',
)

const upgradeDelay = discovery.getContractValue<number>(
  'UpgradeGatekeeper',
  'approvedUpgradeNoticePeriod',
)

const finalizationPeriod = 0 // state root immediately finalized when proven

const unsafeEscapeHatchRisk = {
  value: 'Unsafe escape hatch',
  description:
    'If operators stop processing priority requests, desert mode can be activated. The deployed DesertVerifier does not validate withdrawal proofs, allowing users to claim balances that are not part of the last verified state.',
  sentiment: 'bad',
  orderHint: Number.NEGATIVE_INFINITY,
} as const

const forceViaHostChainRisk = {
  value: 'Force via host chain',
  description: `Users can submit priority requests directly on Robinhood Chain. If a request remains unprocessed for more than ${formatSeconds(priorityExpiration)}, desert mode can be activated. The deployed DesertVerifier does not validate withdrawal proofs, so this mechanism does not provide a safe escape hatch.`,
  sentiment: 'warning',
  orderHint: priorityExpiration,
} as const

export const lighterRobinhood: ScalingProject = {
  id: ProjectId('lighter-robinhood'),
  type: 'layer3',
  hostChain: ProjectId('robinhood'),
  capability: 'appchain',
  addedAt: UnixTime(1782864000), // 2026-07-01T00:00:00Z
  badges: [BADGES.VM.AppChain, BADGES.DA.EthereumBlobs],
  display: {
    name: 'Lighter on Robinhood',
    shortName: 'Lighter RH',
    slug: 'lighter-robinhood',
    description:
      'Lighter on Robinhood is an application-specific ZK rollup deployed on Robinhood Chain. It is a fork of Lighter adapted to use Global Dollar (USDG) as its quote and margin asset.',
    purposes: ['Exchange'],
    links: {
      websites: ['https://lighter.xyz', 'https://robinhood.com/chain/'],
      explorers: ['https://robinhoodchain.blockscout.com/'],
      documentation: [
        'https://robinhood.com/us/en/support/articles/robinhood-wallet-perpetual-futures/',
        'https://docs.robinhood.com/chain/',
        'https://docs.lighter.xyz',
      ],
      repositories: [
        'https://github.com/elliottech/lighter-contracts',
        'https://github.com/elliottech/lighter-prover',
      ],
      socialMedia: [
        'https://x.com/Lighter_xyz',
        'https://x.com/RobinhoodApp',
        'https://discord.gg/lighterxyz',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('lighterprover'),
  },
  dataAvailability: {
    layer: {
      value: 'Robinhood Chain',
      secondLine: 'Calldata',
      sentiment: 'good',
      description:
        'Lighter state differences are posted as calldata on Robinhood Chain. Robinhood Chain ultimately posts its transaction data to Ethereum blobs.',
      projectId: ProjectId('robinhood'),
    },
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d',
        ),
        sinceTimestamp: UnixTime(1782477747),
        tokens: ['USDG'],
        description:
          'Main Lighter contract on Robinhood Chain. It escrows USDG used as margin and credits the corresponding balance inside Lighter.',
      }),
    ],
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, priorityExpiration),
    sequencerFailure: forceViaHostChainRisk,
    proposerFailure: unsafeEscapeHatchRisk,
  },
  stackedRiskView: {
    stateValidation: robinhood.riskView.stateValidation,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_L3,
    exitWindow: robinhood.riskView.exitWindow,
    sequencerFailure: robinhood.riskView.sequencerFailure,
    proposerFailure: unsafeEscapeHatchRisk,
  },
  stage: getRollupStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: false,
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
    },
    stage1: {
      principle: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
      noRedTrustedSetups: true,
      programHashesReproducible: false,
      proverSourcePublished: false,
      verifierContractsReproducible: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    dataAvailability: {
      name: 'State differences posted on Robinhood Chain',
      description:
        'The state differences required to reconstruct and prove the Lighter state are included directly in commitBatch calldata on Robinhood Chain. Unlike the Ethereum deployment, the Lighter contract does not read EIP-4844 blob hashes. Robinhood Chain subsequently batches its own transaction data to Ethereum blobs.',
      risks: [],
      references: [
        {
          title: 'Example commitBatch transaction on Robinhood Chain',
          url: 'https://robinhoodchain.blockscout.com/tx/0x73360fb1c909946ab6eba200a1dfc8c70065c04784dadcbc0ca090c1788fd7a3',
        },
        {
          title: 'Robinhood Chain architecture documentation',
          url: 'https://docs.robinhood.com/chain/',
        },
      ],
    },
    operator: {
      name: 'Centralized operators',
      description:
        'Only the centralized operators can submit batches and verify them with a ZK proof, i.e. advance the state of the protocol. The network governor can add or remove validators.',
      risks: [FRONTRUNNING_RISK],
      references: [],
    },
    forceTransactions: {
      name: 'Priority requests can be submitted on Robinhood Chain',
      description: `Users can submit priority requests directly to the Lighter contract on Robinhood Chain. If the operators leave the oldest request unprocessed for more than ${formatSeconds(priorityExpiration)}, anyone can activate desert mode. The deployed DesertVerifier does not validate withdrawal proofs, so desert mode does not provide a safe escape hatch.`,
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'desert mode is activated, because withdrawals are not constrained by a valid proof.',
          isCritical: true,
        },
      ],
      references: [
        {
          title: 'Lighter contract on Robinhood Chain',
          url: 'https://robinhoodchain.blockscout.com/address/0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d',
        },
      ],
    },
    exitMechanisms: [
      EXITS.REGULAR_WITHDRAWAL('zk'),
      {
        name: 'Unsafe desert-mode escape hatch',
        description:
          'After desert mode is activated, users are expected to exit by proving their balance against the last verified state root. The deployed DesertVerifier does not validate these proofs, so withdrawal balances are not constrained by the last verified state.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'desert mode is activated and users withdraw balances that are not part of the last verified state.',
            isCritical: true,
          },
        ],
        references: [
          {
            title: 'Deployed DesertVerifier on Robinhood Chain',
            url: 'https://robinhoodchain.blockscout.com/address/0x443cc0c7f773d0955e3bd8da393b708152cfa5bc',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'USDG is the quote and margin asset',
        description:
          'Unlike the Ethereum deployment, this fork uses Global Dollar (USDG) instead of USDC as the quote and margin asset.',
        risks: [],
        references: [
          {
            title: 'Robinhood Chain token contracts',
            url: 'https://docs.robinhood.com/chain/contracts/',
          },
          {
            title: 'Robinhood Wallet perpetual futures documentation',
            url: 'https://robinhood.com/us/en/support/articles/robinhood-wallet-perpetual-futures/',
          },
        ],
      },
      {
        name: 'External oracles used for index prices',
        description:
          'Lighter uses external oracles to determine index prices. External signatures are not verified by the settlement contract and the sequencer must be trusted to truthfully report data.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the oracle prices are manipulated.',
          },
        ],
        references: [
          {
            title: 'Lighter docs - Fair Price Marking',
            url: 'https://docs.lighter.xyz/perpetual-futures/fair-price-marking',
          },
        ],
      },
    ],
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid transactions to the previous state. These proofs are verified on Robinhood Chain by a smart contract. In desert mode, users are expected to provide proofs of their balances to exit, but the deployed DesertVerifier does not validate them.',
    categories: [
      {
        title: 'Verification Keys Generation',
        description:
          'Lighter uses a Plonk-based proof system which requires a trusted setup. The verification keys are hardcoded in the verifier contract on-chain. The Lighter prover repository contains a [script](https://github.com/elliottech/lighter-prover/blob/main/build_circuits.sh) that regenerates circuits and verification keys, but it does not reproduce the verification keys used by this deployment.',
        references: [
          {
            title: 'ZK Lighter verifier verification keys',
            url: 'https://robinhoodchain.blockscout.com/address/0xA3c70B197AcE329D9e09C753DA7874B78F1D00f4',
          },
        ],
      },
      {
        title: 'Validity proofs',
        description:
          'State updates are verified by the ZkLighterVerifier contract. In desert mode, the DesertVerifier does not validate withdrawal proofs, allowing users to withdraw balances that are not part of the last verified state.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'desert mode is activated and users withdraw balances that are not part of the last verified state.',
            isCritical: true,
          },
        ],
        references: [
          {
            title: 'Deployed DesertVerifier implementation',
            url: 'https://robinhoodchain.blockscout.com/address/0x443cc0c7f773d0955e3bd8da393b708152cfa5bc',
          },
        ],
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  upgradesAndGovernance: {
    content: `Regular upgrades are initiated by the "network governor" and executed with a ${formatSeconds(upgradeDelay)} delay. The "security council" can reduce the delay to zero in an emergency and does not currently satisfy the Stage 1 requirements. The network governor can also add or remove permissioned validators.`,
  },
  contracts: {
    addresses: {
      ...discovery.getDiscoveredContracts(),
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'desert mode is activated, because withdrawals are not constrained by a valid proof.',
        isCritical: true,
      },
      CONTRACTS.UPGRADE_NO_DELAY_RISK,
    ],
    zkVerifiers: getVerifiers(),
  },
  permissions: {
    ...discovery.getDiscoveredPermissions(),
  },
  milestones: [
    {
      title: 'Lighter contracts deployed on Robinhood Chain',
      url: 'https://robinhoodchain.blockscout.com/tx/0x56119cbe72da40648b646b402e71c66a174a4e0e62a10d3a90f9c3b0d8ecdad3',
      date: '2026-06-26T00:00:00Z',
      description:
        'The USDG-based Lighter fork is deployed on Robinhood Chain.',
      type: 'general',
    },
    {
      title: 'Robinhood launches Lighter perpetuals integration',
      url: 'https://robinhood.com/us/en/newsroom/robinhood-accelerates-global-expansion-robinhood-chain-mainnet-stock-tokens-agentic-trading/',
      date: '2026-07-01T00:00:00Z',
      description:
        'Robinhood announces Lighter perpetual futures in Robinhood Wallet on public mainnet.',
      type: 'general',
    },
  ],
}

function getVerifiers(): ChainSpecificAddress[] {
  const verifierProxy = discovery.getContractValue<ChainSpecificAddress>(
    'Lighter',
    'verifier',
  )

  // DesertVerifier is not included because it does not verify proofs.
  return discovery.get$Implementations(verifierProxy)
}
