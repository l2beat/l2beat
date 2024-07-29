import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Layer2 } from './types'
import {
  CONTRACTS,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { Badge } from '../badges'
import { RISK_VIEW } from '../../common/riskView'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('termstructure')

const expirationPeriod = discovery.getContractValue<number>(
  'ZkTrueUp',
  'EXPIRATION_PERIOD',
)

const upgrades = {
  upgradableBy: ['OwnerEOA'],
  upgradeDelay: 'None',
}

const treasuryWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).treasury / 100

const insuranceWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).insurance / 100

const vaultWeight =
  discovery.getContractValue<Record<string, number>>(
    'ZkTrueUp',
    'getFundWeight',
  ).vault / 100

export const termstructure: Layer2 = {
  id: ProjectId('termstructure'),
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'State diffs',
  }),
  badges: [
    Badge.VM.AppChain,
    Badge.DA.EthereumCalldata,
    Badge.Fork.ZKsyncLiteFork,
  ],
  display: {
    name: 'Term Structure',
    slug: 'termstructure',
    description:
      'Term Structure introduces a distinct ZK Rollup solution democratizing fixed-rate and fixed-term borrowing and lending as well as fixed income trading by offering low transaction fees and enabling forced withdrawals.',
    purposes: ['DeFi', 'Lending'],
    category: 'ZK Rollup',
    provider: 'ZKsync Lite',
    links: {
      websites: ['https://ts.finance/'],
      apps: ['https://app.ts.finance/'],
      documentation: ['https://docs.ts.finance/'],
      explorers: ['https://explorer.ts.finance/'],
      repositories: ['https://github.com/term-structure/'],
      socialMedia: [
        'https://twitter.com/TermStructLabs',
        'https://discord.gg/VnyTqGBSzK',
        'https://t.me/termstructure',
        'https://youtube.com/@termstructurelabs',
      ],
    },
    liveness: {
      explanation:
        'Term Structure is a ZK rollup based on ZKsync Lite’s code base that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. ',
    },
    finality: {
      finalizationPeriod: 0,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x09E01425780094a9754B2bd8A3298f73ce837CF9'),
        sinceTimestamp: new UnixTime(1716263903),
        tokens: '*',
      }),
    ],
    trackedTxs: [], // TODO: Add tracked transactions
  },
  type: 'layer2',
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x23369A60E5A8f422E38d799eD55e7AD8Ed4A86cE',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupFacet',
          references: [
            'https://etherscan.io/address/0x955cdD2E56Ca2776a101a552A318d28fe311398D#writeContract',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, expirationPeriod),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(expirationPeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {}, // TODO: Add technology details
  permissions: [
    {
      name: 'OwnerEOA',
      accounts: [discovery.getPermissionedAccount('ZkTrueUp', 'owner')],
      description:
        'Owner of the protocol, meaning it can upgrade the project implementation potentially gaining access to all funds.',
    },
    {
      name: 'Admins',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'ADMIN_ROLE',
      ),
      description:
        'Can update the main verifier, the evacuation verifier, can set the flash loan premium, set the half liquidation threshold, the liquidation factor, the borrow rate, the rollover fee, the withdraw protocol fee, the price feed, the stablecoin used, the minimum deposit amount and it can pause the system.',
    },
    ...discovery.getMultisigPermission(
      'TermStructureMultisig',
      'Set as a ZkTrueUp admin.',
    ),
    {
      name: 'Operators',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'OPERATOR_ROLE',
      ),
      description: 'Can add tokens to the system.',
    },
    {
      name: 'Committers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'COMMITTER_ROLE',
      ),
      description:
        'Can commit blocks on L1 and revert pending (i.e. not yet executed) blocks.',
    },
    {
      name: 'Verifiers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'VERIFIER_ROLE',
      ),
      description: 'Can verify blocks on L1.',
    },
    {
      name: 'Executers',
      accounts: discovery.getAccessControlRolePermission(
        'ZkTrueUp',
        'EXECUTER_ROLE',
      ),
      description: 'Can execute blocks on L1.',
    },
    ...discovery.getMultisigPermission(
      'VaultMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${vaultWeight}% of the fees.`,
    ),
    ...discovery.getMultisigPermission(
      'InsuranceMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${insuranceWeight}% of the fees.`,
    ),
    ...discovery.getMultisigPermission(
      'TreasuryMultisig',
      `Address collecting a portion of protocol fees. Currently set to ${treasuryWeight}% of the fees.`,
    ),
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('ZkTrueUp', {
        description:
          'Main contract of the system. It manages deposits, withdrawals, verification, permissions and DeFi operations.',
        ...upgrades,
      }),
      discovery.getContractDetails('Verifier', {
        description: 'Verifier contract used to verify the SNARK proofs.',
        ...upgrades,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
