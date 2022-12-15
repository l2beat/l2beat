import { ProjectId, UnixTime } from '@l2beat/types'

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
import { Layer2 } from './types'

export const zksync2: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync2'),
  display: {
    name: 'zkSync 2.0',
    slug: 'zksync2',
    warning:
      'Currently only whitelisted contracts can be deployed and only whitelisted users can use zkSync 2.0.',
    description:
      'zkSync 2.0 is a general-purpose zk rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.\
      It implements standard Web3 API and it preserves key EMV features such as smart contract composability while introducing some new concept such as account abstraction.\
      It is currently deployed on mainnet and available to a whitelisted set of users/developers.',
    purpose: 'Universal',
    links: {
      websites: ['https://zksync.io/'],
      apps: ['https://portal.zksync.io/'],
      documentation: ['https://v2-docs.zksync.io/dev/'],
      explorers: ['https://explorer.zksync.io/'],
      repositories: ['https://github.com/matter-labs/zksync'],
      socialMedia: [
        'https://blog.matter-labs.io/',
        'https://discord.gg/px2aR7w',
        'https://t.me/zksync',
        'https://twitter.com/zksync',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      {
        address: '0x027C8a79075F96a8cdE315b495949e5f1D92f1D6',
        sinceTimestamp: new UnixTime(1666718099),
        tokens: ['ETH'],
      },
    ],
    events: [],
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
        address: '0x324000e0c256B806548b307aF600aFFF3D000324',
        name: 'ZkSync Diamond Proxy',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract \
          and process transactions (executes blocks). During block execution it processes L1 --> L2 and L2 --> L1 transactions.\
          It uses separate Verifier to validate zkProofs. Governance manages list of Validators and can set basic rollup parameters.',
      },
      {
        address: '0xccEF0dAF4727Cc36171dc90A7efDef87A88a70bA',
        name: 'Verifier',
        description: 'Implements zkProof verification logic.',
      },
      {
        address: '0x027C8a79075F96a8cdE315b495949e5f1D92f1D6',
        name: 'L1EthBridge',
        description: 'Standard bridge for depositing ETH to zkSync 2.0.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x4e4943346848c4867F81dFb37c4cA9C5715A7828',
          implementation: '0xeb9F40c4Ed46D39074aBe5Cd7E6C54679E5D04ED',
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'zkSync 2.0 MultiSig',
      accounts: [
        {
          type: 'MultiSig',
          address: '0x4e4943346848c4867F81dFb37c4cA9C5715A7828',
        },
      ],
      description:
        'This MultiSig is the current Governor of zkSync 2.0 main contract and owner of the L1EthBridge. It can upgrade zkSync2.0, upgrade bridge, change rollup parameters with no delay.',
    },
    {
      name: 'MultiSig participants',
      accounts: [
        {
          address: '0x3068415e0F857A5eEd03302A1F7E44f67468d2Bc',
          type: 'EOA',
        },
        {
          address: '0x474D2b82E02D9712A077574E7764dEfA182653D4',
          type: 'EOA',
        },
        {
          address: '0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607',
          type: 'EOA',
        },
        {
          address: '0x9dF8bc0918F357c766A5697E031fF5237c05747A',
          type: 'EOA',
        },
        {
          address: '0xA5F3C860441c0EeD02BF8A6472AF32B68884b0FF',
          type: 'EOA',
        },
        {
          address: '0xa265146cA40F52cfC439888D0b4291b5440e6769',
          type: 'EOA',
        },
      ],
      description:
        'These addresses are the participants of the 3/6 zkSync 2.0 MultiSig.',
    },
    {
      name: 'Active validator',
      accounts: [
        {
          address: '0x112200EaA6d57120c86B8b51a8b6049d56B82211',
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
      date: '2020-10-28T00:00:00Z',
      description: 'zkSync 2.0 baby alpha is launched on mainnet.',
    },
  ],
}
