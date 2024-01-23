import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePostEntry } from '../../getGovernancePostEntry'
import { GovernanceAllPostsPageProps } from '../view/GovernanceAllPostsPage'

export function getProps(
  config: Config,
  post: CollectionEntry<'posts'>[],
): Wrapped<GovernanceAllPostsPageProps> {
  return {
    props: {
      posts: post.map(getGovernancePostEntry),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'Governance - L2BEAT',
        description: 'Governance - L2BEAT',
        // TODO: (governance) some image?
        image: '',
        url: 'https://l2beat.com/governance/posts',
      },
      banner: false,
    },
  }
}
