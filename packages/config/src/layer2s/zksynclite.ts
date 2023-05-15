import { ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync')

const upgradeDelay = formatSeconds(
  discovery.getContractValue<number>('ZkSync', 'UPGRADE_NOTICE_PERIOD'),
)

const securityCouncilThreshold = discovery.getContractValue<number>(
  'ZkSync',
  'securityCouncilThreshold',
)

const securityCouncilMembers = discovery.getContractValue<string[]>(
  'ZkSync',
  'securityCouncilMembers',
)

const securityCouncil = `${securityCouncilThreshold} of ${securityCouncilMembers.length}`

export const zksynclite: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync'),
  display: {
    name: 'zkSync Lite',
    slug: 'zksync-lite',
    description:
      'zkSync Lite (formerly zkSync) is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet. It supports payments, token swaps and NFT minting.',
    purpose: 'Payments, Tokens',
    links: {
      websites: ['https://zksync.io/'],
      apps: ['https://lite.zksync.io/'],
      documentation: ['https://docs.zksync.io/dev/'],
      explorers: ['https://zkscan.io/'],
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
        address: discovery.getContract('ZkSync').address,
        sinceTimestamp: new UnixTime(1592218707),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'zksync',
      callsPerMinute: 3_000,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: {
      value: `${upgradeDelay} or no delay`,
      description: `There is a ${upgradeDelay} delay unless it is overridden by the ${securityCouncil} Security Council.`,
      sentiment: 'warning',
    },
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_ZKP,
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
          href: 'https://zksync.io/faq/security.html#validity-proofs',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Cryptography used - zkSync FAQ',
          href: 'https://zksync.io/faq/security.html#cryptography-used',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'Overview - zkSync documentation',
          href: 'https://zksync.io/dev/#overview',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'How decentralized is zkSync - zkSync FAQ',
          href: 'https://zksync.io/faq/decentralization.html#how-decentralized-is-zksync',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT,
      references: [
        {
          text: 'Priority queue - zkSync FAQ',
          href: 'https://zksync.io/faq/security.html#priority-queue',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://zksync.io/dev/payments/basic.html#flow',
          },
        ],
      },
      {
        ...EXITS.FORCED,
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://zksync.io/dev/payments/basic.html#flow',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://zksync.io/dev/payments/basic.html#flow',
          },
          {
            text: 'README.md - zkSync Exit Tool',
            href: 'https://github.com/matter-labs/zksync/tree/master/infrastructure/exit-tool',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getMainContractDetails(
        'ZkSync',
        `The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant is currently set to ${upgradeDelay}. ${securityCouncil} Security Council MSig can override the delay period and execute an emergency immediate upgrade.`,
      ),
      discovery.getMainContractDetails(
        'Verifier',
        'Implements zkProof verification logic.',
      ),
      discovery.getMainContractDetails(
        'UpgradeGatekeeper',
        'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      ),
      discovery.getMainContractDetails(
        'Governance',
        'Keeps a list of block producers, NFT factories and whitelisted tokens.',
      ),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK(
        `${upgradeDelay} or 0 if overridden by ${securityCouncil} Security Council`,
      ),
    ],
  },
  permissions: [
    ...discovery.getGnosisSafeDetails(
      'ZkSyncMultisig',
      'This MultiSig is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier and ZkSync contracts. It can change the list of active validators.',
    ),
    {
      name: 'Security Council',
      accounts: discovery.getPermissionedAccountsList(
        'ZkSync',
        'securityCouncilMembers',
      ),
      description:
        'By default upgradeable contracts can be upgraded only after 3 weeks period. Security council can vote to cut this period to 0 days making the upgrade possible immediately if at least 9 out of 15 counselors agree on this.',
    },
    {
      name: 'Active validator',
      accounts: discovery.getPermissionedAccountsList(
        'Governance',
        'validators',
      ),
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1.',
    },
    {
      name: 'Token listing beneficiary',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue<string>('TokenGovernance', 'treasury'),
        ),
      ],
      description:
        'Account receiving fees for listing tokens. Can be updated by zkSync Lite MultiSig.',
    },
  ],
  milestones: [
    {
      name: 'zkSync 1.0 launch',
      link: 'https://blog.matter-labs.io/zksync-is-live-bringing-trustless-scalable-payments-to-ethereum-9c634b3e6823',
      date: '2020-06-18T00:00:00Z',
      description:
        'zkSync is live, bringing scalable payments to Ethereum using zkRollup technology.',
    },
    {
      name: 'Rebranding',
      link: 'https://blog.matter-labs.io/all-aboard-zksync-era-mainnet-8b8964ba7c59#:~:text=zkSync%201.0%20is%20now%20zkSync%20Lite',
      date: '2023-02-16T00:00:00Z',
      description: 'zkSync becomes zkSync Lite.',
    },
  ],
}
