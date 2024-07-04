import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('sanko', 'arbitrum')

export const sanko: Layer3 = orbitStackL3({
  discovery,
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Sanko',
    slug: 'sanko',
    description:
      'Sanko is an NFT and gaming-focused Orbit stack L3 on Arbitrum with AnyTrust DA and DMT as its native token, created by Sanko GameCorp.',
    purposes: ['Gaming', 'NFT', 'Social'],
    links: {
      websites: ['https://sanko.xyz/'],
      apps: ['https://sanko.xyz/bridge'],
      documentation: ['https://sanko-1.gitbook.io/sanko-mainnet-docs/'],
      explorers: [
        'https://sanko-mainnet.calderaexplorer.xyz/',
        'https://tools.sanko.xyz/',
        'https://explorer.sanko.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://x.com/SankoGameCorp',
        'https://discord.gg/Cnz62Vfa2C',
        'https://t.me/sankogamecorp',
      ],
    },
  },
  chainConfig: {
    name: 'sanko',
    chainId: 1996,
    explorerUrl: 'https://explorer.sanko.xyz/',
    explorerApi: {
      url: 'https://explorer.sanko.xyz/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 38,
        version: '3',
      },
    ],
    minTimestampForTvl: new UnixTime(1712970000),
    coingeckoPlatform: 'sanko',
  },
  nativeToken: 'DMT',
  associatedTokens: ['DMT'],
  rpcUrl: 'https://mainnet.sanko.xyz',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0xb4951c0C41CFceB0D195A95FE66280457A80a990'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'Caldera Multisig',
      'Rollup Owner: Can execute upgrades for the entire rollup system via the UpgradeExecutor.',
    ),
  ],
})
