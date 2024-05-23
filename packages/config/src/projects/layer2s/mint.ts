import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mint')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const mint: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Mint',
    slug: 'mint',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Mint is the L2 blockchain for NFT Industry, powered by the OP Stack.',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://www.mintchain.io'],
      apps: ['https://bridge.mintchain.io'],
      documentation: ['https://docs.mintchain.io'],
      explorers: ['https://explorer.mintchain.io'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Mint_Blockchain',
        'https://discord.gg/mint-blockchain',
        'https://mirror.xyz/mintchain.eth',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc.mintchain.io',
  genesisTimestamp: new UnixTime(1715608931),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      name: 'Mint Blockchain Dev Mainnet Launch',
      link: 'https://x.com/Mint_Blockchain/status/1790760551565676997',
      date: '2024-05-15T00:00:00Z',
      description: 'Mint Dev Mainnet is Now Live.',
    },
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ProxyAdminOwner',
      'Owner of the ProxyAdmin: it can upgrade the bridge implementation potentially gaining access to all funds, and change any system component. Also designated as the owner of the SystemConfig, meaning it can update the preconfer address, the batch submitter address and the gas configuration of the system.',
    ),
  ],
  chainConfig: {
    name: 'mint',
    chainId: 185,
    explorerUrl: 'https://explorer.mintchain.io',
    explorerApi: {
      url: 'https://explorer.mintchain.io/api-docs',
      type: 'blockscout',
    },
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-05-14T10:00:10Z')),
  },
  usesBlobs: true,
})
