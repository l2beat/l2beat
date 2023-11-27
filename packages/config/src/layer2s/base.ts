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
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  subtractOne,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('base')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId.USDC_ON_BASE,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    address: EthereumAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'),
    coingeckoId: CoingeckoId('usd-coin'),
    sinceTimestamp: new UnixTime(1692383789),
    category: 'stablecoin',
    type: 'NMV',
    formula: 'totalSupply',
  },
  {
    id: AssetId('base:sdex-smardex'),
    name: 'SmarDex',
    symbol: 'SDEX',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/29470/large/SDEX_logo_transparent.png?1690430205',
    address: EthereumAddress('0xFd4330b0312fdEEC6d4225075b82E00493FF2e3f'),
    coingeckoId: CoingeckoId('smardex'),
    sinceTimestamp: new UnixTime(1691501141),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Wormhole',
      slug: 'portal',
    },
  },
]

export const base: Layer2 = {
  type: 'layer2',
  id: ProjectId('base'),
  display: {
    name: 'Base',
    slug: 'base',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Base is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: ['https://basescan.org/', 'https://base.blockscout.com/'],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.BASE })),
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'),
        sinceTimestamp: new UnixTime(1686793895),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3154Cf16ccdb4C6d922629664174b904d80F2C35'),
        sinceTimestamp: new UnixTime(1686793895),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://developer-access-mainnet.base.org',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
    liveness: {
      batchSubmissions: [
        {
          formula: 'transfer',
          from: EthereumAddress('0x5050F69a9786F081509234F1a7F4684b5E5b76C9'),
          to: EthereumAddress('0xFf00000000000000000000000000000000008453'),
          sinceTimestamp: new UnixTime(1686796655),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x56315b90c40730925ec5485cf004d835058518A0',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot,uint256 _l2BlockNumber,bytes32 _l1BlockHash,uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1686793895),
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
            'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L434',
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
            'https://etherscan.io/address/0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
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
            'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L434',
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
            'https://etherscan.io/address/0xf2460D3433475C8008ceFfe8283F07EB1447E39a#code#F1#L186',
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
      rollupNodeLink: 'https://github.com/base-org/node',
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
          href: 'https://etherscan.io/address/0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA#code#F1#L141',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0xff00000000000000000000000000000000008453',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L434',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA#code#F1#L35',
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
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L434',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L242',
          },
          {
            text: 'OptimismPortal.sol#325 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x5FB30336A8d0841cf15d452afA297cB6D10877D7#code#F1#L325',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x7237343c2A746Aa2940E5E4Fbd53eaFBF3049DcA#code#F1#L185',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
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
    nodeSoftware: `Base [node](https://github.com/base-org/node) is open-sourced and built on Optimism’s open-source [OP Stack](https://stack.optimism.io/) with no modification. The configuration file for Base Mainnet can be found [here](https://github.com/base-org/node/blob/main/mainnet/rollup.json).`,
    compressionScheme:
      'Data batches are compressed using the [zlib](https://github.com/madler/zlib) algorithm with best compression level.',
    genesisState:
      'The genesis file can be found [here](https://raw.githubusercontent.com/base-org/node/main/mainnet/genesis-l2.json).',
    dataFormat: `Batch submission format can be found [here](https://github.com/ethereum-optimism/optimism/blob/33741760adce92c8bdf61f693058144bb6986e30/specs/derivation.md#batch-submission-wire-format).`,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'AdminMultisig',
      'This address is the owner of the ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds.',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      "Address designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It's the owner of SystemConfig, which allows to update the sequencer address. Moreover, it can challenge state roots without going through the fault proof process.",
    ),
    ...discovery.getMultisigPermission(
      'BaseMultisig',
      "Core multisig of the Base team, it's a member of the AdminMultisig, meaning it can upgrade the bridge implementation potentially gaining access to all funds.",
    ),
    ...discovery.getMultisigPermission(
      'OptimismMultisig',
      "Core multisig of the Optimism team, it can challenge state roots without going through the fault proof process. It's also a member of the AdminMultisig, meaning it can upgrade the bridge implementation potentially gaining access to all funds.",
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
      ...discovery.getOpStackContractDetails(upgradesProxy),
      discovery.getContractDetails('L1ERC721Bridge', {
        description:
          'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('Challenger1of2', {
        description:
          "This contract is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is functionally equivalent to a 1/2 multisig where neither party can remove the other's permission to execute a Challenger call. It is controlled by the GuardianMultisig and the OptimismMultisig.",
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Base Mainnet Launch',
      link: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
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
