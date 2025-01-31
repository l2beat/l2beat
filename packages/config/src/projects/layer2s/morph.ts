import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { formatChallengePeriod } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import { generateDiscoveryDrivenPermissions } from './templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('morph')

const challengeWindow = discovery.getContractValue<number>(
  'MorphRollup',
  'finalizationPeriodSeconds',
)

const challengeBond = discovery.getContractValue<number>(
  'L1Staking',
  'challengeDeposit',
)

const upgradeDelay = 0

const stakingValue =
  discovery.getContractValue<number>('L1Staking', 'stakingValue') / 10 ** 18

const proofWindow = discovery.getContractValue<number>(
  'MorphRollup',
  'proofWindow',
)

export const morph: Layer2 = {
  type: 'layer2',
  id: ProjectId('morph'),
  capability: 'universal',
  addedAt: new UnixTime(1702295992), // 2023-12-11T11:59:52Z
  badges: [Badge.VM.EVM, Badge.DA.EthereumBlobs],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs and has plans for decentralizing the Sequencer. Their mission is to build the first blockchain for consumers, where user-friendly applications integrate seamlessly into everyday life, becoming indispensable utilities.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge.morphl2.io/'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://t.me/MorphL2official',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/L2Morph',
        'https://youtube.com/@morphofficiall2',
      ],
    },
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
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
  }),
  config: {
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc.morphl2.io',
      startBlock: 1,
      defaultCallsPerMinute: 300,
    },
    escrows: [
      {
        address: EthereumAddress('0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304'),
        sinceTimestamp: new UnixTime(1729307111),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8'),
        sinceTimestamp: new UnixTime(1729307651),
        tokens: '*',
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xA534BAdd09b4C62B7B1C32C41dF310AA17b52ef1'),
        sinceTimestamp: new UnixTime(1729307783),
        tokens: '*',
        ...ESCROW.CANONICAL_EXTERNAL,
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xc9045350712A1DCC3A74Eca18Bc985424Bbe7535'),
        sinceTimestamp: new UnixTime(1729308239),
        tokens: ['USDC'],
        ...ESCROW.CANONICAL_EXTERNAL,
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2C8314f5AADa5D7a9D32eeFebFc43aCCAbe1b289'),
        sinceTimestamp: new UnixTime(1729308239),
        tokens: ['USDC'],
        ...ESCROW.CANONICAL_EXTERNAL,
        chain: 'ethereum',
      },
    ],
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED, // TODO: check
  }),
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_1R_ZK,
      description:
        RISK_VIEW.STATE_FP_1R_ZK.description +
        ' The system currently operates with a single whitelisted challenger.',
      sentiment: 'bad',
      secondLine: formatChallengePeriod(challengeWindow),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  technology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
    },
    stateCorrectness: {
      name: 'Single round fault proof system',
      description: `Morph uses an one round fault proof system where whitelisted Challengers, if they find a faulty state root within the ${formatSeconds(challengeWindow)} challenge window, \
          can post a ${challengeBond} WEI bond and request a ZK proof of the state transition. After the challenge, during a ${formatSeconds(proofWindow)} proving window, a ZK proof must be \
          delivered, otherwise the state root is considered invalid and the root proposer bond, which is set currently to ${stakingValue} ETH, is slashed. The zkEVM used is SP1 from Succinct.\
          If the valid proof is delivered, the Challenger loses the challenge bond. The MorphAdminMSig can override any batch (both unfinalized and finalized), potentially preventing the ability to provide valid ZK proofs.`,
      references: [
        {
          title:
            'Rollup.sol - Etherscan source code, commitBatch(), challengeState(), proveState() functions',
          url: 'https://etherscan.io/address/0x43190DfD1F572Cb56B1942B44482d1774151D77A',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'whitelisted challenger does not post a challenge of an incorrect state root.',
        },
        {
          category: 'Funds can be lost if',
          text: 'the owner overrides finalized batches.',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'Rollup.sol - Etherscan source code commitBatch() and commitBatchWithBlobProof() functions',
          url: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278#code',
        },
      ],
    },
    operator: {
      name: 'Morph uses decentralised sequencer network',
      description: `The system uses a decentralised sequencer/proposer network. At the moment all sequencers are run by Morph and - from the point of Ethereum - they don't need \
        to reach consensus on a block as any one of them can propose a block with an L2 state root on Ethereum. There is a plan to use tendermint with BLS signatures to verify \
        consensus after Petra upgrade.`,
      references: [
        {
          title:
            'L1Staking.sol - Etherscan source code, verifySignature() function',
          url: 'https://etherscan.io/address/0xDb0734109051DaAB5c32E45e9a5ad0548B2df714#code',
        },
      ],
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          title: 'EnforcedTxGateway proxy - PAUSED - Etherscan source code',
          url: 'https://etherscan.io/address//0xc5Fa3b8968c7FAbEeA2B530a20b88d0C2eD8abb7#readProxyContract#F7',
        },
        {
          title: 'EnforcedTxGateway.sol implementation - Etherscan source code',
          url: 'https://etherscan.io/address/0xCb13746Fc891fC2e7D824870D00a26F43fE6123e#code',
        },
        {
          title:
            'Rollup.sol - Sequencer decides if / how many transactions to dequeue',
          url: 'https://etherscan.io/address/0x43190DfD1F572Cb56B1942B44482d1774151D77A#code#F1#L534',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('optimistic', challengeWindow),
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
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
    addresses: discovery.getDiscoveredContracts(),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
}
