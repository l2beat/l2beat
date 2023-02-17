import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

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
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zksync')

export const zksynclite: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync'),
  display: {
    name: 'zkSync Lite',
    slug: 'zksync-lite',
    description:
      'zkSync Lite (formerly zkSync) is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet. It supports payments, token swaps and NFT minting.',
    purpose: 'Tokens, NFTs',
    links: {
      websites: ['https://zksync.io/'],
      apps: ['https://wallet.zksync.io/'],
      documentation: ['https://zksync.io/dev/'],
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
        address: EthereumAddress('0xaBEA9132b05A70803a4E85094fD0e1800777fBEF'),
        sinceTimestamp: new UnixTime(1592218707),
        tokens: '*',
      },
    ],
    events: [
      {
        name: 'BlockVerification',
        abi: 'event  BlockVerification(uint32 indexed blockNumber)',
        emitter: EthereumAddress('0xabea9132b05a70803a4e85094fd0e1800777fbef'),
        type: 'state',
        sinceTimestamp: new UnixTime(1592218707),
      },
      {
        name: 'BlockCommit',
        abi: 'event BlockCommit(uint32 indexed blockNumber)',
        emitter: EthereumAddress('0xabea9132b05a70803a4e85094fd0e1800777fbef'),
        type: 'data',
        sinceTimestamp: new UnixTime(1592218707),
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
      value: '21d or no delay',
      description:
        'There is a 21 days delay unless it is overriden by the 9/15 Security Council multisig.',
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
      {
        address: discovery.getContract('ZkSync').address,
        name: 'ZkSync',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant is currently set to 21 days. 9/15 Security Council MSig can override the delay period and execute an emergency immediate upgrade.',
        upgradeability: discovery.getContract('ZkSync').upgradeability,
      },
      {
        address: discovery.getContract('Verifier').address,
        name: 'Verifier',
        description: 'Implements zkProof verification logic.',
        upgradeability: discovery.getContract('Verifier').upgradeability,
      },
      {
        address: discovery.getContract('UpgradeGatekeeper').address,
        name: 'UpgradeGatekeeper',
        description:
          'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      },
      {
        address: discovery.getContract('Governance').address,
        name: 'Governance',
        description:
          'Keeps a list of block producers, NFT factories and whitelisted tokens.',
        upgradeability: discovery.getContract('Governance').upgradeability,
      },
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK(
        '21 days or 0 if overridden by 9/15 MSig',
      ),
    ],
  },
  permissions: [
    {
      name: 'zkSync MultiSig',
      accounts: [
        {
          type: 'MultiSig',
          address: discovery.getContract('GnosisSafe').address,
        },
      ],
      description:
        'This MultiSig is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier and ZkSync contracts. It can change the list of active validators.',
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
      } zkSync Lite MultiSig.`,
    },
    {
      name: 'Security Council',
      accounts: [
        {
          address: EthereumAddress(
            '0xa2602ea835E03fb39CeD30B43d6b6EAf6aDe1769',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x9D5d6D4BaCCEDf6ECE1883456AA785dc996df607',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x002A5dc50bbB8d5808e418Aeeb9F060a2Ca17346',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x71E805aB236c945165b9Cd0bf95B9f2F0A0488c3',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x76C6cE74EAb57254E785d1DcC3f812D274bCcB11',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xFBfF3FF69D65A9103Bf4fdBf988f5271D12B3190',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xAfC2F2D803479A2AF3A72022D54cc0901a0ec0d6',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x4d1E3089042Ab3A93E03CA88B566b99Bd22438C6',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x19eD6cc20D44e5cF4Bb4894F50162F72402d8567',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x39415255619783A2E71fcF7d8f708A951d92e1b6',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x399a6a13D298CF3F41a562966C1a450136Ea52C2',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xee8AE1F1B4B1E1956C8Bda27eeBCE54Cf0bb5eaB',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xe7CCD4F3feA7df88Cf9B59B30f738ec1E049231f',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xA093284c707e207C36E3FEf9e0B6325fd9d0e33B',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x225d3822De44E58eE935440E0c0B829C4232086e',
          ),
          type: 'EOA',
        },
      ],
      description:
        'By default upgradeable contracts can be upgraded only after 3 weeks period. Security council can vote to cut this period to 0 days making the upgrade possible immediately if at least 9 out of 15 counselors agree on this.',
    },
    {
      name: 'Active validator',
      accounts: discovery
        .getContractValue<string[]>('Governance', 'validators')
        .map((validator) => ({
          address: EthereumAddress(validator),
          type: 'EOA',
        })),
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1.',
    },
    {
      name: 'Token listing beneficiary',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>('TokenGovernance', 'treasury'),
          ),
          type: 'EOA',
        },
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
  ],
}
