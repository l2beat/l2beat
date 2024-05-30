import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DATA_ON_CHAIN,
  EXITS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('taiko')

export const taiko: Layer2 = {
  id: ProjectId('taiko'),
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is an Ethereum-equivalent Optimistic Rollup on the Ethereum network. In the future it aims to add zkVerifier making it a hybrid, optimistic-zk construction. Taiko combines based sequencing and a contestation mechanism with multi-proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.hekla.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://hekla.taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
    activityDataSource: 'Blockchain RPC',
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
  },
  chainConfig: {
    name: 'taiko',
    chainId: 167000,
    explorerUrl: 'https://taikoscan.io',
    explorerApi: {
      url: 'https://taikoscan.io/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1716620627),
  },
  type: 'layer2',
  riskView: makeBridgeCompatible({
    stateValidation: {
      description: `Taiko uses a multi-tier proof system to validate the state. However, current tier proofs include either SGX (secure-enclave) execution verification, or approval by a minimum number of Guardians. State validation through the Zk-proof tier is not yet active. 
        Each proof goes through a cooling window allowing for contestation. Contested blocks require proof from a higher level tier. If no contestation is made, or the block has been proven by the highest tier, the proof is considered valid.
        The system allows for an invalid state to be proven by either a compromised SGX instance or compromised Guardians (the highest tier). This can lead to a state being proven as valid when it is not.`,
      sentiment: 'bad',
      value: 'SGX Proofs',
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
        'The system uses a based rollup sequencing mechanism. However, currently there is only one permissioned proposer who can propose blocks. This is a single point of failure and can lead to the system being halted if the proposer fails to propose blocks on L1.',
      sentiment: 'bad',
      value: 'No mechanism', // based rollup sequencing
    },
    proposerFailure: {
      description:
        'Provers can examine the proposed blocks on the TaikoL1 contract, and generate SGX proofs for them. Currently, any prover can create proofs for proposed blocks. However, the TaikoAdmin multisig can delete SGX instance without delay, which would prevent valid SGX proofs from being accepted.',
      sentiment: 'good',
      value: 'Self proving',
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
      description: `Taiko uses a multi-tier proof system to validate the state. Currently there are three tiers, SGX, 1/8 Guardian multisig and 6/8 Guardian multisig (from lowest to highest).
        When proposing a block, the proposer specifies a designated prover for that block. The SGX tier has a proving window of 1 hour, meaning that only the designated prover can submit proof for the block. Once elapsed, proving is open to everyone able to submit SGX proofs.
        After proof is submitted anyone - within cooldown window, for SGX tier is 24 hours - can contest by submitting a bond. Proving a block is not required to submit a contestation.
        When someone contests, a higher level tier has to step in to prove the contested block. Decision of the highest tier (currently the 6/8 Guardian multisig) is considered final.
        If noone challenges the original SGX proof, it finalizes after 24 hours (the cooldown window).`,
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
      name: 'The system has a centralized proposer',
      description:
        'Although designed for permissionless block proposals, the system currently has a single proposer who is responsible for proposing blocks. This is a single point of failure and can lead to the system being halted if the proposer fails to propose blocks on L1.',
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
          text: 'the proposer refuses to include their transactions.',
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
      }
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('TaikoL1Contract', {
        description:
          'This contract provides functionalities for proposing, proving, and verifying blocks.',
      }),
      discovery.getContractDetails('L1RollupAddressManager', {
        description:
          'This contract manages the rollup addresses list, allowing to set the address for a specific chainId-name pair.',
      }),
      discovery.getContractDetails('TierProvider', {
        description: 'Contract managing the multi-tier proof system.',
      }),
      discovery.getContractDetails('SgxVerifier', {
        description: 'Verifier contract for SGX proven blocks.',
      }),
      discovery.getContractDetails('GuardianMinorityProver', {
        description:
          'Verifier contract for blocks proven by Guardian multisig minority.',
      }),
      discovery.getContractDetails('GuardianProver', {
        description: 'Verifier contract for Guardian multisig proven blocks.',
      }),
      discovery.getContractDetails('ProverSetProxy', {
        description:
          "A contract that holds TKO token and acts as a Taiko prover. This contract will simply relay `proveBlock` calls to TaikoL1 so msg.sender doesn't need to hold any TKO.",
      }),
      discovery.getContractDetails('SignalService', {
        description:
          'The SignalService contract serves as cross-chain message passing system. It defines methods for sending and verifying signals with merkle proofs.',
      }),
      discovery.getContractDetails('AutomataDcapV3Attestation', {
        description: 'Contract managing SGX attestation certificates.',
      }),
      discovery.getContractDetails('TaikoToken', {
        description:
          "Taiko's native token. Used for block proposal rewards, proving bonds and rewards, and contesting bonds.",
      }),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'TaikoAdmin',
      'Currently also designated as the Security Council. Can upgrade proxies without delay, remove SGX attestation certificates, pause block proposals and block proving, among other permissions.',
    ),
    // to do: add watchers and watchdogs
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
