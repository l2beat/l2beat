import { assert, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../common'
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
  upgradeability,
  display: {
    name: 'Boba Network',
    shortName: 'Boba',
    slug: 'bobanetwork',
    description:
      'Boba is an OP stack Optimistic Rollup built by the Enya team as core contributors to the Boba Foundation.',
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
  finality: {
    type: 'OPStack-blob',
    minTimestamp: new UnixTime(1713308507),
    genesisTimestamp: new UnixTime(1635396737),
    l2BlockTimeSeconds: 2,
    lag: 0,
  },
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    })
  ],
  nonTemplatePermissions: [
    ...(() => {
      const discoveredAdminOwner = discovery.getAddressFromValue(
        'ProxyAdmin',
        'owner',
      )
      const bobaMultisigAddress = discovery.getContract('BobaMultisig').address
      assert(
        discoveredAdminOwner === bobaMultisigAddress,
        'Update the permissions section if this changes. (BobaMultisig is not the ProxyAdmin anymore)',
      )
      return discovery.getMultisigPermission(
        'BobaMultisig',
        'Owner of the ProxyAdmin. It can upgrade the rollup system and the bridge implementation, potentially gaining access to all funds.',
      )
    })(),
  ],
  rpcUrl: 'https://mainnet.boba.network/',
  genesisTimestamp: new UnixTime(1635396737), // new UnixTime(1713297000) was Anchorage upgrade
  associatedTokens: ['BOBA', 'OMG'],
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      name: 'Boba Anchorage Upgrade',
      date: '2024-04-16T00:00:00Z',
      link: 'https://forum.boba.network/t/upgrade-boba-network-to-the-anchorage-framework/442',
      description: 'Boba upgrades to the OP stack (Bedrock).',
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
        'Boba’s proprietary technology enables dApps that trigger code executed on web-scale infrastructure.',
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
  chainConfig: {
    name: 'bobanetwork',
    chainId: 288,
    explorerUrl: 'https://eth.bobascan.com/',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/288/etherscan/api',
      type: 'etherscan',
    },
    coingeckoPlatform: 'boba',
    // ~ Timestamp of block number 1
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-10-28T03:57:19Z')),
  },
  knowledgeNuggets: [
    {
      title: 'What is Hybrid Compute?',
      url: 'https://twitter.com/bkiepuszewski/status/1521849011594010624',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
  ],
})
