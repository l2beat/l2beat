import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('rari', 'arbitrum')

export const rari: Layer3 = orbitStackL3({
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum, Badge.RaaS.Caldera],
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'RARI Chain',
    slug: 'rari',
    description:
      'RARI Chain embeds royalties on the node level to guarantee royalty payments. A secure, low-cost, decentralized Ethereum L3 blockchain powered by Arbitrum.',
    purposes: ['NFT'],
    links: {
      websites: ['https://rarichain.org/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=rari-mainnet&sourceChain=arbitrum-one',
      ],
      documentation: ['https://rari.docs.caldera.dev/'],
      explorers: ['https://mainnet.explorer.rarichain.org/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: ['https://twitter.com/RariChain'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://mainnet.rpc.rarichain.org/http',
  nonTemplateContracts: [
    discovery.getContractDetails('L1GatewayRouter', {
      description: 'Router managing token <--> gateway mapping.',
    }),
  ],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x46406c88285AD9BE2fB23D9aD96Cb578d824cAb6'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x8bE956aB42274056ef4471BEb211b33e258b7324'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'Caldera Multisig',
      'Rollup Owner: Can execute upgrades for the entire rollup system via the UpgradeExecutor.',
    ),
  ],
  chainConfig: {
    name: 'rari',
    chainId: 1380012617,
    explorerUrl: 'https://mainnet.explorer.rarichain.org',
    explorerApi: {
      url: 'https://rari.calderaexplorer.xyz/api',
      type: 'blockscout',
    },
    blockscoutV2ApiUrl: 'https://rari.calderaexplorer.xyz/api/v2',
    minTimestampForTvl: new UnixTime(1705716145),
  },
  milestones: [
    {
      name: 'RARI Chain Mainnet Launch',
      link: 'https://x.com/RariChain/status/1750157295466824066',
      date: '2024-01-24T00:00:00.00Z',
      description: 'RARI Chain launches on Arbitrum One.',
      type: 'general',
    },
  ],
})
