import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { GovernancePostPageProps } from '../view/GovernancePostPage'

export function getProps(
  config: Config,
  post: CollectionEntry<'posts'>,
): Wrapped<GovernancePostPageProps> {
  return {
    props: {
      post: {
        content: post.content,
      },
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'Governance - L2BEAT',
        description: 'Governance - L2BEAT',
        // TODO: (governance) some image?
        image: '',
        url: 'https://l2beat.com/gov/',
      },
      banner: false,
    },
  }
}
