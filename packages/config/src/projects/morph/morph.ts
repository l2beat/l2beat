import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('morph')

const rollupDelayPeriod = discovery.getContractValue<number>(
  'Rollup',
  'rollupDelayPeriod',
)

const challengeWindow = discovery.getContractValue<number>(
  'Rollup',
  'finalizationPeriodSeconds',
)

const challengeBond = discovery.getContractValue<number>(
  'L1Staking',
  'challengeDeposit',
)

const upgradeDelay = 0

const stakingValue =
  discovery.getContractValue<number>('L1Staking', 'stakingValue') / 10 ** 18

const proofWindow = discovery.getContractValue<number>('Rollup', 'proofWindow')

const sequencers = discovery.getContractValue<ChainSpecificAddress[]>(
  'L1Staking',
  'getActiveStakers',
)

export const morph: ScalingProject = {
  type: 'layer2',
  id: ProjectId('morph'),
  capability: 'universal',
  addedAt: UnixTime(1702295992), // 2023-12-11T11:59:52Z
  badges: [BADGES.VM.EVM, BADGES.DA.EthereumBlobs],
  proofSystem: {
    type: 'Optimistic',
    name: 'SP1',
    zkCatalogId: ProjectId('sp1turbo'),
    challengeProtocol: 'Single-step',
  },
  display: {
    name: 'Morph',
    slug: 'morph',
    warning:
      'The current rollup version loses liveness if bad/random data is posted to blobs using `commitBatch()`', // introduced in the upgrade that made reuse of blobs mandatory after a revert
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs and has plans for decentralizing the Sequencer. Their mission is to build the first blockchain for consumers, where user-friendly applications integrate seamlessly into everyday life, becoming indispensable utilities.',
    purposes: ['Universal'],
    links: {
      websites: ['https://morphl2.io'],
      bridges: ['https://bridge.morphl2.io/'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://x.com/MorphLayer',
        'https://t.me/MorphL2official',
        'https://blog.morphl2.io/',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/morphnetwork',
        'https://youtube.com/@morphofficiall2',
      ],
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
        noRedTrustedSetups: true,
        programHashesReproducible: true,
        proverSourcePublished: true,
        verifierContractsReproducible: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/morph-l2/run-morph-node', // https://docs.morphl2.io/docs/build-on-morph/developer-resources/node-operation/full-node/run-in-docker
    },
  ),
  config: {
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    escrows: [
      {
        address: EthereumAddress('0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304'),
        sinceTimestamp: UnixTime(1729307111),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8'),
        sinceTimestamp: UnixTime(1729307651),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA534BAdd09b4C62B7B1C32C41dF310AA17b52ef1'),
        sinceTimestamp: UnixTime(1729307783),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xc9045350712A1DCC3A74Eca18Bc985424Bbe7535'),
        sinceTimestamp: UnixTime(1729308239),
        tokens: ['USDC'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2C8314f5AADa5D7a9D32eeFebFc43aCCAbe1b289'),
        sinceTimestamp: UnixTime(1729308239),
        tokens: ['USDC'],
        chain: 'ethereum',
      },
    ],
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0x759894Ced0e6af42c26668076Ffa84d02E3CeF60'),
        sequencers: sequencers.map((s) => ChainSpecificAddress.address(s)),
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED, // TODO: check
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_1R_ZK,
      description:
        RISK_VIEW.STATE_FP_1R_ZK.description +
        ' The system currently operates with at least 5 whitelisted challengers external to the team.',
      sentiment: 'warning',
      challengeDelay: challengeWindow,
      initialBond: formatEther(
        discovery.getContractValue<number>('L1Staking', 'stakingValue'),
      ),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(rollupDelayPeriod),
      description: `Users can force the sequencer to include a transaction by submitting a request through L1. If the sequencer censors or is down for ${formatSeconds(rollupDelayPeriod)}, new L1 batches must include at least 1 transaction from the queue.`,
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(rollupDelayPeriod),
      description:
        RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(rollupDelayPeriod)
          .description +
        ' This requires using the source-available prover to submit a zk proof of validity for the proposal.',
    },
  },
  chainConfig: {
    name: 'morph',
    chainId: 2818,
    // explorerUrl: 'https://explorer.morphl2.io/', // needed?
    coingeckoPlatform: 'morph-l2',
    sinceTimestamp: UnixTime(1729490400), // morph block 0
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 3654913,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.morphl2.io',
        callsPerMinute: 300,
      },
    ],
  },
  stateValidation: {
    categories: [
      {
        title: 'Fraud proofs',
        description: `Morph uses a one round fault proof system where whitelisted Challengers, if they find a faulty state root within the ${formatSeconds(challengeWindow)} challenge window, \
          can post a ${challengeBond} WEI bond and request a ZK proof of the state transition. At least 5 Challengers are operated by entities external to the team. After the challenge, during a ${formatSeconds(proofWindow)} proving window, a ZK proof must be \
          delivered, otherwise the state root is considered invalid and the root proposer bond, which is currently set to ${stakingValue} ETH, is slashed. The zkVM used is SP1 by Succinct.\
          If a valid proof is delivered, the Challenger loses the challenge bond. The Morph Multisig can revert unfinalized batches.`,
        references: [
          {
            title: 'Whitelisted Challengers - Morph Docs',
            url: 'https://docs.morphl2.io/docs/how-morph-works/optimistic-zkevm/#challenger-address-list',
          },
          {
            title:
              'Rollup.sol - Etherscan source code, commitBatch(), challengeState(), proveState() functions',
            url: 'https://etherscan.io/address/0x9e2Fb684935a32CEd121972f23BD0e4634377cA2',
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'no whitelisted challenger posts a challenge for an incorrect state root.',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'Rollup.sol - Etherscan source code commitBatch() and commitBatchWithBlobProof() functions',
          url: 'https://etherscan.io/address/0x759894Ced0e6af42c26668076Ffa84d02E3CeF60#code',
        },
      ],
    },
    operator: {
      name: 'Decentralised sequencer network',
      description:
        'BLS signatures of the Sequencers are not verified onchain. Sequencing is centralized an permissioned to the listed sequencers in practice.',
      references: [
        {
          title:
            'L1Staking.sol - Etherscan source code, verifySignature() stub',
          url: 'https://etherscan.io/address/0xDb0734109051DaAB5c32E45e9a5ad0548B2df714#code#F1#L340',
        },
      ],
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      name: 'Users can force transactions',
      description: `Users can force the sequencer to include a transaction by submitting a request through L1. If the sequencer censors such a request or is down for ${formatSeconds(rollupDelayPeriod)}, any new proposal must include at least 1 transaction from the queue. Proposing is permissionless under these conditions if proven immediately.`,
      risks: [],
      references: [
        {
          title: 'EnforcedTxGateway proxy - PAUSED - Etherscan source code',
          url: 'https://etherscan.io/address//0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7#readProxyContract#F7',
        },
        {
          title: 'EnforcedTxGateway.sol implementation - Etherscan source code',
          url: 'https://etherscan.io/address/0xCb13746Fc891fC2e7D824870D00a26F43fE6123e#code',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic', challengeWindow),
        risks: [],
        references: [
          {
            title:
              'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
            url: 'https://etherscan.io/address/0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c#code',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
    programHashes: getMorphVKeys().map((el) => PROGRAM_HASHES(el)),
    zkVerifiers: getVerifiers(),
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
}

function getMorphVKeys(): string[] {
  const vkeys: string[] = []
  const latestVerifier = discovery.getContractValue<
    { startBatchIndex: number; verifier: string }[]
  >('MultipleVersionRollupVerifier', 'latestVerifier')

  for (const { verifier } of latestVerifier) {
    const vkey = discovery.getContractValue<string>(verifier, 'programVkey')
    vkeys.push(vkey)
  }

  return vkeys
}

function getVerifiers(): ChainSpecificAddress[] {
  const latestVerifiers = discovery.getContractValue<
    { startBatchIndex: number; verifier: ChainSpecificAddress }[]
  >('MultipleVersionRollupVerifier', 'latestVerifier')
  return latestVerifiers.map((el) => el.verifier)
}
