import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('lisk')

export const lisk: ScalingProject = opStackL2({
  addedAt: UnixTime(1731369600), // 2024-11-12T00:00:00Z
  discovery,
  genesisTimestamp: UnixTime(1714728793),
  associatedTokens: ['LSK'],
  additionalBadges: [BADGES.RaaS.Gelato, BADGES.Other.MigratedFromL1],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Lisk',
    slug: 'lisk',
    description:
      'Lisk is an OP stack rollup on Ethereum that migrated from the L1 blockchain of the same name.',
    links: {
      websites: ['https://lisk.com/'],
      bridges: [
        'https://bridge.lisk.com/bridge/lisk',
        'https://portal.lisk.com/',
      ],
      documentation: ['https://docs.lisk.com/'],
      explorers: ['https://blockscout.lisk.com/'],
      repositories: ['https://github.com/LiskHQ/lisk-node'],
      socialMedia: [
        'https://x.com/LiskHQ',
        'https://lisk.chat/',
        'https://reddit.com/r/lisk/',
        'https://facebook.com/LiskHQ',
        'https://linkedin.com/company/lisk',
        'https://instagram.com/lisk_blockchain',
        'https://t.me/Lisk_HQ',
        'https://youtube.com/channel/UCuqpGfg_bOQ8Ja4pj811PWg',
      ],
    },
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://lisk.com/blog/posts/lisk-user-mainnet-is-live/',
      date: '2024-11-12T00:00:00Z',
      description: 'Lisk launches its User Mainnet.',
      type: 'general',
    },
  ],
  l1StandardBridgePremintedTokens: ['LSK'],
  nonTemplateExcludedTokens: ['USDC', 'wstETH'],
  // not ready yet, check this PR https://github.com/ethereum-optimism/superchain-registry/pull/234 or the prepared links in `DERIVATION.OPSTACK('LISK')`
  // stateDerivation: DERIVATION.OPSTACK('LISK'),
  isNodeAvailable: true,
  chainConfig: {
    name: 'lisk',
    chainId: 1135,
    coingeckoPlatform: 'lisk',
    sinceTimestamp: UnixTime(1714746983),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.api.lisk.com',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xE3622468Ea7dD804702B56ca2a4f88C0936995e6',
      ),
      name: 'External USDC Vault',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom externally governed escrow for USDC bridged to Lisk.',
      tokens: ['USDC'],
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xEb99c8c87c5e0C2dCb01E2A1E35AA01f5889F677',
      ),
      name: 'External EURC Vault',
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Custom externally governed escrow for EURC bridged to Lisk.',
      tokens: ['EURC'],
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x9348AF23B01F2B517AFE8f29B3183d2Bb7d69Fcf',
      ),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
})
