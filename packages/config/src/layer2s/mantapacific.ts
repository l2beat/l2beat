import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from '../common'
import { subtractOne } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantapacific')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const challengePeriod: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeDelay = 0

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId('mantapacific:tia-celestia'),
    name: 'Celestia',
    symbol: 'TIA',
    decimals: 6,
    iconUrl:
      'https://assets.coingecko.com/coins/images/31967/large/tia.jpg?1696530772',
    address: EthereumAddress('0x6Fae4D9935E2fcb11fC79a64e917fb2BF14DaFaa'),
    coingeckoId: CoingeckoId('celestia'),
    sinceTimestamp: new UnixTime(1698782429),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Hyperlane Nexus',
    },
  },
  {
    id: AssetId('mantapacific:stone-stakestone-ether'),
    name: 'StakeStone Ether',
    symbol: 'STONE',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/33103/large/200_200.png?1702602672',
    address: EthereumAddress('0xEc901DA9c68E90798BbBb74c11406A32A70652C3'),
    coingeckoId: CoingeckoId('stakestone-ether'),
    sinceTimestamp: new UnixTime(1699781729),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Layer Zero',
      slug: 'omnichain',
    },
  },
]

export const mantapacific: Layer2 = {
  type: 'layer2',
  id: ProjectId('mantapacific'),
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    description:
      'Manta Pacific is an Optimium empowering EVM-native zero-knowledge (ZK) applications and general dapps.',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    purpose: 'Universal',
    category: 'Optimium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'OP Stack',
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: ['https://pacific-explorer.manta.network/'],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Manta Pacific is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        challengePeriod,
      )} after it has been posted.`,
    },
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.MANTA_PACIFIC })),
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622'),
        sinceTimestamp: new UnixTime(1694224871),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3B95bC951EE0f553ba487327278cAc44f29715E5'),
        sinceTimestamp: new UnixTime(1694224907),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://pacific-rpc.manta.network/http',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_CELESTIA(false),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376', // this ref only implies that deposited txs are onchain
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, challengePeriod),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        // the value is inside the node config, but we have no reference to it
        // so we assume it to be the same value as in other op stack chains
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
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
            'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L186',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: {
    stage: 'NotApplicable',
  },
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
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L141',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
      references: [
        ...DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false).references,
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0xaeba8e2307a22b6824a9a7a39f8b016c357cd1fe',
        },
        {
          text: 'OptimismPortal.sol#L376 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L35',
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
          href: 'https://github.com/ethereum-optimism/optimism/blob/develop/specs/glossary.md#sequencing-window',
        },
        {
          text: 'OptimismPortal.sol#L376 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof', challengePeriod),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L190',
          },
          {
            text: 'OptimismPortal.sol#L270 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L270',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L185',
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
  permissions: [
    {
      name: 'MantaOwner',
      accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
      description:
        'Owner of the SystemConfig and configured as the Challenger and Guardian of the system.',
    },
    {
      name: 'AdminMultisig',
      accounts: [discovery.getPermissionedAccount('ProxyAdmin', 'owner')],
      description: 'Owner of the ProxyAdmin contract.',
    },
    ...discovery.getOpStackPermissions({
      batcherHash: 'Sequencer',
      PROPOSER: 'Proposer',
      GUARDIAN: 'Guardian',
      CHALLENGER: 'Challenger',
    }),
  ],
  contracts: {
    addresses: [...discovery.getOpStackContractDetails(upgradesProxy)],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Manta Pacific Network Launch',
      link: 'https://mantanetwork.medium.com/manta-pacific-mainnet-alpha-launch-743c6bc2b95e',
      date: '2023-09-12T00:00:00Z',
      description: 'Manta Pacific is live on mainnet.',
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
