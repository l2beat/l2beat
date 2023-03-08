import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync2')

export const zksyncera: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync2'),
  display: {
    name: 'zkSync Era',
    slug: 'zksync-era',
    warning: 'Currently only registered addresses can bridge to zkSync Era.',
    description:
      'zkSync Era is a general-purpose zk rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.\
      It implements standard Web3 API and it preserves key EVM features such as smart contract composability while introducing some new concept such as account abstraction.\
      It is currently deployed on mainnet and available to a whitelisted set of users/developers.',
    purpose: 'Universal',
    links: {
      websites: ['https://zksync.io/'],
      apps: ['https://portal.zksync.io/'],
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
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x027C8a79075F96a8cdE315b495949e5f1D92f1D6'),
        sinceTimestamp: new UnixTime(1666718099),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0x32400084C286CF3E17e7B677ea9583e60a000324'),
        sinceTimestamp: new UnixTime(1676268575),
        tokens: ['ETH'],
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: {
      ...RISK_VIEW.PROVER_DOWN,
      description: 'Only whitelisted Validators can submit proofs.',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'zkSync',
    category: 'ZK Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'Validity proofs - zkSync FAQ',
          href: 'https://v2-docs.zksync.io/dev/fundamentals/rollups.html#optimistic-rollups-versus-zk-rollups',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Cryptography used - zkSync FAQ',
          href: 'https://v2-docs.zksync.io/dev/fundamentals/rollups.html#optimistic-rollups-versus-zk-rollups',
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
      risks: [],
      references: [
        {
          text: "L1 - L2 interoperability - Developer's documentation'",
          href: 'https://v2-docs.zksync.io/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://v2-docs.zksync.io/dev/developer-guides/bridging/bridging-asset.html#introduction',
          },
        ],
      },
      {
        name: 'Forced exit',
        description:
          'If the user experiences censorship from the operator with regular exit they can submit their withdrawal requests directly on L1. \
          The system is then obliged to service this request. Once the force operation is submitted if the request is serviced the operation \
          follows the flow of a regular exit. Note that this mechanism is not implemented yet.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'a user withdrawal request is censored.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: "L1 - L2 interoperability - Developer's documentation",
            href: 'https://v2-docs.zksync.io/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: discovery.getContract('DiamondProxy').address,
        name: 'ZkSync Diamond Proxy',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract \
          and process transactions (executes blocks). During block execution it processes L1 --> L2 and L2 --> L1 transactions.\
          It uses separate Verifier to validate zkProofs. Governance manages list of Validators and can set basic rollup parameters.',
      },
      {
        address: discovery.getContract('Verifier').address,
        name: 'Verifier',
        description: 'Implements zkProof verification logic.',
      },
      {
        address: discovery.getContract('L1EthBridge').address,
        name: 'L1EthBridge',
        description: 'Standard bridge for depositing ETH to zkSync Era.',
        upgradeability: discovery.getContract('L1EthBridge').upgradeability,
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'zkSync Era MultiSig',
      accounts: [
        {
          type: 'MultiSig',
          address: discovery.getContract('GnosisSafe').address,
        },
      ],
      description:
        'This MultiSig is the current Governor of zkSync Era main contract and owner of the L1EthBridge. It can upgrade zkSync Era, upgrade bridge, change rollup parameters with no delay.',
    },
    {
      name: 'MultiSig participants',
      accounts: discovery
        .getContractValue<string[]>('GnosisSafe', 'getOwners')
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        'GnosisSafe',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>('GnosisSafe', 'getOwners').length
      } zkSync Era MultiSig.`,
    },
    {
      name: 'Active validator',
      accounts: [
        {
          address: EthereumAddress(
            '0x112200EaA6d57120c86B8b51a8b6049d56B82211',
          ),
          type: 'EOA',
        },
      ],
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1.',
    },
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
        'zkSync 2.0 rebrands to zkSync Era and lets registered projects deploy on mainnet.',
    },
  ],
}
