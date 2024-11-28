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
import { ESCROW } from '../../common/escrow'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

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
  createdAt: new UnixTime(1702295992), // 2023-12-11T11:59:52Z
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge-holesky.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer-holesky.morphl2.io'],
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
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS_OR_CALLLDATA],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED, // TODO: check
    }),
  ],
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_1R_ZK,
      sentiment: 'bad',
      secondLine: `${formatSeconds(challengeWindow)} challenge period`,
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'MorphRollup',
          references: [
            'https://etherscan.io/address/0x073403E147a8e607b80985fe458c0B527287278F#code',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, 0),
      sources: [
        {
          contract: 'MorphRollup',
          references: [
            'https://etherscan.io/address/0x073403E147a8e607b80985fe458c0B527287278F#code',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'L1MessageQueueWithGasPriceOracle',
          references: [
            'https://etherscan.io/address/0x828F68e2E05a34fA836416F124350E25021876ac#code',
          ],
        },
        {
          contract: 'EnforcedTxGateway',
          references: [
            'https://etherscan.io/address/0xCb13746Fc891fC2e7D824870D00a26F43fE6123e#code',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'MorphRollup',
          references: [
            'https://etherscan.io/address/0x073403E147a8e607b80985fe458c0B527287278F#code',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
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
          text: 'Rollup.sol - Etherscan source code, commitBatch(), challengeState(), proveState() functions',
          href: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278f#code#F1#L204',
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
          text: 'Rollup.sol - Etherscan source code commitBatch() and commitBatchWithBlobProof() functions',
          href: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278#code',
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
          text: 'L1Staking.sol - Etherscan source code, verifySignature() function',
          href: 'https://etherscan.io/address/0xDb0734109051DaAB5c32E45e9a5ad0548B2df714#code',
        },
      ],
      risks: [FRONTRUNNING_RISK],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          text: 'EnforcedTxGateway.sol - Etherscan source code',
          href: 'https://etherscan.io/address/0xCb13746Fc891fC2e7D824870D00a26F43fE6123e#code',
        },
        {
          text: 'Rollup.sol - proposer can indicate which messages were skipped',
          href: 'https://etherscan.io/address/0x073403e147a8e607b80985fe458c0b527287278f#code#F1#L242',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof', challengeWindow),
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            text: 'L1ETHGateway.sol - Etherscan source code, finalizeWithdrawETH function',
            href: 'https://etherscan.io/address/0x63eeCb6bE6087B094c2CBAA34f2902593eAE979c#code',
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
}
