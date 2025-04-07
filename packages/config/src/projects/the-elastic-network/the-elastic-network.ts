import { ProjectId } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const theElasticNetwork: BaseProject = {
  id: ProjectId('the-elastic-network'),
  slug: 'the-elastic-network',
  name: 'The Elastic Network',
  shortName: undefined,
  addedAt: 1743677000,
  display: {
    description:
      'An ever-expanding, verifiable network of blockchains, powered by ZKsync',
    links: {
      websites: ['https://www.zksync.io/'],
    },
    badges: [BADGES.Stack.ZKStack, BADGES.Infra.ElasticChain],
  },
  ecosystemConfig: {
    links: {
      buildOn: 'https://docs.zksync.io/',
      learnMore: 'https://zksync.io/',
      governanceTopDelegates: 'https://www.tally.xyz/gov/zksync/delegates',
      governanceProposals: 'https://www.tally.xyz/gov/zksync/proposals',
    },
    colors: {
      primary: '#513BE5',
      secondary: '#4276FF',
    },
    ecosystemToken: {
      name: 'ZK',
      chain: 'ethereum',
      description: 'ZK is the governance token for the Elastic Network.',
    },
    governanceReviews: true,
  },
}
