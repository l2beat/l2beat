import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
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
import { getStage } from './common/stages/getStage'
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

const upgrades = {
  upgradableBy: ['ZkSync Multisig'],
  upgradeDelay: `${upgradeDelay} or 0 if overridden by ${securityCouncil} Security Council`,
  upgradeConsiderations:
    'When the upgrade process starts only the address of the new implementation is given. The actual upgrade also requires implementation specific calldata which is only provided after the delay has elapsed. Changing the default upgrade delay or the Security Council requires a ZkSync contract upgrade.',
}

const forcedWithdrawalDelay = HARDCODED.ZKSYNC.PRIORITY_EXPIRATION_PERIOD

export const zksynclite: Layer2 = {
  type: 'layer2',
  id: ProjectId('zksync'),
  display: {
    name: 'zkSync Lite',
    slug: 'zksync-lite',
    description:
      'zkSync Lite (formerly zkSync) is a user-centric zk rollup platform from Matter Labs. It is a scaling solution for Ethereum, already live on Ethereum mainnet. It supports payments, token swaps and NFT minting.',
    purpose: 'Payments, Tokens',
    provider: 'zkSync',
    category: 'ZK Rollup',
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0xaBEA9132b05A70803a4E85094fD0e1800777fBEF'),
        sinceTimestamp: new UnixTime(1592218707),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'zksync',
      callsPerMinute: 3_000,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L549',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L575',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F16#L22',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F16#L36',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F21#L1193',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L422',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L44',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_ZKSYNC(upgradeDelay, securityCouncil),
      sources: [
        {
          contract: 'Governance',
          references: [
            'https://etherscan.io/address/0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8#code#F1#L93',
            'https://etherscan.io/address/0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8#code#F1#L205',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(forcedWithdrawalDelay),
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L325',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L360',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L977',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L600',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L600',
            'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L622',
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
      usersHave7DaysToExit: true,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: true,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
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
          href: 'https://zksync.io/faq/security.html#validity-proofs',
        },
        {
          text: 'ZkSync.sol#L549 - Etherscan source code, proveBlocks function',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L549',
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
        {
          text: 'PlonkCore.sol#L1193 - Etherscan source code',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F21#L1193',
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

        {
          text: 'ZkSync.sol#L44 - Etherscan source code, commitBlockInfo struct',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L44',
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
        {
          text: 'ZkSync.sol#L422 - Etherscan source code, requireActiveValidator in commitBlock function',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L427',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          text: 'Priority queue - zkSync FAQ',
          href: 'https://zksync.io/faq/security.html#priority-queue',
        },
        {
          text: 'ZkSync.sol#L977 - Etherscan source code, addPriorityRequest function',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L977',
        },
        {
          text: 'ZkSync.sol#L600 - Etherscan source code, activateExodusMode function',
          href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L600',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://docs.zksync.io/dev/payments/basic/#withdrawing-funds',
          },
        ],
      },
      {
        ...EXITS.FORCED,
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://docs.zksync.io/dev/payments/basic/#withdrawing-funds',
          },
          {
            text: 'ZkSync.sol#L325 - Etherscan source code, requestFullExit function',
            href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L325',
          },
          {
            text: 'ZkSync.sol#L360 - Etherscan source code, requestFullExitNFT function',
            href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L360',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
        references: [
          {
            text: 'Withdrawing funds - zkSync documentation',
            href: 'https://docs.zksync.io/dev/payments/basic/#withdrawing-funds',
          },
          {
            text: 'README.md - zkSync Exit Tool',
            href: 'https://github.com/matter-labs/zksync/tree/master/infrastructure/exit-tool',
          },
          {
            text: 'ZkSync.sol#L622 - Etherscan source code, performExodus function',
            href: 'https://etherscan.io/address/0x8e972b354e6933275513c355ee14d44a832ad2d9#code#F1#L622',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('ZkSync', {
        description:
          'The main Rollup contract. Allows the operator to commit blocks, provide zkProofs (validated by the Verifier) and processes withdrawals by executing blocks. Users can deposit ETH and ERC20 tokens. This contract also defines the upgrade process for all the other contracts by enforcing an upgrade delay and employing the Security Council which can shorten upgrade times.',
        ...upgrades,
      }),
      discovery.getContractDetails('Verifier', {
        description: 'Implements zkProof verification logic.',
        ...upgrades,
      }),
      discovery.getContractDetails('Governance', {
        description:
          'Keeps a list of block producers, NFT factories and whitelisted tokens.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'UpgradeGatekeeper',
        'This is the contract that owns Governance, Verifier and ZkSync and facilitates their upgrades. The upgrade constraints are defined by the ZkSync contract.',
      ),
      discovery.getContractDetails('TokenGovernance', {
        description:
          'Allows anyone to add new ERC20 tokens to zkSync Lite given sufficient payment.',
        upgradableBy: ['ZkSync Multisig'],
        upgradeDelay: 'No delay',
        references: [
          {
            text: 'Governance.sol#L93 - Etherscan source code',
            href: 'https://etherscan.io/address/0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8#code#F1#L93',
          },
        ],
      }),
      discovery.getContractDetails('NftFactory', {
        description: 'Allows for withdrawing NFTs minted on L2 to L1.',
        upgradableBy: ['ZkSync Multisig'],
        upgradeDelay: 'No delay',
        references: [
          {
            text: 'Governance.sol#L205 - Etherscan source code',
            href: 'https://etherscan.io/address/0x3FBc7C6c2437dE24F91b2Ca61Fc7AD3D2D62F4c8#code#F1#L',
          },
        ],
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'ZkSync Multisig',
      'This Multisig is the owner of Upgrade Gatekeeper contract and therefore is allowed to perform upgrades for Governance, Verifier and ZkSync contracts. It can also change the list of active validators and appoint the security council (by upgrading the ZkSync contract).',
    ),
    {
      name: 'Security Council',
      accounts: discovery.getPermissionedAccounts(
        'ZkSync',
        'securityCouncilMembers',
      ),
      description: `The Security Council's only role is to reduce the upgrade delay to zero if ${securityCouncilThreshold} of its members decide to do so. The council has ${securityCouncilMembers.length} members which are hardcoded into the ZkSync contract. Changing the council requires a ZkSync contract upgrade.`,
      references: [
        {
          text: 'Security Council Members - Etherscan source code',
          href: 'https://etherscan.io/address/0x2eaa1377e0fc95de998b9fa7611e9d67eba534fd#code#F1#L128',
        },
        {
          text: 'Security Council 2.0 - Matter Labs blog post',
          href: 'https://blog.matter-labs.io/security-council-2-0-2337a555f17a',
        },
      ],
    },
    {
      name: 'Active validators',
      accounts: discovery.getPermissionedAccounts('Governance', 'validators'),
      description:
        'Those actors are allowed to propose, revert and execute L2 blocks on L1.',
    },
    {
      name: 'Token listing beneficiary',
      accounts: [
        discovery.getPermissionedAccount('TokenGovernance', 'treasury'),
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
