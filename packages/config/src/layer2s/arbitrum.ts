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
  MILESTONES,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from '../common'
import { subtractOneAfterBlockInclusive } from '../common/assessCount'
import { UPGRADE_MECHANISM } from '../common/upgradeMechanism'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { formatSeconds } from '../utils/formatSeconds'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('arbitrum')
const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1ArbitrumTimelock',
  'getMinDelay',
)
const l2TimelockDelay = 259200 // 3 days, got from https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#readProxyContract
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const totalDelay = l1TimelockDelay + challengeWindowSeconds + l2TimelockDelay

// const totalDelayString = formatSeconds(totalDelay)

const upgradesExecutor = {
  upgradableBy: ['UpgradeExecutorAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const upgradesProxyAdmin = {
  upgradableBy: ['ArbitrumProxyAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const upgradesGatewaysAdmin = {
  upgradableBy: ['GatewaysAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const maxTimeVariation = discovery.getContractValue<number[]>(
  'SequencerInbox',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId('arb-arbitrum'),
    name: 'Arbitrum',
    symbol: 'ARB',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1680097630',
    address: EthereumAddress('0xb50721bcf8d664c30412cfbc6cf7a15145234ad1'),
    coingeckoId: CoingeckoId('arbitrum'),
    sinceTimestamp: new UnixTime(1630233600),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
  {
    id: AssetId('arbitrum:usdc-usd-coin'),
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    iconUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    address: EthereumAddress('0xaf88d065e77c8cC2239327C5EDb3A432268e5831'),
    coingeckoId: CoingeckoId('usd-coin'),
    sinceTimestamp: new UnixTime(1667250000),
    category: 'stablecoin',
    type: 'NMV',
    formula: 'totalSupply',
  },
  {
    id: AssetId('gns-gains-network'),
    name: 'Gains Network',
    symbol: 'GNS',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/19737/large/logo.png?1635909203',
    address: EthereumAddress('0x18c11FD286C5EC11c3b683Caa813B77f5163A122'),
    coingeckoId: CoingeckoId('gains-network'),
    sinceTimestamp: new UnixTime(1672175006),
    category: 'other',
    type: 'NMV',
    formula: 'totalSupply',
  },
  {
    id: AssetId('btc.b-bitcoin'),
    name: 'Bitcoin',
    symbol: 'BTC.b',
    decimals: 8,
    iconUrl:
      'https://assets.coingecko.com/coins/images/26115/large/btcb.png?1655921693',
    address: EthereumAddress('0x2297aEbD383787A160DD0d9F71508148769342E3'),
    coingeckoId: CoingeckoId('bitcoin-avalanche-bridged-btc-b'),
    sinceTimestamp: new UnixTime(1668644839),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Layer Zero',
      slug: 'omnichain',
    },
  },
  {
    id: AssetId('joe-joe-token'),
    name: 'JoeToken',
    symbol: 'JOE',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/17569/large/traderjoe.png?1685690062',
    address: EthereumAddress('0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07'),
    coingeckoId: CoingeckoId('joe'),
    sinceTimestamp: new UnixTime(1674495392),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Layer Zero',
      slug: 'omnichain',
    },
  },
  {
    id: AssetId('bifi-beefy-finance'),
    name: 'beefy.finance',
    symbol: 'BIFI',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/12704/large/token.png?1601876182',
    address: EthereumAddress('0x99C409E5f62E4bd2AC142f17caFb6810B8F0BAAE'),
    coingeckoId: CoingeckoId('beefy-finance'),
    sinceTimestamp: new UnixTime(1632385561),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Multichain',
      slug: 'multichain',
    },
  },
  {
    id: AssetId('arbitrum:sdex-smardex'),
    name: 'SmarDex',
    symbol: 'SDEX',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/29470/large/SDEX_logo_transparent.png?1690430205',
    address: EthereumAddress('0xabD587f2607542723b17f14d00d99b987C29b074'),
    coingeckoId: CoingeckoId('smardex'),
    sinceTimestamp: new UnixTime(1688976153),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Wormhole',
      slug: 'portal',
    },
  },
  {
    id: AssetId('arbitrum:gmx-gmx'),
    name: 'GMX',
    symbol: 'GMX',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/18323/large/arbit.png?1631532468',
    address: EthereumAddress('0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'),
    coingeckoId: CoingeckoId('gmx'),
    sinceTimestamp: new UnixTime(1626958493),
    category: 'stablecoin',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
  {
    id: AssetId('arbitrum:dmt-dream-machine-token'),
    name: 'Dream Machine Token',
    symbol: 'DMT',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/30505/large/dmt.png?1684821418',
    address: EthereumAddress('0x8b0e6f19ee57089f7649a455d89d7bc6314d04e8'),
    coingeckoId: CoingeckoId('dream-machine-token'),
    sinceTimestamp: new UnixTime(1684901612),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
  {
    id: AssetId('arbitrum:hdn-hydranet'),
    name: 'Hydranet',
    symbol: 'HDN',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/25177/large/HDXdarkblueInv.png?1652694650',
    address: EthereumAddress('0x3404149e9ee6f17fb41db1ce593ee48fbdcd9506'),
    coingeckoId: CoingeckoId('hydranet'),
    sinceTimestamp: new UnixTime(1687566748),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
]

export const arbitrum: Layer2 = {
  type: 'layer2',
  id: ProjectId('arbitrum'),
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
    description: `Arbitrum One is a general-purpose Optimistic Rollup built by Offchain Labs and governed by the Arbitrum DAO.`,
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Arbitrum',
    links: {
      websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
      apps: [],
      documentation: ['https://developer.arbitrum.io/'],
      explorers: ['https://arbiscan.io', 'https://explorer.arbitrum.io/'],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
      ],
      rollupCodes: 'https://rollup.codes/arbitrum-one',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Arbitrum One is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Forced txs can be delayed up to ${formatSeconds(
        selfSequencingDelay,
      )}. The state root gets finalized ${formatSeconds(
        challengeWindow * assumedBlockTime,
      )} after it has been posted.`,
    },
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.ARBITRUM })),
    associatedTokens: ['ARB'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'),
        tokens: ['ETH'],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradesProxyAdmin,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
        ...upgradesGatewaysAdmin,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa3A7B6F88361F48403514059F1F16C8E78d60EeC'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
        ...upgradesGatewaysAdmin,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA10c7CE4b876998858b1a9E12b10092229539400'),
        tokens: ['DAI'],
        description:
          'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a'),
        tokens: ['wstETH'],
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
      }),
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: VALUES.ARBITRUM.OLD_BRIDGE,
        sinceTimestamp: new UnixTime(1622243344),
        tokens: ['ETH'],
        isHistorical: true,
      },
    ],
    transactionApi: {
      type: 'rpc',
      // We need to subtract the Nitro system transactions
      // after the block of the update
      assessCount: subtractOneAfterBlockInclusive(22207818),
      startBlock: 1,
    },
    liveness: {
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
          ),
          selector: '0x8f111f3c',
          functionSignature:
            'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
          sinceTimestamp: new UnixTime(1661457944),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
          ),
          selector: '0x6f12b0c9',
          functionSignature:
            'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
          sinceTimestamp: new UnixTime(1661457944),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
          ),
          selector: '0xe0bc9729',
          functionSignature:
            'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
          sinceTimestamp: new UnixTime(1661457944),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
          ),
          selector: '0xa04cee60',
          functionSignature:
            'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
          sinceTimestamp: new UnixTime(1661455766),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. The challenge protocol can be subject to delay attacks.',
      sentiment: 'warning',
      sources: [
        {
          contract: 'ChallengeManager',
          references: [
            'https://etherscan.io/address/0x1c78B622961f27Ccc2f9BA65E2ba5d5eB301a445#code#F1#L113',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'SequencerInbox',
          references: [
            'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L206',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(l2TimelockDelay, selfSequencingDelay, 0),
      sentiment: 'bad',
      description: `Upgrades are initiated on L2 and have to go first through a ${formatSeconds(
        l2TimelockDelay,
      )} delay. Since there is a ${formatSeconds(
        selfSequencingDelay,
      )} to force a tx, users have only ${formatSeconds(
        l2TimelockDelay - selfSequencingDelay,
      )} to exit. If users post a tx after that time, they would need to self propose a root with a ${formatSeconds(
        validatorAfkTime,
      )} delay and then wait for the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window, while the upgrade would be confirmed just after the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window and the ${formatSeconds(
        l1TimelockDelay,
      )} L1 timelock.`,
      warning: 'The Security Council can upgrade with no delay.',
      sources: [
        {
          contract: 'OutboxV2',
          references: [
            'https://etherscan.io/address/0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840#code',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
      sources: [
        {
          contract: 'SequencerInbox',
          references: [
            'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
            'https://developer.arbitrum.io/sequencer',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
        validatorAfkBlocks * assumedBlockTime,
      ),
      sources: [
        {
          contract: 'RollupProxy',
          references: [
            'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F1#L55',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect. The challenge protocol can be subject to delay attacks.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'How is fraud proven - Arbitrum documentation FAQ',
          href: 'https://developer.offchainlabs.com/intro/#q-and-how-exactly-is-fraud-proven-sounds-complicated',
        },
        {
          text: 'Arbitrum Glossary: Challenge Period',
          href: 'https://developer.arbitrum.io/intro/glossary#challenge-period',
        },
        {
          text: 'RollupUser.sol#L288 - Etherscan source code, onlyValidator modifier',
          href: 'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F1#L288',
        },
        {
          text: 'Solutions to Delay Attacks on Rollups',
          href: 'https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Sequencing followed by deterministic execution - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/#sequencing-followed-by-deterministic-execution',
        },
        {
          text: 'SequencerInbox.sol#206 - Etherscan source code, addSequencerL2BatchFromOrigin function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L206',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'Sequencer - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      description:
        FORCE_TRANSACTIONS.CANONICAL_ORDERING.description +
        ' ' +
        VALUES.ARBITRUM.getProposerFailureString(validatorAfkBlocks),
      references: [
        {
          text: 'SequencerInbox.sol#L125 - Etherscan source code, forceInclusion function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
        },
        {
          text: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Transaction lifecycle - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/tx-lifecycle',
          },
          {
            text: 'L2 to L1 Messages - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
          },
          {
            text: 'Mainnet for everyone - Arbitrum Blog',
            href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
          },
        ],
        risks: [],
      },
      {
        name: 'Tradeable Bridge Exit',
        description:
          "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. The user will get the funds immediately, however the third party has to wait for the block to be finalized. This is implemented as a first party functionality inside Arbitrum's token bridge.",
        risks: [],
        references: [
          {
            text: 'Tradeable Bridge Exits - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
          },
        ],
      },
      EXITS.AUTONOMOUS,
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Arbitrum One uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
        },
      ],
      references: [
        {
          text: 'Inside Arbitrum Nitro',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
        },
      ],
    },
    upgradeMechanism: UPGRADE_MECHANISM.ARBITRUM_DAO(
      l1TimelockDelay,
      challengeWindow * assumedBlockTime,
      l2TimelockDelay,
    ),
  },
  stateDerivation: {
    nodeSoftware: `The rollup node (Arbitrum Nitro) consists of three parts. The base layer is the core Geth server (with minor modifications to add hooks) that emulates the execution of EVM contracts and maintains Ethereum's state. The middle layer, ArbOS, provides additional Layer 2 functionalities such as decompressing data batches, accounting for Layer 1 gas costs, and supporting cross-chain bridge functionalities. The top layer consists of node software, primarily from Geth, that handles client connections (i.e., regular RPC node). [View Code](https://github.com/OffchainLabs/nitro/)`,
    compressionScheme: `The Sequencer's batches are compressed using a general-purpose data compression algorithm known as [Brotli](https://github.com/google/brotli), configured to its highest compression setting.`,
    genesisState:
      'They performed a regenesis from Classic to Nitro, and that file represents the [last Classic state](https://snapshot.arbitrum.foundation/arb1/nitro-genesis.tar). To sync from the initial Classic state, instructions can be found [here](https://docs.arbitrum.io/migration/state-migration).',
    dataFormat: `Nitro supports Ethereum's data structures and formats by incorporating the core code of the popular go-ethereum ("Geth") Ethereum node software. The batch is composed of a header and a compressed blob, which results from compressing concatenated RLP-encoded transactions using the standard RLP encoding.`,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'SecurityCouncil',
      'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
      [
        {
          text: 'Security Council members - Arbitrum DAO Governance Docs',
          href: 'https://docs.arbitrum.foundation/foundational-documents/transparency-report-initial-foundation-setup',
        },
      ],
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ArbitrumProxyAdmin'),
      'This contract is an admin of SequencerInbox, RollupEventInbox, Bridge, Outbox, Inbox and ChallengeManager contracts. It is owned by the Upgrade Executor.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('UpgradeExecutor', 'admin'),
      "This contract is an admin of the UpgradeExecutor contract, but is also owned by it. Can cancel Timelock's proposals.",
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('L1GatewayRouter', 'admin'),
      'This is yet another proxy admin for the three gateway contracts. It is owned by the Upgrade Executor.',
    ),
    {
      name: 'Sequencer',
      accounts: VALUES.ARBITRUM.SEQUENCER,
      description:
        'Central actor allowed to set the order in which L2 transactions are executed.',
    },
    {
      name: 'Validators/Proposers',
      accounts: VALUES.ARBITRUM.VALIDATORS,
      description:
        'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('ArbitrumOneBridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('SequencerInbox', {
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('Inbox', {
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractFromValue('RollupProxy', 'outbox', {
        description:
          "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('UpgradeExecutor', {
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1ArbitrumTimelock.",
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('L1ArbitrumTimelock', {
        description:
          'Timelock contract for Arbitrum DAO Governance. It gives the DAO participants the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description: 'Router managing token <--> gateway mapping.',
        ...upgradesGatewaysAdmin,
      }),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_SC(
        Math.round(totalDelay / 86400).toString(), // delay in days
      ),
    ],
  },
  milestones: [
    {
      name: 'ARB token airdrop',
      link: 'https://twitter.com/arbitrum/status/1638888588443111425',
      date: '2023-03-23T00:00:00Z',
      description: 'ARB token launched as a governance token for Arbitrum DAO.',
    },
    {
      name: 'Nitro Upgrade',
      link: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
      date: '2022-08-31T00:00:00Z',
      description:
        'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
    },
    {
      name: 'Odyssey paused',
      link: 'https://twitter.com/arbitrum/status/1542159109511847937',
      date: '2022-06-29T00:00:00Z',
      description:
        'Due of the heavy load being put on the chain, Odyssey program got paused.',
    },
    {
      name: 'Odyssey started',
      link: 'https://twitter.com/arbitrum/status/1539292126105706496',
      date: '2022-06-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
    },
  ],
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/OffchainLabs/nitro/',
    },
  ),
  knowledgeNuggets: [
    {
      title: 'Arbitrum update boosts decentralization',
      url: 'https://twitter.com/bkiepuszewski/status/1594754717330309120',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Arbitrum is down... or is it?',
      url: 'https://twitter.com/bkiepuszewski/status/1438445910191710211',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_04,
    },
  ],
}
