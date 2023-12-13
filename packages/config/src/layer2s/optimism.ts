import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  MILESTONES,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  subtractOneAfterBlockInclusive,
} from './common'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { DERIVATION } from './common/stateDerivations'
import { Layer2 } from './types'
const discovery = new ProjectDiscovery('optimism')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId('op-optimism'),
    name: 'Optimism',
    coingeckoId: CoingeckoId('optimism'),
    address: EthereumAddress('0x4200000000000000000000000000000000000042'),
    iconUrl:
      'https://assets.coingecko.com/coins/images/25244/large/Optimism.png?1660904599',
    symbol: 'OP',
    decimals: 18,
    sinceTimestamp: new UnixTime(1654039974),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
  {
    id: AssetId.USDC_ON_OPTIMISM,
    name: 'USD Coin',
    coingeckoId: CoingeckoId('usd-coin'),
    address: EthereumAddress('0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'),
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    symbol: 'USDC',
    decimals: 6,
    sinceTimestamp: new UnixTime(1668453318),
    category: 'stablecoin',
    type: 'NMV',
    formula: 'totalSupply',
  },
  {
    id: AssetId('optimism:kwenta-kwenta'),
    name: 'Kwenta',
    symbol: 'KWENTA',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/27409/large/kwenta.png?1668768595',
    address: EthereumAddress('0x920cf626a271321c151d027030d5d08af699456b'),
    coingeckoId: CoingeckoId('kwenta'),
    sinceTimestamp: new UnixTime(1668733200),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
  {
    id: AssetId('optimism:velo-velodrome-finance'),
    name: 'Velodrome Finance',
    symbol: 'VELO',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/25783/large/velo.png?1653817876',
    address: EthereumAddress('0x9560e827af36c94d2ac33a39bce1fe78631088db'),
    coingeckoId: CoingeckoId('velodrome-finance'),
    sinceTimestamp: new UnixTime(1687392369),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
]

export const optimism: Layer2 = {
  type: 'layer2',
  id: ProjectId('optimism'),
  display: {
    name: 'OP Mainnet',
    slug: 'optimism',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'OP Mainnet is an EVM-equivalent Optimistic Rollup chain. It aims to be fast, simple, and secure. \
    With the Nov 2021 upgrade to OVM 2.0 old fraud proof system has been disabled while the \
    new fraud-proof system is being built (https://github.com/ethereum-optimism/cannon).',
    purpose: 'Universal',
    provider: 'OP Stack',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    links: {
      websites: ['https://optimism.io/'],
      apps: [],
      documentation: ['https://community.optimism.io'],
      explorers: [
        'https://optimistic.etherscan.io',
        'https://optimism.blockscout.com/',
      ],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://optimism.mirror.xyz/',
        'https://twitter.com/OptimismFND',
        'https://twitter.com/OPLabsPBC',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
      ],
      rollupCodes: 'https://rollup.codes/optimism',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Optimism is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.OPTIMISM })),
    associatedTokens: ['OP'],
    nativeL2TokensIncludedInTVL: ['OP'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xbEb5Fc579115071764c7423A4f12eDde41f106Ed'),
        sinceTimestamp: new UnixTime(1686068903),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'),
        sinceTimestamp: new UnixTime(1624401464),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that do not require custom gateway.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
        sinceTimestamp: new UnixTime(1625675779),
        tokens: ['DAI'],
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      }),
      discovery.getEscrowDetails({
        // current SNX bridge escrow
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
        sinceTimestamp: new UnixTime(1620680982),
        tokens: ['SNX'],
        description: 'SNX Vault for custom SNX Gateway managed by Synthetix.',
      }),
      {
        // old snx bridge
        address: EthereumAddress('0x045e507925d2e05D114534D0810a1abD94aca8d6'),
        sinceTimestamp: new UnixTime(1610668212),
        tokens: ['SNX'],
        isHistorical: true,
      },
      {
        // also old snx bridge
        address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
        sinceTimestamp: new UnixTime(1620680934),
        tokens: ['SNX'],
        isHistorical: true,
      },
      discovery.getEscrowDetails({
        address: EthereumAddress('0x76943C0D61395d8F2edF9060e1533529cAe05dE6'),
        tokens: ['wstETH'],
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      assessCount: subtractOneAfterBlockInclusive(105235064),
    },
    liveness: {
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'transfer',
          from: EthereumAddress('0x6887246668a3b87F54DeB3b94Ba47a6f63F32985'),
          to: EthereumAddress('0xFF00000000000000000000000000000000000010'),
          sinceTimestamp: new UnixTime(1686074603),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xdfe97868233d1aa22e815a266982f2cf17685a27',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1685377367),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L434',
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
            'https://etherscan.io/address/0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
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
            'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L434',
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
            'https://etherscan.io/address/0xd2e67b6a032f0a9b1f569e63ad6c38f7342c2e00#code#F1#L186',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
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
    },
    {
      rollupNodeLink:
        'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
    },
  ),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, OP stack chains will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
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
          href: 'https://etherscan.io/address/0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00#code#F1#L141',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Derivation: Batch submission - OP Mainnet specs',
          href: 'https://github.com/ethereum-optimism/optimism/blob/develop/specs/derivation.md#batch-submission',
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0xff00000000000000000000000000000000000010',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L434',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00#code#F1#L35',
        },
        {
          text: 'Decentralizing the sequencer - OP Mainnet docs',
          href: 'https://community.optimism.io/docs/protocol/#decentralizing-the-sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencing Window - OP Mainnet Specs',
          href: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L434',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing back to L1 - OP Mainnet Help Center',
            href: 'https://help.optimism.io/hc/en-us/articles/4411903283227-Withdrawals-from-Optimism',
          },
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L242',
          },
          {
            text: 'OptimismPortal.sol#325 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x28a55488fef40005309e2DA0040DbE9D300a64AB#code#F1#L325',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0xd2E67B6a032F0A9B1f569E63ad6C38f7342c2e00#code#F1#L185',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            text: 'Forced withdrawal from an OP Stack blockchain',
            href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
          },
        ],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  stateDerivation: {
    ...DERIVATION.OPSTACK('OP_MAINNET'),
    genesisState:
      'Since OP Mainnet has migrated from the OVM to Bedrock, a node must be synced using a data directory that can be found [here](https://community.optimism.io/docs/useful-tools/networks/#links). To reproduce the migration itself, see this [guide](https://blog.oplabs.co/reproduce-bedrock-migration/).',
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'OptimismMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals, and as a Challenger for state roots. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getOpStackPermissions({
      batcherHash: 'Sequencer',
      PROPOSER: 'Proposer',
      GUARDIAN: 'Guardian',
      CHALLENGER: 'Challenger',
    }),
  ],
  contracts: {
    addresses: [
      ...discovery.getOpStackContractDetails(upgradesProxy, {
        L1CrossDomainMessenger: 'L1CrossDomainMessengerProxy',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Fault Proof System is live on OP Goerli',
      link: 'https://blog.oplabs.co/op-stack-fault-proof-alpha/',
      date: '2023-10-03T00:00:00Z',
      description: 'Fraud Proof system is live on Goerli.',
    },
    {
      name: 'Mainnet migration to Bedrock',
      link: 'https://oplabs.notion.site/Bedrock-Mission-Control-EXTERNAL-fca344b1f799447cb1bcf3aae62157c5',
      date: '2023-06-06T00:00:00Z',
      description: 'OP Mainnet, since Jun 2023 is running Bedrock.',
    },
    {
      name: 'OP Stack Introduced',
      link: 'https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs',
      date: '2022-10-17T00:00:00Z',
      description:
        'OP Stack, modular, open-sourced blueprint on how to build scalable blockchains.',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
    },
    {
      name: 'OP token airdrop',
      link: 'https://optimism.mirror.xyz/qvd0WfuLKnePm1Gxb9dpGchPf5uDz5NSMEFdgirDS4c',
      date: '2022-05-31T00:00:00Z',
      description: 'The first round of OP token airdrop.',
    },
    {
      name: 'OVM 2.0 is live',
      link: 'https://twitter.com/optimismfnd/status/1458953238867165192?s=21&t=cQ0NPREYt-u1rP7OiPFKUg',
      date: '2021-11-12T00:00:00Z',
      description:
        'Network upgrade to OVM 2.0 and removal of fraud-proof system.',
    },
    {
      name: 'Mainnet Soft Launch',
      link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
      description:
        'Only selected contracts like Synthetix and Uniswap are available.',
    },
    {
      name: 'Community Launch',
      link: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      date: '2021-08-19T00:00:00Z',
      description: 'All smart contracts allowed after prior approval.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How OP Mainnet compresses data',
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
    {
      title: 'The Optimistic Vision',
      url: 'https://www.optimism.io/vision',
      thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_VISION,
    },
  ],
}
