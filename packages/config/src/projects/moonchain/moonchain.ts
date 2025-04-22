import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  CONTRACTS,
  DATA_ON_CHAIN_L3,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'

const discovery = new ProjectDiscovery('moonchain', 'arbitrum')

const upgradesMoonchainAdmin = {
  upgradableBy: [{ name: 'Moonchain Admin', delay: 'no' }],
}

const MoonchainL1ContractAddress = discovery.getContract(
  'MoonchainL1Contract',
).address

const TIER_SGX = discovery.getContractValue<{
  verifierName: string
  validityBond: number
  contestBond: number
  cooldownWindow: number
  provingWindow: number
  maxBlocksToVerifyPerProof: number
}>('TierRouter', 'TIER_SGX')

const TIER_RISC0 = discovery.getContractValue<{
  verifierName: string
  validityBond: number
  contestBond: number
  cooldownWindow: number
  provingWindow: number
  maxBlocksToVerifyPerProof: number
}>('TierRouter', 'TIER_RISC0')

const TIER_SP1 = discovery.getContractValue<{
  verifierName: string
  validityBond: number
  contestBond: number
  cooldownWindow: number
  provingWindow: number
  maxBlocksToVerifyPerProof: number
}>('TierRouter', 'TIER_SP1')

const TIER_MINORITY_GUARDIAN = discovery.getContractValue<{
  verifierName: string
  validityBond: number
  contestBond: number
  cooldownWindow: number
  provingWindow: number
  maxBlocksToVerifyPerProof: number
}>('TierRouter', 'TIER_GUARDIAN_MINORITY')

const GuardianMinorityProverMinSigners = discovery.getContractValue<string[]>(
  'GuardianMinorityProver',
  'minGuardians',
)
const NumGuardiansMinorityProver = discovery.getContractValue<string[]>(
  'GuardianMinorityProver',
  'numGuardians',
)

const GuardianProverMinSigners = discovery.getContractValue<string[]>(
  'GuardianProver',
  'minGuardians',
)
const NumGuardiansProver = discovery.getContractValue<string[]>(
  'GuardianProver',
  'numGuardians',
)

const MoonchainL1ChainConfig = discovery.getContractValue<{
  [key: string]: number | string
}>('MoonchainL1Contract', 'getConfig')

const SGXcooldownWindow = formatSeconds(Number(TIER_SGX.cooldownWindow) * 60) // value in minutes
const SGXprovingWindow = formatSeconds(Number(TIER_SGX.provingWindow) * 60) // value in minutes
const SGXvalidityBond = utils.formatEther(TIER_SGX.validityBond) // value in MXC
const SGXcontestBond = utils.formatEther(TIER_SGX.contestBond) // value in MXC
const RISC0cooldownWindow = formatSeconds(TIER_RISC0.cooldownWindow * 60) // value in minutes
const RISC0provingWindow = formatSeconds(TIER_RISC0.provingWindow * 60) // value in minutes
const RISC0validityBond = utils.formatEther(TIER_RISC0.validityBond) // value in MXC
const RISC0contestBond = utils.formatEther(TIER_RISC0.contestBond) // value in MXC
const SP1cooldownWindow = formatSeconds(TIER_SP1.cooldownWindow * 60) // value in minutes
const SP1provingWindow = formatSeconds(TIER_SP1.provingWindow * 60) // value in minutes
const SP1validityBond = utils.formatEther(TIER_SP1.validityBond) // value in MXC
const SP1contestBond = utils.formatEther(TIER_SP1.contestBond) // value in MXC
const MinorityValidityBond = utils.formatEther(
  TIER_MINORITY_GUARDIAN.validityBond,
) // value in MOONCHAIN
const MinorityContestBond = utils.formatEther(
  TIER_MINORITY_GUARDIAN.contestBond,
) // value in MOONCHAIN

assert(
  RISC0cooldownWindow === SP1cooldownWindow &&
    RISC0provingWindow === SP1provingWindow &&
    RISC0validityBond === SP1validityBond &&
    RISC0contestBond === SP1contestBond &&
    SGXcooldownWindow === RISC0cooldownWindow,
  'The tier config assumptions have changed, plz review the technology section and riskView.stateValidation.',
)

const LivenessBond = utils.formatEther(MoonchainL1ChainConfig.livenessBond)

const numberActiveTiers =
  discovery.getContractValue<number[]>('TierRouter', 'getTierIds').length === 4

assert(
  numberActiveTiers,
  'Review the technology section and riskView.stateValidation since the number of active tiers changed.',
)

