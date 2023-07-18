import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zora')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No Delay',
}

export const zora: Layer2 = {
  type: 'layer2',
  id: ProjectId('zora'),
  display: {
    name: 'Zora Network',
    slug: 'zora',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'The Zora Network is a fast, cost-efficient, and scalable Layer 2 built to help bring media onchain, powered by the OP Stack.',
    purpose: 'Universal, NFTs',
    provider: 'Optimism',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'],
      apps: [],
      documentation: ['https://docs.zora.co/docs/zora-network/intro'],
      explorers: ['https://explorer.zora.energy/'],
      repositories: ['https://github.com/ourzora/optimism'],
      socialMedia: ['https://twitter.com/ourZORA'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1a0ad011913A150f69f6A19DF447A0CfD9551054'),
        sinceTimestamp: new UnixTime(1686607200),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3e2Ea9B92B7E48A52296fD261dc26fd995284631'),
        sinceTimestamp: new UnixTime(1686607200),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://rpc.zora.co',
      callsPerMinute: 1500,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'In development',
      description:
        'Currently the system permits invalid state roots. More details in project overview.',
      sentiment: 'bad',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8FEcC650BA4A#code#F1#L434',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x1a0ad011913A150f69f6A19DF447A0CfD9551054',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8FEcC650BA4A#code#F1#L434',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'L2OutputOracle',
          references: [
            'https://etherscan.io/address/0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44#code#F1#L186',
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
      rollupNodeOpenSource: true,
    },
    stage1: {
      stateVerificationOnL1: false,
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
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, Zora Network will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'L2OutputOracle.sol#L141 - Etherscan source code, deleteL2Outputs function',
          href: 'https://etherscan.io/address/0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44#code#F1#L141',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Derivation: Batch submission - OP Stack specs',
          href: 'https://github.com/ourzora/optimism/blob/develop/specs/derivation.md#batch-submission',
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0x6f54ca6f6ede96662024ffd61bfd18f3f4e34dff',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8fecc650ba4a#code#F1#L434',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44#code#F1#L35',
        },
        {
          text: 'Decentralizing the sequencer - OP Stack docs',
          href: 'https://community.optimism.io/docs/protocol/#decentralizing-the-sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencing Window - OP Stack specs',
          href: 'https://github.com/ourzora/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8fecc650ba4a#code#F1#L434',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8fecc650ba4a#code#F1#L242',
          },
          {
            text: 'OptimismPortal.sol#325 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x43260ee547c3965bb2a0174763bb8fecc650ba4a#code#F1#L325',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x9eedde6b4D3263b97209Ba860eDF3Fc6a8fB6a44#code#F1#L185',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Zora Network is pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on Zora Network.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'ZoraMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power)',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
    {
      name: 'ProxyAdmin',
      accounts: [discovery.getPermissionedAccount('AddressManager', 'owner')],
      description:
        'Admin of the OptimismPortal, L1ERC721Bridge, L2OutputOracle, SystemConfig, OptimismMintableERC20Factory, L1StandardBridge, AddressManager proxies. It’s controlled by the ZoraMultisig.',
    },
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
      ],
      description: 'Central actor allowed to commit L2 transactions to L1',
    },
    {
      name: 'Proposer',
      accounts: [
        discovery.getPermissionedAccount('L2OutputOracle', 'PROPOSER'),
      ],
      description: 'Central actor allowed to post new L2 state roots to L1',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('L2OutputOracle', {
        description:
          'The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('OptimismPortal', {
        description:
          'The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('SystemConfig', {
        description:
          'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('L1ERC721Bridge', {
        description:
          'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('L1CrossDomainMessenger', {
        description:
          "The L1 Cross Domain Messenger contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        ...upgradesProxy,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Zora Network Launch',
      link: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2023-06-21T00:00:00Z',
      description: 'Zora Network is live on mainnet.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How Optimism compresses data',
      url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Bedrock Explainer',
      url: 'https://community.optimism.io/docs/developers/bedrock/explainer/',
      thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_04,
    },
    {
      title: 'Modular Rollup Theory',
      url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
}
