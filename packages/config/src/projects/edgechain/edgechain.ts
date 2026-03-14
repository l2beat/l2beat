import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('edgechain')

export const edgechain: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1773273600), // 2026-03-12T00:00:00Z
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum],
  overridingPurposes: ['Exchange'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'Edge Chain',
    slug: 'edgechain',
    description:
      'Edge Chain is an Arbitrum Orbit L3 built by EdgeX, an on-chain trading platform. It uses a modular architecture that separates trading execution from standard DeFi logic, with native USDC support via CCTP.',
    links: {
      websites: ['https://edgex.exchange'],
      bridges: ['https://pro.edgex.exchange'],
      documentation: ['https://edgex-1.gitbook.io/edgeX-documentation'],
      explorers: ['https://pro.edgex.exchange/en-US/explorer'],
      socialMedia: [
        'https://x.com/edgeX_exchange',
        'https://discord.com/invite/edgeX',
        'https://medium.com/@edgexexchange',
        'https://t.me/edgeX_exchange',
      ],
    },
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  chainConfig: {
    name: 'edgechain',
    chainId: 3343,
    sinceTimestamp: UnixTime(1761511538),
    apis: [
      {
        type: 'rpc',
        url: 'https://edge-mainnet.g.alchemy.com/v2/p7XZ9PmQlUFoTRxwIeB38',
        callsPerMinute: 300,
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: ChainSpecificAddress(
        'arb1:0x107695630130919cb040B095b9b20511D6e211bB',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L3 a generic, "wrapped" token will be minted.',
    }),
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: 'Edge Chain Mainnet Launch',
      url: 'https://blog.arbitrum.io/edgex-announces-edge-chain-on-arbitrum/',
      date: '2026-03-01T00:00:00Z',
      description: 'EdgeX launches Edge Chain on Arbitrum.',
      type: 'general',
    },
  ],
})
