import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')

const executionDelay = discovery.getContractValue<number>(
  'ValidatorTimelock',
  'executionDelay',
)
const delay = executionDelay > 0 && formatSeconds(executionDelay)

const upgrades = {
  upgradableBy: ['zkSync Era Multisig'],
  upgradeDelay: 'No delay',
}

export const zksyncera: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync2'),
  display: {
    name: 'zkSync Era',
    slug: 'zksync-era',
    warning: delay
      ? `Withdrawals are delayed by ${delay}. The length of the delay can be arbitrarily set by a MultiSig.`
      : undefined,
    description:
      'zkSync Era is a general-purpose zk-rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.\
      It implements standard Web3 API and it preserves key EVM features such as smart contract composability while introducing some new concept such as native account abstraction.',
    purpose: 'Universal',
    provider: 'zkSync',
    category: 'ZK Rollup',
    links: {
      websites: ['https://zksync.io/', 'https://ecosystem.zksync.io/'],
      apps: ['https://bridge.zksync.io/', 'https://portal.zksync.io/'],
      documentation: ['https://era.zksync.io/docs/'],
      explorers: ['https://explorer.zksync.io/'],
      repositories: ['https://github.com/matter-labs/zksync-era'],
      socialMedia: [
        'https://blog.matter-labs.io/',
        'https://join.zksync.dev/',
        'https://t.me/zksync',
        'https://twitter.com/zksync',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x32400084C286CF3E17e7B677ea9583e60a000324'),
        sinceTimestamp: new UnixTime(1676268575),
        tokens: ['ETH'],
        description: 'Main rollup contract, additionally serving as an escrow.',
        ...upgrades,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063'),
        sinceTimestamp: new UnixTime(1676367083),
        tokens: [
          'USDC',
          'PERP',
          'MUTE',
          'USDT',
          'WBTC',
          'LUSD',
          'rETH',
          'RPL',
          '1INCH',
        ],
        description:
          'Standard bridge for depositing ERC20 tokens to zkSync Era.',
        ...upgrades,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://mainnet.era.zksync.io',
      callsPerMinute: 1500,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'ZK proofs',
      description:
        'Uses PLONK zero-knowledge proof system with KZG commitments.',
      sentiment: 'good',
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0x3dB52cE065f728011Ac6732222270b3F2360d919#code#F1#L89',
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F1#L254',
            'https://etherscan.io/address/0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc#code#F1#L24',
          ],
        },
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x020b26826C23142f2582733b2E6428EE31eAaB49#code#F1#L227',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/transactions/transactions.html#transaction-types',
        'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'ValidatorTimelock',
          references: [
            'https://etherscan.io/address/0x3dB52cE065f728011Ac6732222270b3F2360d919#code#F1#L71',
            'https://etherscan.io/tx/0xef9ad50d9b6a30365e4cc6709a5b7479fb67b8948138149597c49ef614782e1b', // example tx (see calldata)
          ],
        },
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F1#L149',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F11#L41',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
      ],
    },
    upgradeability: {
      ...VALUES.ZKSYNC_2.UPGRADEABILITY,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F1#L121',
            'https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F7#L51',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F13#L56',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F13#L73',
          ],
        },
      ],
      otherReferences: [
        'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
        'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-mode',
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'zkSync',
          references: [
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F1#L149',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Validity proofs - zkSync FAQ',
          href: 'https://era.zksync.io/docs/dev/fundamentals/rollups.html#optimistic-rollups-versus-zk-rollups',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: "What are rollups? - Developer's documentation",
          href: 'https://era.zksync.io/docs/dev/fundamentals/rollups.html#what-are-zk-rollups',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
    },
    forceTransactions: {
      name: 'Users can force any transaction via L1',
      description:
        'If a user is censored by L2 Sequencer, they can try to force transaction via L1 queue. Right now there is no mechanism that forces L2 Sequencer to include\
        transactions from L1 queue in an L1 block.',
      risks: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM.risks,
      references: [
        {
          text: "L1 - L2 interoperability - Developer's documentation'",
          href: 'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://era.zksync.io/docs/dev/developer-guides/bridging/bridging-asset.html',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('zkSync', {
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract \
          and process transactions (executes blocks). During block execution it processes L1 --> L2 and L2 --> L1 transactions.\
          It uses separate Verifier to validate zkProofs. Governance manages list of Validators and can set basic rollup parameters.\
          It is also serves the purpose of ETH bridge.',
        ...upgrades,
      }),
      discovery.getContractDetails('Verifier', {
        description: 'Implements zkProof verification logic.',
        ...upgrades,
        upgradeConsiderations:
          'Multisig can change the verifier with no delay.',
      }),
      discovery.getContractDetails(
        'ValidatorTimelock',
        'Contract delaying block execution (ie withdrawals and other L2 --> L1 messages).',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'zkSync Era Multisig',
      'This MultiSig is the current Governor of zkSync Era main contract and owner of the L1EthBridge. It can upgrade zkSync Era, upgrade bridge, change rollup parameters with no delay.',
    ),
    {
      name: 'Active validator',
      accounts: [
        discovery.getPermissionedAccount('ValidatorTimelock', 'validator'),
      ],
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1.',
    },
    VALUES.ZKSYNC_2.SECURITY_COUNCIL,
  ],
  milestones: [
    {
      name: 'zkSync 2.0 baby alpha launch',
      link: 'https://blog.matter-labs.io/baby-alpha-has-arrived-5b10798bc623',
      date: '2022-10-28T00:00:00Z',
      description: 'zkSync 2.0 baby alpha is launched on mainnet.',
    },
    {
      name: 'Fair Onboarding Alpha and Rebranding',
      link: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59',
      date: '2023-02-16T00:00:00Z',
      description:
        'zkSync 2.0 rebrands to zkSync Era and lets registered projects and developers deploy on mainnet.',
    },
    {
      name: 'Full Launch Alpha',
      link: 'https://blog.matter-labs.io/gm-zkevm-171b12a26b36',
      date: '2023-03-24T00:00:00Z',
      description: 'zkSync Era is now permissionless and open for everyone.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'State diffs vs raw tx data',
      url: 'https://twitter.com/krzKaczor/status/1641505354600046594',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
}
