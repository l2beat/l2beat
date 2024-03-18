import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const stack: Layer3 = underReviewL3({
  id: 'stack',
  hostChain: ProjectId('base'),
  display: {
    name: 'Stack',
    slug: 'stack',
    description:
      'Stack Chain is an Optimistic Rollup on Base using OP Stack technology. \
            Stack Chain is a blockchain for bringing points onchain, allowing brands to create and own their loyalty programs.',
    category: 'Optimistic Rollup',
    purposes: ['Social', 'RWA'],
    links: {
      websites: ['https://stack.so/'],
      apps: ['https://bridge.stack.so'],
      documentation: ['https://docs.stack.so'],
      explorers: ['https://explorer.stack.so'],
      repositories: ['https://github.com/stack-so/protocol-interfaces'],
      socialMedia: [
        'https://twitter.com/stackdotso',
        'https://t.me/+RVFamOmYBo42NzFh',
        'https://stack.mirror.xyz/',
      ],
    },
  },
})