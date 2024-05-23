import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mint')

export const mint: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Mint',
    slug: 'mint',
    description: 'Mint Blockchain is a Layer 2 network for NFTs.',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://mintchain.io/'],
      apps: ['https://bridge.mintchain.io/'],
      documentation: ['https://docs.mintchain.io/'],
      explorers: ['https://explorer.mintchain.io'],
      repositories: ['https://github.com/Mint-Blockchain'],
      socialMedia: [
        'https://twitter.com/Mint_Blockchain',
        'https://discord.gg/mint-blockchain',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'mint',
    chainId: 185,
    explorerUrl: 'https://explorer.mintchain.io',
    explorerApi: {
      url: 'https://explorer.mintchain.io/api',
      type: 'blockscout',
    },
    multicallContracts: [
      {
        sinceBlock: 19861572,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    minTimestampForTvl: UnixTime.fromDate(new Date('2024-05-13T14:02:11Z')),
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc.mintchain.io',
    startBlock: 1,
    defaultCallsPerMinute: 800,
    assessCount: subtractOne,
  },
  isNodeAvailable: true,
  usesBlobs: true,
  genesisTimestamp: new UnixTime(1715608931),
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ConduitMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
  ],
})
