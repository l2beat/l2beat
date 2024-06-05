import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { utils } from 'ethers'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('taiko')

const upgradesTaikoMultisig = {
  upgradableBy: ['TaikoAdmin'],
  upgradeDelay: 'No delay',
}

const chainWatchdog = discovery.getContractValue<string>(
  'TaikoL1Contract',
  'chain_watchdog',
)

// sequencer
const proposer = discovery.getContractValue<string>(
  'TaikoL1Contract',
  'proposer',
)

// sequencer for block 1
const proposerOne = discovery.getContractValue<string>(
  'TaikoL1Contract',
  'proposer_one',
)

const TaikoL1ContractAddress = discovery.getContract('TaikoL1Contract').address

const TIER_SGX = discovery.getContractValue<string[]>(
  'TierProvider',
  'TIER_SGX',
)

const TIER_MINORITY_GUARDIAN = discovery.getContractValue<string[]>(
  'TierProvider',
  'TIER_GUARDIAN_MINORITY',
)

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

const TaikoChainConfig = discovery.getContractValue<string>(
  'TaikoL1Contract',
  'getConfig',
)

const SGXcooldownWindow = formatSeconds(Number(TIER_SGX[3]) * 60) // value in minutes
const SGXprovingWindow = formatSeconds(Number(TIER_SGX[4]) * 60) // value in minutes
const SGXvalidityBond = utils.formatEther(TIER_SGX[1]) // value in TKO
const SGXcontestBond = utils.formatEther(TIER_SGX[2]) // value in TKO
const MinorityValidityBond = utils.formatEther(TIER_MINORITY_GUARDIAN[1]) // value in TKO
const MinorityContestBond = utils.formatEther(TIER_MINORITY_GUARDIAN[2]) // value in TKO

const LivenessBond = utils.formatEther(TaikoChainConfig[5])

