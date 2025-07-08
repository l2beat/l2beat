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
      'An ever-expanding, verifiable network of blockchains, powered by ZKsync.',
    links: {
      websites: ['https://www.zksync.io/'],
    },
    badges: [BADGES.Stack.ZKStack, BADGES.Infra.ElasticChain],
  },
  colors: {
    primary: '#513BE5',
    secondary: '#4276FF',
  },
  ecosystemConfig: {
    links: {
      buildOn: 'https://docs.zksync.io/',
      learnMore: 'https://zksync.io/',
      governanceDelegateToL2BEAT:
        'https://www.tally.xyz/gov/zksync/delegate/delegate.l2beat.eth',
      governanceProposals: 'https://www.tally.xyz/gov/zksync/proposals',
    },
    token: {
      tokenId: 'zksync2-ZK',
      projectId: ProjectId('zksync2'),
      description:
        'The ZK token is a governance token that allows token holders to introduce and vote on protocol upgrades within the Elastic Network.',
    },
  },
}
