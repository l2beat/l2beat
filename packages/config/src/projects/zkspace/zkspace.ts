import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { zkswap } from '../zkswap/zkswap'

const discovery = new ProjectDiscovery('zkspace')

const upgradeDelay = HARDCODED.ZKSPACE.UPGRADE_NOTICE_PERIOD
const upgradeDelayString = formatSeconds(upgradeDelay)
const forcedWithdrawalDelay = HARDCODED.ZKSPACE.PRIORITY_EXPIRATION_PERIOD
const finalizationPeriod = 0

const upgradeability = {
  upgradableBy: [{ name: 'zkSpace Admin', delay: upgradeDelayString }],
}

export const zkspace: ScalingProject = {
  type: 'layer2',
  id: ProjectId('zkspace'),
  capability: 'appchain',
  addedAt: UnixTime(1629199654), // 2021-08-17T11:27:34Z
  badges: [
    BADGES.VM.AppChain,
    BADGES.DA.EthereumCalldata,
    BADGES.Fork.ZKsyncLiteFork,
  ],
  display: {
    name: 'ZKBase',
    slug: 'zkspace',
    description:
      'ZKBase is an infrastructure protocol based on Zero-Knowledge (ZK) proof technology. It aims to support various projects across the Bitcoin and Ethereum networks.',
    purposes: ['NFT', 'Exchange', 'Payments'],
    stacks: ['ZKsync Lite'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://zkbase.org/'],
      bridges: ['https://zkbase.app'],
      documentation: ['https://en.wiki.zks.org/'],
      explorers: ['https://explorer.zkbase.app/'],
      repositories: ['https://github.com/l2labs/zkswap-contracts'],
      socialMedia: [
        'https://discord.gg/MJKtaYcYw8',
        'https://twitter.com/ZKBaseOfficial',
        'https://t.me/ZKSpaceOfficial',
        'https://medium.com/zkswap',
      ],
    },
    liveness: {
      explanation:
        'ZK Space is a ZK rollup based on ZKsync Lite’s code base that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. ',
    },
  },
  config: {
    associatedTokens: ['ZKS'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
        ),
        sinceTimestamp: UnixTime(1639569183),
        tokens: '*',
      }),
    ],
    trackedTxs: [
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
          ),
          selector: '0x6898e6fc',
          functionSignature:
            'function verifyBlocks(uint32 _blockNumberFrom, uint32 _blockNumberTo, uint256[] _recursiveInput, uint256[] _proof, uint256[] _subProofLimbs)',
          sinceTimestamp: UnixTime(1639569183),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(forcedWithdrawalDelay),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
  },
  stage: getStage(
    {
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
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      additionalConsiderations: {
        short:
          'ZKBase provides the infrastructure for token transfer, swaps and NFT minting. Arbitrary contracts are not supported.',
        long: 'ZKBase provides the infrastructure for token transfer, swaps and NFT minting. Arbitrary contracts are not supported.',
      },
    },
  ),
  stateValidation: zkswap.stateValidation,
  technology: {
    dataAvailability: zkswap.technology?.dataAvailability,
    operator: zkswap.technology?.operator,
    forceTransactions: zkswap.technology?.forceTransactions,
    exitMechanisms: zkswap.technology?.exitMechanisms,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('ZkSync', {
          description:
            'The main Rollup contract. Operator commits blocks, provides ZK proof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
          ...upgradeability,
        }),
        discovery.getContractDetails('Governance', {
          description:
            'Keeps a list of block producers and whitelisted tokens.',
          ...upgradeability,
        }),
        discovery.getContractDetails('UniswapV2Factory', {
          description: 'Manages trading pairs.',
          ...upgradeability,
        }),
        discovery.getContractDetails('ZkSeaNFT', {
          description:
            'Contract managing deposits and withdrawals of NFTs to ScalingProject.',
          ...upgradeability,
        }),
        discovery.getContractDetails('Verifier', {
          description: 'zkSNARK Plonk Verifier.',
          ...upgradeability,
        }),
        discovery.getContractDetails('VerifierExit', {
          description: 'zkSNARK Verifier for the escape hatch.',
          ...upgradeability,
        }),
        discovery.getContractDetails(
          'UpgradeGatekeeper',
          'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelayString)],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'zkSpace Admin',
          discovery.getPermissionedAccounts('UpgradeGatekeeper', 'getMaster'),
          'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager, ZkSeaNFT and ZkSync contracts.',
        ),
        discovery.getPermissionDetails(
          'Active validator',
          discovery.getPermissionedAccounts('Governance', 'validators'),
          'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSpace Admin.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'ZKSpace Officially Upgrades to ZKBase',
      url: 'https://zkbaseofficial.medium.com/zkbase-is-undergoing-a-brand-new-upgrade-and-setting-sail-again-in-2024-3d71418a10e1',
      date: '2023-12-29T00:00:00Z',
      description: 'The ZKSpace team has rebranded to ZKBase.',
      type: 'general',
    },
    {
      title: 'ZKSpace launched',
      url: 'https://medium.com/zkswap/l2-labs-launches-all-in-one-layer2-platform-zkspace-featuring-zkswap-v3-0-nfts-payments-82dae7d9207c',
      date: '2021-12-20T00:00:00Z',
      description:
        'All-in-One ScalingProject Platform ZKSpace, Featuring ZKSwap v3.0, NFTs, & Payments is launched.',
      type: 'general',
    },
    {
      title: 'Token Deposit Campaign started',
      url: 'https://medium.com/@zkspaceofficial/zkspace-releases-token-deposit-campaign-with-fascinating-zks-rewards-151e2492549e',
      date: '2022-02-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