export const taiko: Layer2 = {
  id: ProjectId('taiko'),
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (blobs)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transactions data',
  }),
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is an Ethereum-equivalent Optimistic Rollup on the Ethereum network. In the future it aims to add zkVerifier making it a hybrid, optimistic-zk construction. Taiko combines based sequencing and a contestation mechanism with multi-proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://taikoscan.io', 'https://taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Taiko is an Optimistic rollup that posts blocks of L2 transaction data directly to the L1. For a transaction to be considered final, both a block and its parent block have to be proven on the L1. State updates are a three step process: first blocks are proposed to L1, then they are proved, and lastly finalized after the challenge period has elapsed.',
    },
  },
  config: {
    escrows: [
      {
        // Shared ETH bridge
        address: EthereumAddress('0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC'),
        sinceTimestamp: new UnixTime(1714550603),
        tokens: ['ETH'],
      },
      {
        // Shared ERC20 vault
        address: EthereumAddress('0x996282cA11E5DEb6B5D122CC3B9A1FcAAD4415Ab'),
        sinceTimestamp: new UnixTime(1714550603),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.mainnet.taiko.xyz',
      defaultCallsPerMinute: 500,
      startBlock: 1,
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: TaikoL1ContractAddress,
          selector: '0xef16e845',
          functionSignature:
            'function proposeBlock(bytes _params, bytes _txList) payable returns (tuple(bytes32 l1Hash, bytes32 difficulty, bytes32 blobHash, bytes32 extraData, bytes32 depositsHash, address coinbase, uint64 id, uint32 gasLimit, uint64 timestamp, uint64 l1Height, uint16 minTier, bool blobUsed, bytes32 parentMetaHash, address sender) meta_, tuple(address recipient, uint96 amount, uint64 id)[] deposits_)',
          sinceTimestampInclusive: new UnixTime(1716620627),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: TaikoL1ContractAddress,
          selector: '0x10d008bd',
          functionSignature:
            'function proveBlock(uint64 _blockId, bytes _input)',
          sinceTimestampInclusive: new UnixTime(1716620627),
        },
      },
    ],
  },
  chainConfig: {
    name: 'taiko',
    chainId: 167000,
    explorerUrl: 'https://taikoscan.io',
    explorerApi: {
      url: 'https://api.taikoscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1716620627),
  },
  type: 'layer2',
  riskView: makeBridgeCompatible({
    stateValidation: {
      description: `Taiko uses a multi-tier proof system to validate the state. However, current tier proofs include either SGX (secure-enclave) execution verification, or approval by a minimum number of Guardians. State validation through the Zk-proof tier is not yet active. 
        Each proof goes through a cooldown window allowing for contestation. Contested blocks require proof from a higher level tier. If no contestation is made, or the block has been proven by the highest tier, the proof is considered valid.
        The system allows for an invalid state to be proven by either a compromised SGX instance or compromised Guardians (the highest tier). This can lead to a state being proven as valid when it is not.`,
      sentiment: 'bad',
      value: 'SGX Proofs',
      secondLine: `${SGXcooldownWindow} challenge period`,
    },
    dataAvailability: {
      ...DATA_ON_CHAIN,
    },
    exitWindow: {
      description:
        'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
      sentiment: 'bad',
      value: 'None',
    },
    sequencerFailure: {
      description:
        'The system uses a based rollup sequencing mechanism. However, currently there is only one permissioned sequencer who can propose blocks. This is a single point of failure and can lead to the system being halted if the sequencer fails to propose blocks on L1.',
      sentiment: 'bad',
      value: 'No mechanism', // based rollup sequencing
    },
    proposerFailure: {
      description:
        'Provers can examine the proposed blocks on the TaikoL1 contract, and generate SGX proofs for them. Currently, any prover providing a valid SGX attestation can register a SGX instance and create proofs for proposed blocks. However, the TaikoAdmin multisig can delete SGX instances and revoke certificates without delay, which would prevent valid SGX proofs from being accepted.',
      sentiment: 'warning',
      value: 'Self propose',
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: false,
        fraudProofSystemAtLeast5Outsiders: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/taikoxyz/simple-taiko-node',
    },
  ),
  technology: {
    stateCorrectness: {
      name: 'Multi-tier proof system',
      description: `Taiko uses a multi-tier proof system to validate the state. Currently there are three tiers, SGX tier, ${GuardianMinorityProverMinSigners}/${NumGuardiansMinorityProver} Guardian tier and ${GuardianProverMinSigners}/${NumGuardiansProver} Guardian tier (from lowest to highest).
        When proposing a block, the sequencer specifies a designated prover for that block. The SGX tier has a proving window of ${SGXprovingWindow}, meaning that only the designated prover can submit proof for the block. Once elapsed, proving is open to everyone able to submit SGX proofs.
        After the proof is submitted, anyone within the cooldown window - for SGX tier is ${SGXcooldownWindow} - can contest the block by submitting a bond. For the SGX Proof tier, the validity bond is currently set to ${SGXvalidityBond} TKO, while ${SGXcontestBond} TKO is required to contest the proof. 
        For the Minority guardian tier, validity and contest bonds are set to ${MinorityValidityBond} TKO and ${MinorityContestBond} TKO, respectively. It is not required to provide a proof for the block to submit a contestation.
        When someone contests, a higher level tier has to step in to prove the contested block. Decision of the highest tier (currently the ${GuardianProverMinSigners}/${NumGuardiansProver} Guardian) is considered final.
        If no one challenges the original SGX proof, it finalizes after ${SGXcooldownWindow} (the cooldown window).`,
      references: [],
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
      name: 'The system has a centralized sequencer',
      description:
        'Although designed for permissionless block proposals, the system currently has a single sequencer who is responsible for proposing blocks. This is a single point of failure and can lead to the system being halted if the proposer fails to propose blocks on L1.',
      references: [],
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      name: `Users can't force any transaction`,
      description:
        'The system is designed to allow users to propose L2 blocks directly on L1. However, currently only the permissioned proposer is allowed to propose blocks.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the sequencer refuses to include their transactions.',
        },
      ],
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
    addresses: [
      discovery.getContractDetails('TaikoL1Contract', {
        description:
          'This contract provides functionalities for sequencing, proving, and verifying blocks.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('L1RollupAddressManager', {
        description:
          'This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('TierRouter', {
        description:
          'Contract allowing for granular control of which TierProvider to apply to a specific block. Currently, the TierProvider is hardcoded as an address for all blocks. Can be changed through L1RollupAddressManager.',
      }),
      discovery.getContractDetails('TierProvider', {
        description: 'Contract managing the multi-tier proof system.',
      }),
      discovery.getContractDetails('SgxVerifier', {
        description: 'Verifier contract for SGX proven blocks.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('GuardianMinorityProver', {
        description:
          'Verifier contract for blocks proven by Guardian multisig minority.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('GuardianProver', {
        description: 'Verifier contract for Guardian multisig proven blocks.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('ProverSetProxy', {
        description:
          "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.",
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('SignalService', {
        description:
          'The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('AutomataDcapV3Attestation', {
        description: 'Contract managing SGX attestation certificates.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('TaikoToken', {
        description:
          "Taiko's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds.",
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('TaikoBridge', {
        description: 'Shared bridge for Taiko chains for bridged ETH.',
        ...upgradesTaikoMultisig,
      }),
      discovery.getContractDetails('SharedERC20Vault', {
        description: 'Shared vault for Taiko chains for bridged ERC20 tokens.',
        ...upgradesTaikoMultisig,
      }),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'TaikoAdmin',
      'Currently also designated as the Security Council. Can upgrade proxies without delay, remove SGX attestation certificates, pause block proposals and block proving, among other permissions.',
    ),
    {
      name: 'GuardianProvers',
      description:
        'Guardians can prove blocks on the highest tier. Guardians are selected by the TaikoAdmin multisig.',
      accounts: discovery.getPermissionedAccounts(
        'GuardianProver',
        'guardians',
      ),
    },
    {
      name: 'GuardianMinorityProver',
      description:
        'Minority guardians can prove blocks on the second highest tier. Guardians are selected by the TaikoAdmin multisig.',
      accounts: discovery.getPermissionedAccounts(
        'GuardianMinorityProver',
        'guardians',
      ),
    },
    {
      name: 'ChainWatchdog',
      accounts: [{ address: EthereumAddress(chainWatchdog), type: 'MultiSig' }],
      description: 'The chain watchdog role can pause proving of blocks.',
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: EthereumAddress(proposer),
          type: 'EOA',
        },
      ],
      description:
        'The authorized sequencer (in Taiko called “proposer”) of blocks on the TaikoL1 contract.',
    },
    {
      name: 'SequencerBlockOne',
      accounts: [{ address: EthereumAddress(proposerOne), type: 'EOA' }],
      description:
        'The authorized sequencer (in Taiko called “proposer”) of block one, hardcoded to vitalik.eth address.',
    },
  ],
  milestones: [
    {
      name: 'Taiko Mainnet Launch',
      link: 'https://taiko.mirror.xyz/Pizjv30FvjsZUwEG-Da7Gs6F8qeDLc4CKKEBqy3pTt8',
      date: '2024-05-27T00:00:00.00Z',
      description: 'Taiko is deployed on Ethereum mainnet.',
    },
  ],
}