export const moonchain: ScalingProject = {
  id: ProjectId('moonchain'),
  capability: 'universal',
  addedAt: UnixTime(1680768480), // 2023-04-06T08:08:00Z
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  badges: [
    BADGES.L3ParentChain.Arbitrum,
    BADGES.VM.EVM,
    BADGES.DA.EthereumCalldata,
    BADGES.Other.BasedSequencing,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'MXCzkEVM Moonchain',
    slug: 'moonchain',
    stack: 'Taiko', // Moonchain is fork from taiko.
    // headerWarning: hasThreeTiers
    //   ? 'Validity proofs (SP1, RISC0) are currently disabled, leaving only the SGX tier (minimum tier) and the two Guardian tiers.'
    //   : undefined,
    description:
      'MXCzkEVM Moonchain is a Layer3 Ethereum-compatible Optimistic Rollup on Arbitrum, focused on data exchange and communication in the IoT DePIN sector.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://moonchain.com'],
      apps: [
        'https://bridge.moonchain.com/',
        'https://mns.moonchain.com/',
        'https://miningv2.matchx.io/',
        'https://swap.moonchain.com/',
        'https://nft.moonchain.com/',
      ],
      documentation: ['https://doc.moonchain.com/'],
      explorers: ['https://explorer.moonchain.com'],
      repositories: ['https://github.com/mxczkevm'],
      socialMedia: [
        'https://x.com/Moonchain_com',
        'https://linktr.ee/Moonchain_com',
        'https://medium.com/@Moonchain_com',
        'https://www.youtube.com/@Moonchain_com',
        'https://www.tiktok.com/@moonchain_com',
      ],
      rollupCodes: 'https://rollup.codes/taiko', // Moonchain use taiko rollup codes
    },
    liveness: {
      explanation:
        'MXCzkEVM Moonchain is an Optimistic rollup that posts blocks of L3 transaction data directly to Arbitrum (L2). For a transaction to be considered final, both a block and its parent block have to be proven on Arbitrum. State updates are a three step process: first blocks are proposed to Arbitrum, then they are proved, and lastly finalized after the challenge period has elapsed.',
    },
  },
  config: {
    associatedTokens: ['MXC'],
    escrows: [
      {
        // Shared ETH bridge
        address: EthereumAddress('0x4C3924E619E2eE83cFD565c1432cb621ca8af7A0'),
        sinceTimestamp: UnixTime(1739966389),
        tokens: ['ETH'],
        chain: 'arbitrum',
      },
      {
        // Shared ERC20 vault
        address: EthereumAddress('0x3160284BC2F4d7F5b170C70a0Ee0bC5333c7F39e'),
        sinceTimestamp: UnixTime(1739966396),
        tokens: '*',
        chain: 'arbitrum',
      },
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('arbitrum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: '0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a',
        sequencers: [],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: MoonchainL1ContractAddress,
          selector: '0xef16e845',
          functionSignature:
            'function proposeBlock(bytes _params, bytes _txList) payable returns (tuple(bytes32 l1Hash, bytes32 difficulty, bytes32 blobHash, bytes32 extraData, bytes32 depositsHash, address coinbase, uint64 id, uint32 gasLimit, uint64 timestamp, uint64 l1Height, uint16 minTier, bool blobUsed, bytes32 parentMetaHash, address sender) meta_, tuple(address recipient, uint96 amount, uint64 id)[] deposits_)',
          sinceTimestamp: UnixTime(1689166261),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: MoonchainL1ContractAddress,
          selector: '0x648885fb',
          functionSignature:
            'function proposeBlockV2(bytes _params, bytes _txList) returns (tuple meta_)',
          sinceTimestamp: UnixTime(1740002048),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: MoonchainL1ContractAddress,
          selector: '0x0c8f4a10',
          functionSignature:
            'function proposeBlocksV2(bytes[] _paramsArr, bytes[] _txListArr) returns (tuple[] metaArr_)',
          sinceTimestamp: UnixTime(1740002048),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: MoonchainL1ContractAddress,
          selector: '0x10d008bd',
          functionSignature:
            'function proveBlock(uint64 _blockId, bytes _input)',
          sinceTimestamp: UnixTime(1689166261),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: MoonchainL1ContractAddress,
          selector: '0x440b6e18',
          functionSignature:
            'function proveBlocks(uint64[] _blockIds, bytes[] _inputs, bytes _batchProof)',
          sinceTimestamp: UnixTime(1740002048),
        },
      },
    ],
  },
  chainConfig: {
    name: 'mxczkevm',
    chainId: 18686,
    explorerUrl: 'https://explorer.moonchain.com',
    sinceTimestamp: UnixTime(1689166261),
    gasTokens: ['MXC'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.moonchain.com',
        callsPerMinute: 500,
      },
      { type: 'blockscoutV2', url: 'https://explorer-v1.moonchain.com/api' },
    ],
  },
  type: 'layer3',
  riskView: {
    stateValidation: {
      description: `A multi-tier proof system is used. The tiers are SGX, ZK (RISC0, SP1), Minority Guardian, and Guardian (highest tier). A higher tier proof can challenge a lower one within the challenge period.
        The system allows for an invalid state to be finalized by compromised Guardians (the highest tier) and does not enforce ZK proofs.`,
      sentiment: 'bad',
      value: 'Multi-proofs',
      secondLine: `${SGXcooldownWindow} challenge period`,
    },
    dataAvailability: {
      ...DATA_ON_CHAIN_L3,
    },
    exitWindow: {
      description:
        'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
      sentiment: 'bad',
      value: 'None',
    },
    sequencerFailure: {
      description:
        'The system uses a based (or L1-sequenced) rollup sequencing mechanism. Users can propose L2 blocks directly on the Moonchain L1 contract. The Moonchain admin can pause block proposals without delay.',
      sentiment: 'good',
      value: 'Self sequence', // based rollup sequencing
    },
    proposerFailure: {
      description:
        'Provers can examine the proposed blocks on the MoonchainL1 contract, and generate SGX proofs for them. Currently, any prover providing a valid SGX attestation can register a SGX instance and create proofs for proposed blocks.',
      sentiment: 'good',
      value: 'Self propose',
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/mxczkevm/simple-mxc-node',
    },
  ),
  technology: {
    stateCorrectness: {
      name: 'Multi-tier proof system',
      description: `
Moonchain uses a multi-tier proof system to validate state transitions. There are five tiers: The SGX tier, two ZK tiers with RISC0 and SP1 verifiers, the ${GuardianMinorityProverMinSigners}/${NumGuardiansMinorityProver} Guardian tier and the ${GuardianProverMinSigners}/${NumGuardiansProver} Guardian tier (from lowest to highest).
Since the Guardian tiers are the highest, validity proofs can generally be overwritten by a single Guardian. Consequently, there is no way to force the RISC0 or SP1 tiers.

When proposing a batch (containing one or multiple blocks), the proposer is assigned the designated prover role for that batch and is required to deposit a liveness bond (${LivenessBond} MXC) as a commitment to prove the batch, which will be returned once the batch is proven.
The default (lowest) SGX tier has a proving window of ${SGXprovingWindow}, during which only the designated prover can submit the proof for the batch. Once elapsed, proving is open to everyone able to submit SGX proofs and a *validity bond*. The two ZK tiers have a proving window of ${RISC0provingWindow}.

After the proof is submitted and during its ${SGXcooldownWindow} *cooldown window*, anyone can dispute the batch by submitting a *contest bond*. Anyone can then prove this new dispute by submitting a *validity bond* as a commitment to win the respective higher-tier proof.
A *validity bond* is MXC ${SGXvalidityBond} for SGX vs ${RISC0validityBond} for ZK tiers, while a *contest bond* is MXC ${SGXcontestBond} for SGX vs. ${RISC0contestBond} for the two ZK tiers.
For the Minority guardian tier, *validity* and *contest bonds* are set to ${MinorityValidityBond} MXC and ${MinorityContestBond} MXC, respectively. The highest Guardian tier does not require bonds.

It is not required to provide a proof for the batch to submit a contestation. When someone contests, a higher level tier has to step in to prove the contested batch. Decision of the highest tier (currently the ${GuardianProverMinSigners}/${NumGuardiansProver} Guardian) is considered final.
If no one challenges the original SGX proof, it finalizes after ${SGXcooldownWindow} (the cooldown window).`,
      references: [
        {
          title: 'TierRouter.sol - Arbitrum source code, tier ids',
          url: 'https://arbiscan.io/address/0x5E7b1306B759240620E2fd76F49Ca63E371C23ac#code#F1#L16',
        },
        {
          title: 'MoonchainL1.sol - Arbitrum source code, liveness bond',
          url: 'https://arbiscan.io/address/0x54D8864e8855A7B66eE42B8F2Eaa0F2E06bd641a#code',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'a malicious block is proven by a compromised SGX instance or approved by Guardians.',
        },
      ],
    },
    dataAvailability: {
      name: 'All data required for proofs is published on chain',
      description:
        'All the data that is used to construct the system state is published on chain in the form of blobs. This ensures that it will be available for enough time.',
      references: [],
      risks: [],
    },
    operator: {
      name: 'The system uses a based sequencing mechanism',
      description: `The system uses a based (or L1-sequenced) sequencing mechanism. Anyone can sequence Moonchain L2 blocks by proposing them directly on the MoonchainL1 contract.
        The proposer of a block is assigned the designated prover role, and will be the only entity allowed to provide a proof for the block during the initial proving window.
        Currently, proving a block requires the block proposer to run an SGX instance. Proposing a block also requires depositing a liveness bond as a commitment to proving the block.
        Unless the block proposer proves the block within the proving window, it will forfeit its liveness bond to the MoonchainL1 smart contract.`,
      references: [
        {
          title:
            'MoonchainL1.sol - Etherscan source code, proposeBlock function',
          url: 'https://etherscan.io/address/0x5110634593Ccb8072d161A7d260A409A7E74D7Ca#code',
        },
      ],
      risks: [],
    },
    forceTransactions: {
      name: `Users can force any transaction`,
      description: `The system is designed to allow users to propose L2 blocks directly on L1.
        Note that this would require the user to run an SGX instance to prove the block, or forfeit the liveness bond of ${LivenessBond} MXC.
        The Moonchain Deployer can pause block proposals without delay.`,
      references: [],
      risks: [],
    },
    exitMechanisms: [
      // to do: double check exit mechanism
      {
        name: 'Regular exit',
        description: `The user initiates the withdrawal by submitting a regular transaction on this chain. When the block containing that transaction is finalized the funds become available for withdrawal on L1. Finally the user submits an L1 transaction to claim the funds. This transaction requires a merkle proof.`,
        risks: [],
        references: [],
      },
    ],
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('MoonchainL1Contract', {
          description:
            'This contract provides functionalities for sequencing, proving, and verifying batches.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('L1RollupAddressManager', {
          description:
            'This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('TierRouter', {
          description:
            'Contract managing and routing the multi-tier proof system.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('SgxVerifier', {
          description: 'Verifier contract for SGX proven batches.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('Risc0Verifier', {
          description: 'Verifier contract for ZK-proven batches.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('SP1Verifier', {
          description: 'Verifier contract for ZK-proven batches.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('GuardianMinorityProver', {
          description:
            'Verifier contract for batches proven by Guardian multisig minority.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('GuardianProver', {
          description:
            'Verifier contract for Guardian multisig proven batches.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('ProverSet', {
          description:
            "A contract that holds MXC token and acts as a Moonchain team owned proposer and prover proxy. This contract relays `proveBlock` calls to the MoonchainL1 contract so that msg.sender doesn't need to hold any MXC. There are several instances of this contract operated by different entities.",
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('SignalService', {
          description:
            'The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('AutomataDcapV3Attestation', {
          description: 'Contract managing SGX attestation certificates.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('MXCToken', {
          description:
            "Moonchain's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds.",
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('MoonchainBridge', {
          description: 'Shared bridge for Moonchain chains for bridged ETH.',
          ...upgradesMoonchainAdmin,
        }),
        discovery.getContractDetails('SharedERC20Vault', {
          description:
            'Shared vault for Moonchain chains for bridged ERC20 tokens.',
          ...upgradesMoonchainAdmin,
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Moonchain admin',
          discovery.getPermissionedAccounts('L1RollupAddressManager', 'owner'),
          'Currently also designated as the Security Council. Can upgrade proxies without delay, remove SGX attestation certificates, pause block proposals and block proving, among other permissions.',
        ),
        discovery.getPermissionDetails(
          'GuardianProvers',
          discovery.getPermissionedAccounts('GuardianProver', 'guardians'),
          `Guardians can prove blocks on the highest tier. Guardians are selected by the Moonchain admin. Acts as a ${GuardianProverMinSigners}/${NumGuardiansProver} multisig.`,
        ),
        discovery.getPermissionDetails(
          'GuardianMinorityProver',
          discovery.getPermissionedAccounts(
            'GuardianMinorityProver',
            'guardians',
          ),
          `Minority guardians can prove blocks on the second highest tier. Guardians are selected by the Moonchain admin. Acts as a ${GuardianMinorityProverMinSigners}/${NumGuardiansMinorityProver} multisig.`,
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/MXCfoundation/status/1679164001106763776',
      date: '2023-07-13T00:00:00.00Z',
      description: 'MXCzkEVM Mainnet is deployed on Arbitrum mainnet.',
      type: 'general',
    },
    {
      title: 'Moonchain Based Sequencing Upgrade',
      url: 'https://x.com/Moonchain_com/status/1892934410992771224',
      date: '2025-02-21T00:00:00.00Z',
      description: 'Proposing blocks on Moonchain is now permissionless.',
      type: 'general',
    },
  ],
}
