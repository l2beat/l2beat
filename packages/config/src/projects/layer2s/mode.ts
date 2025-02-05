import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('mode')

export const mode: Layer2 = opStackL2({
  addedAt: new UnixTime(1695904849), // 2023-09-28T12:40:49Z
  discovery,
  additionalBadges: [Badge.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Mode Network',
    shortName: 'Mode',
    slug: 'mode',
    description:
      'Mode is an OP stack Optimistic Rollup building the AIFi economy. Their mission is to scale DeFi to billions of users through onchain agents and AI powered financial applications to build a more open, efficient, and inclusive financial future.',
    links: {
      websites: ['https://mode.network/'],
      apps: ['https://app.mode.network/'],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://modescan.io'],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetworkofficial',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
      ],
    },
  },
  associatedTokens: ['MODE'],
  rpcUrl: 'https://mainnet.mode.network/',
  genesisTimestamp: new UnixTime(1700125343),
  stateDerivation: DERIVATION.OPSTACK('MODE'),
  isNodeAvailable: true,
  milestones: [
    {
      title: 'Mode extracts 4800 ETH from the bridge',
      url: 'https://github.com/etherfi-protocol/postmortems',
      date: '2024-08-01T00:00:00Z',
      description:
        "Mode rescues Etherfi's lost funds on L2 by extracting them from the L1 bridge via an upgrade.",
      type: 'incident',
    },
    {
      title: 'Mode starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Mode starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Mode Network Mainnet Launch',
      url: 'https://twitter.com/modenetwork/status/1752760726907760933',
      date: '2024-01-31T00:00:00Z',
      description: 'Mode Network is live on mainnet.',
      type: 'general',
    },
    {
      title: 'MODE token airdrop',
      url: 'https://mode.mirror.xyz/2Aom53lrot8KQ143u8lCfyYvTOkR7LJcIChoyP1Q4wI',
      date: '2024-05-07T00:00:00Z',
      description: 'MODE token launched.',
      type: 'general',
    },
  ],
  finality: {
    type: 'OPStack',
    l2BlockTimeSeconds: 2,
    minTimestamp: new UnixTime(1710386375),
    genesisTimestamp: new UnixTime(1700167583),
    lag: 0,
    stateUpdate: 'analyze',
  },
  chainConfig: {
    name: 'mode',
    chainId: 34443,
    explorerUrl: 'https://explorer.mode.network',
    explorerApi: {
      url: 'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Mode
    // The first full hour timestamp that will return the block number
    // https://explorer.mode.network/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-11-16T22:46:23Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'mode',
  },
  nonTemplateExcludedTokens: ['rsETH'],
})
