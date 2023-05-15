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
        `The main Rollup contract. Allows the operator to commit blocks, provide zkProofs (validated by the Verifier) and processes withdrawals by executing blocks. Users can deposit ETH and ERC20 tokens. This contract also defines the upgrade process for all the other contracts by enforcing an upgrade delay and employing the Security Council which can shorten upgrade times.`,
      ),
      discovery.getMainContractDetails(
        'Verifier',
        'Implements zkProof verification logic.',
      ),
      discovery.getMainContractDetails(
        'Governance',
        'Keeps a list of block producers, NFT factories and whitelisted tokens.',
      ),
      discovery.getMainContractDetails(
        'UpgradeGatekeeper',
        'This is the contract that owns Governance, Verifier and ZkSync and facilitates their upgrades. The upgrade constraints are defined by the ZkSync contract.',
      ),
      discovery.getMainContractDetails(
        'TokenGovernance',
        'Allows anyone to add new ERC20 tokens to zkSync Lite given sufficient payment.',
      ),
      discovery.getMainContractDetails(
        'NftFactory',
        'Allows for withdrawing NFTs minted on L2 to L1.',
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
      'ZkSync Multisig',
      'This Multisig is the owner of Upgrade Gatekeeper contract and therefore is allowed to perform upgrades for Governance, Verifier and ZkSync contracts. It can also change the list of active validators and appoint the security council (by upgrading the ZkSync contract).',
    ),
    {
      name: 'Security Council',
      accounts: discovery.getPermissionedAccountsList(
        'ZkSync',
        'securityCouncilMembers',
      ),
      description: `The Security Council's only role is to reduce the upgrade delay to zero if ${securityCouncilThreshold} of its members decide to do so. The council has ${securityCouncilMembers.length} members which are hardcoded into the ZkSync contract. Changing the council requires a ZkSync contract upgrade.`,
      references: [
        'https://etherscan.io/address/0x2eaa1377e0fc95de998b9fa7611e9d67eba534fd#code#F1#L128',
      ],
    },
    {
      name: 'Active validators',
      accounts: discovery.getPermissionedAccountsList(
        'Governance',
        'validators',
      ),
      description:
        'Those actors are allowed to propose, revert and execute L2 blocks on L1.',
    },
    {
      name: 'Token listing beneficiary',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue<string>('TokenGovernance', 'treasury'),
        ),
      ],
      description:
        'Account receiving fees for listing tokens. Can be updated by ZkSync Multisig.',
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
