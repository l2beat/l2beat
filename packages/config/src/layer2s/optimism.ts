import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  formatSeconds,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { DERIVATION, MILESTONES, NUGGETS } from '../common'
import { subtractOneAfterBlockInclusive } from '../common/assessCount'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'
const discovery = new ProjectDiscovery('optimism')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
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
  {
    id: AssetId('optimism:exa-exactly-token'),
    name: 'Exactly Token',
    symbol: 'EXA',
    decimals: 18,
    iconUrl:
      'https://assets.coingecko.com/coins/images/31089/large/EXA.png?1696529921',
    address: EthereumAddress('0x1e925de1c68ef83bd98ee3e130ef14a50309c01b'),
    coingeckoId: CoingeckoId('exa'),
    sinceTimestamp: new UnixTime(1691546460),
    category: 'other',
    type: 'NMV',
    formula: 'circulatingSupply',
  },
]

export const optimism: Layer2 = opStack({
  discovery,
  display: {
    name: 'OP Mainnet',
    slug: 'optimism',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'OP Mainnet is an EVM-equivalent Optimistic Rollup. It aims to be fast, simple, and secure.',
    purposes: ['Universal'],
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
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.OPTIMISM })),
  associatedTokens: ['OP'],
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
  ),
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    assessCount: subtractOneAfterBlockInclusive(105235064),
  },
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0xFF00000000000000000000000000000000000010'),
  genesisTimestamp: new UnixTime(1686074603),
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  stateDerivation: {
    ...DERIVATION.OPSTACK('OP_MAINNET'),
    genesisState:
      'Since OP Mainnet has migrated from the OVM to Bedrock, a node must be synced using a data directory that can be found [here](https://community.optimism.io/docs/useful-tools/networks/#links). To reproduce the migration itself, see this [guide](https://blog.oplabs.co/reproduce-bedrock-migration/).',
  },
  isNodeAvailable: true,
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
      title: 'The Optimistic Vision',
      url: 'https://www.optimism.io/vision',
      thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_VISION,
    },
  ],
  nonTemplateEscrows: [
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
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'OptimismMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals, and as a Challenger for state roots. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
  ],
  chainConfig: {
    name: 'optimism',
    chainId: 10,
    explorerUrl: 'https://optimistic.etherscan.io',
    explorerApi: {
      url: 'https://api-optimistic.etherscan.io/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 138 on Optimism
    // The first full hour timestamp that will return the block number
    // https://optimistic.etherscan.io/block/138
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-11-11T22:00:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 4286263,
        version: '3',
      },
      {
        sinceBlock: 0,
        batchSize: 150,
        address: EthereumAddress('0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe'),
        version: 'optimism',
      },
    ],
  },
})
