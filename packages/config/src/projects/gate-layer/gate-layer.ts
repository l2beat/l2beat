import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const gateLayer: ScalingProject = upcomingL2({
  id: 'gate-layer',
  capability: 'universal',
  hasTestnet, true,
  addedAt: UnixTime(1754639625),
  display: {
    name: 'Gate Layer',
    slug: 'gate-layer',
    description:
      'Gate Layer is an OP Stack L2, built to deliver exchange-grade throughput and ultra-low fees for EVM-compatible Web3 apps',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://www.gate.com/'],
      documentation: ['https://www.gatechain.io/docs/GateLayer/introduction'],
      explorers: ['https://gatescan.org/gatelayer'],
      socialMedia: ['https://x.com/gatechain_io'],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
