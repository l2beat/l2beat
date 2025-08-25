import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const fuse: ScalingProject = upcomingL2({
  id: 'fuse',
  capability: 'universal',
  addedAt: UnixTime(1692958606), // '2023-08-25T10:16:46Z'
  badges: [BADGES.VM.EVM, BADGES.DA.DAC],
  display: {
    name: 'Fuse',
    slug: 'fuse',
    description:
      'Fuse Ember is a Layer 2 blockchain, designed for real-world payments and scalable Web3 adoption. Powered by Polygon CDK and zkRollup technology, Ember delivers fast, low-cost transactions. It features DAC-powered data availability, Agglayer interoperability, and native account abstraction.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://fuse.io/'],
      bridges: ['https://fuse.io/network'],
      documentation: ['https://docs.fuse.io/fuse-ember/about-fuse-ember-l2/'],
      explorers: ['https://explorer.fuse.io/'],
      repositories: ['https://github.com/fuseio'],
      socialMedia: [
        'https://discord.gg/46QxE5ESzQ',
        'https://x.com/Fuse_network',
        'https://t.me/fuseio',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
