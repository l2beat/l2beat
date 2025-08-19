import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'

import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('l3x')

export const l3x: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1718370384), // 2024-06-14T13:06:24Z
  archivedAt: UnixTime(1743033600), // 2025-03-27T00:00:00.000Z,
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'L3X',
    slug: 'l3x',
    description:
      'L3X is an Orbit stack Appchain on Arbitrum focusing on DeFi (leveraged trading and liquid restaking).',
    links: {
      websites: ['https://l3x.com/'],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=l3x-network&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.l3x.com/'],
      explorers: ['https://explorer.l3x.com/'],
      socialMedia: ['https://t.me/l3x_protocol', 'https://x.com/l3x_protocol'],
    },
  },
  chainConfig: {
    name: 'l3x',
    chainId: 12324,
    explorerUrl: 'https://explorer.l3x.com',
    multicallContracts: [],
    sinceTimestamp: UnixTime(1714618907),
    coingeckoPlatform: 'l3x',
    apis: [
      {
        type: 'blockscout',
        url: 'https://explorer.l3x.com/api',
      },
    ],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: ChainSpecificAddress(
        'arb1:0x4fF3E70f30f0394Ad62428751Fe3858740595908',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    // prelaunch escrows
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'linea',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'mode',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'blast',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
})
