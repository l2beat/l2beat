import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('inevm')

export const inevm: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1709769600), // 2024-03-07
  additionalPurposes: ['Interoperability'],
  additionalBadges: [BADGES.RaaS.Caldera],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'inEVM',
    slug: 'inevm',
    description:
      'inEVM is an Orbit stack Optimium built by the Injective team, complementing their Cosmos L1 and Wormhole integration with an EVM-based Layer 3 for Ethereum interoperability.',
    links: {
      websites: ['https://inevm.com/'],
      bridges: [
        'https://inevm.bridge.caldera.xyz/',
        'https://inevmbridge.com/',
      ],
      documentation: ['https://docs.inevm.com/'],
      explorers: ['https://inevm.calderaexplorer.xyz/'],
      socialMedia: ['https://x.com/injective'],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae',
      ),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0x173B8dd6960d8922DCF7eD29E245B1041Fcf71Ae',
      ),
      name: 'CustomGateway',
      description:
        'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
      tokens: '*',
    }),
  ],
  untrackedGasTokens: ['INJ'],
  // associatedTokens: ['INJ'] // not adding it because it seems to be minted randomly on arbitrum
  chainConfig: {
    name: 'inevm',
    chainId: 2525,
    apis: [
      {
        type: 'rpc',
        url: 'https://inevm.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['INJ'],
  },
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/injective/status/1765755882216841264',
      date: '2024-03-07T00:00:00Z',
      description: 'inEVM launches its Mainnet.',
      type: 'general',
    },
  ],
})
