import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'
import { zkStackL2 } from '../../templates/zkStack'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { REASON_FOR_BEING_OTHER } from '../../common'

const discovery = new ProjectDiscovery('lens')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)

export const lens: ScalingProject = zkStackL2({
  capability: 'universal',
  additionalPurposes: ['Social'],
  addedAt: UnixTime(1716536821), // 2024-05-24T07:47:01Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
  display: {
    name: 'Lens',
    slug: 'lens',
    description: "Lens Network is the main social networking hub for the entire user base of Lens Protocol, built using ZKsync's ZK Stack technology.",
    stack: 'ZK Stack',
    links: {
      websites: ['https://lens.xyz'],
      apps: ['https://lens.xyz/mint'],
      documentation: ['https://lens.xyz/docs'],
      explorers: ['https://momoka.lens.xyz'],
      repositories: ['https://github.com/lens-protocol'],
      socialMedia: [
        'https://hey.xyz/u/lens',
        'https://x.com/lensprotocol',
        'https://discord.com/invite/lensprotocol',
      ],
    },
  },
  discovery,
  discovery_ZKstackGovL2,
  diamondContract: discovery.getContract('LensZkEvm'),
})
