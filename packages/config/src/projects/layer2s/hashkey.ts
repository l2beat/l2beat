import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('hashkey')

const genesisTimestamp = new UnixTime(1734347135)

export const hashkey = opStackL2({
  addedAt: new UnixTime(1736518370), // 2025-01-10T17:09:00Z
  discovery,
  additionalPurposes: ['Exchange'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'HashKey Chain',
    slug: 'hashkey',
    description:
      "HashKey Chain is a regulatory-compliant, institutional-grade OP stack Layer 2 solution bridging traditional finance and Web3. It is powered by Hong Kong's premier virtual asset ecosystem.",
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://hsk.xyz/'],
      apps: ['https://bridge.hsk.xyz/'],
      documentation: ['https://docs.hsk.xyz/'],
      explorers: [
        'https://explorer.hsk.xyz/',
        'https://hashkey.blockscout.com',
      ],
      repositories: ['https://github.com/HashKeyChain'],
      socialMedia: [
        'https://x.com/HashKeyHSK',
        'https://t.me/hashkeyhsk',
        'https://discord.com/invite/ujaF7aKAEk',
      ],
    },
  },
  chainConfig: {
    name: 'hashkey',
    chainId: 177,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.hsk.xyz',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['HSK'],
  },
  finality: {
    type: 'OPStack',
    minTimestamp: genesisTimestamp,
    genesisTimestamp: genesisTimestamp,
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  associatedTokens: ['HSK'],
  nonTemplateOptimismPortalEscrowTokens: ['HSK'],
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('HASHKEY'),
  isNodeAvailable: true,
})
