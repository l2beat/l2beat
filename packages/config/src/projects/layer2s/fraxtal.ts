import { UnixTime } from '@l2beat/shared-pure'

import { DA_BRIDGES, DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('fraxtal')

export const fraxtal: Layer2 = opStackL2({
  createdAt: new UnixTime(1708511622), // 2024-02-21T10:33:42Z
  additionalBadges: [Badge.DA.CustomDA, Badge.Infra.Superchain],
  daProvider: {
    layer: DA_LAYERS.FRAXTAL_DA,
    riskView: {
      value: 'External',
      description:
        'Proof construction and state derivation rely fully on data that is NOT published on chain. Fraxtal uses a separate data availability module developed by the Frax Core Team, and data availability attestations are not published on chain.',
      sentiment: 'bad',
    },
    technology: {
      name: 'Data required to compute fraud proof is not published on chain, and currently not publicly accessible',
      description:
        'Fraxtal uses a separate data availability module developed by the Frax Core Team. Data is posted off chain, and only hashes of blob data is published on an on chain inbox.',
      references: [
        {
          text: 'Fraxtal documentation',
          href: 'https://docs.frax.com/fraxtal',
        },
        {
          text: 'On-Chain Inbox',
          href: 'https://etherscan.io/address/0xff000000000000000000000000000000000420fc',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the data is not made available on the external provider.',
          isCritical: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an unavailable or malicious transaction root.',
          isCritical: true,
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
  },
  associatedTokens: ['FXS', 'FPIS'],
  discovery,
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'Fraxtal',
    slug: 'fraxtal',
    description:
      'Fraxtal is an EVM equivalent Optimium utilizing the OP stack as its smart contract platform and execution environment.',
    links: {
      websites: ['https://frax.com/'],
      apps: ['https://app.frax.finance/'],
      documentation: ['https://docs.frax.com/'],
      explorers: ['https://fraxscan.com/'],
      repositories: ['https://github.com/FraxFinance'],
      socialMedia: [
        'https://discord.com/invite/UJVtDTFRaA',
        'https://twitter.com/fraxfinance',
        'https://t.me/fraxfinance',
      ],
    },
  },
  rpcUrl: 'https://rpc.frax.com',
  genesisTimestamp: new UnixTime(1706811599),
  isNodeAvailable: true,
  chainConfig: {
    name: 'fraxtal',
    chainId: 252,
    explorerUrl: 'https://fraxscan.com/',
    explorerApi: {
      url: 'https://api.fraxscan.com/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 1
    minTimestampForTvl: new UnixTime(1706810713),
    coingeckoPlatform: 'fraxtal',
  },
  nonTemplateEscrows: [],
  nonTemplateOptimismPortalEscrowTokens: ['frxETH'],
  discoveryDrivenData: true,
})
