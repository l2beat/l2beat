import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const zklinknexus: Layer3 = underReviewL3({
  id: 'zklinknexus',
  // TODO(Linea, zkSync Era): zkLink Nexus is a multi-chain zkRollup architecture. In addition to Linea, it currently supports zkSync Era and will support more Layer2s in the future.
  hostChain: 'Multiple',
  display: {
    name: 'zkLink Nexus',
    slug: 'zklinknexus',
    description:
      'zkLink is a multi-chain rollup infrastructure based on zero-knowledge technology.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    provider: 'zkLink Nexus',
    links: {
      websites: ['https://zk.link'],
      apps: ['https://playground-nexus.zk.link'],
      documentation: ['https://docs.zk.link'],
      explorers: ['https://scan-nexus.zk.link'],
      repositories: ['https://github.com/zkLinkProtocol'],
      socialMedia: [
        'https://blog.zk.link',
        'https://twitter.com/zkLink_Official',
        'http://discord.gg/zklink',
        'https://t.me/zkLinkorg',
      ],
    },
  },
})
