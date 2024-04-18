import { UnixTime } from '@l2beat/shared-pure'

import { NUGGETS, DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('bobanetwork')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const bobanetwork: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Boba Network',
    shortName: 'Boba',
    slug: 'bobanetwork',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    description:
      'Boba is an EVM-compatible Optimistic Rollup forked from Optimism and built by the Enya team as core contributors to the Boba Foundation.',
    purposes: ['Universal'],
    links: {
      websites: ['https://boba.network'],
      apps: [],
      documentation: ['https://docs.boba.network/'],
      explorers: ['https://bobascan.com/'],
      repositories: ['https://github.com/bobanetwork/boba'],
      socialMedia: [
        'https://boba.network/',
        'https://boba.network/blog/',
        'https://enya.ai/about-us/',
        'https://twitter.com/bobanetwork',
        'https://t.me/bobanetwork',
        'https://discord.com/invite/Hvu3zpFwWd',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  genesisTimestamp: new UnixTime(1635393439),
  rpcUrl: 'https://mainnet.boba.network/',
  finality: {
    type: 'OPStack-blob',
    // timestamp of the first blob tx
    minTimestamp: new UnixTime(1713302880),
    l2BlockTimeSeconds: 2,
    genesisTimestamp: new UnixTime(1713302879),
    lag: 0,
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'BobaMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power). This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
  ],
  stateDerivation: {
    ...DERIVATION.OPSTACK('BOBA'),
    genesisState:
      'Since BOBA Mainnet has migrated from the OVM to Anchorage, a node must be synced using a data directory that can be found [here](https://docs.boba.network/developer/node-operators/snapshot-downloads).',
  },
  upgradesAndGovernance:
    'All contracts are upgradable by the `ProxyAdmin` which is controlled by a 4/3 multisig composed by the Boba Foundation.',
  isNodeAvailable: true,
  hasProperSecurityCouncil: false,
  milestones: [
    {
      name: 'Boba Mainnet migration to Anchorage',
      link: 'https://twitter.com/bobanetwork/status/1780264388462854181',
      date: '2024-04-16T20:00:00Z',
      description: 'Boba Mainnet migrated to Anchorage.',
    },
    {
      name: 'Boba launches L2 on BNB',
      date: '2022-11-01T00:00:00Z',
      link: 'https://boba.network/education/multichain/bobabnb/',
      description: 'Boba launches on BnB.',
    },
    {
      name: 'Boba launches L2 on Avalanche',
      date: '2022-09-21T00:00:00Z',
      link: 'https://boba.network/blog/an-avalanche-of-boba-is-coming/',
      description: 'Boba launches on Avalanche.',
    },
    {
      name: 'Boba launches L2 on Moonbeam and Fantom',
      date: '2022-06-02T00:00:00Z',
      link: 'https://boba.network/education/boba-basics/multichain/',
      description: 'Boba launches on Moonbeam and Fantom.',
    },
    {
      name: 'Call data compression',
      date: '2022-10-08T00:00:00Z',
      link: 'https://boba.network/blog/boba-call-data-compression/',
      description:
        'The Boba Tree From (v0.1.0) release introduces Brotli compression for call data.',
    },
    {
      name: 'Hybrid Compute',
      date: '2022-03-18T00:00:00Z',
      link: 'https://boba.network/education/boba-basics/hybrid-compute/',
      description:
        'Boba\'s proprietary technology enables dApps that trigger code executed on web-scale infrastructure.',
    },
    {
      name: 'Mainnet launch',
      date: '2021-09-20T00:00:00Z',
      link: 'https://www.enya.ai/press/public-mainnet',
      description:
        'Layer 2 Optimistic Rollup based on the Optimism codebase is live on Ethereum.',
    },
    {
      name: 'BOBA Token launched',
      date: '2021-11-18T00:00:00Z',
      link: 'https://boba.network/Boba-airdrop-live/',
      description: 'BOBA token launched by OMG Foundation.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'What is Hybrid Compute?',
      url: 'https://twitter.com/bkiepuszewski/status/1521849011594010624',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
  chainConfig: {
    name: 'boba',
    chainId: 288,
    explorerUrl: 'https://bobascan.com',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan/api',
      type: 'etherscan',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-9-20T00:00:00Z')),
    coingeckoPlatform: 'boba-network',
  },
  usesBlobs: true,
})
