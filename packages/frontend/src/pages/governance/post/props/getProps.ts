import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePostEntry } from '../../getGovernancePostEntry'
import { GovernancePostPageProps } from '../view/GovernancePostPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  post: CollectionEntry<'posts'>,
): Wrapped<GovernancePostPageProps> {
  return {
    props: {
      post: getGovernancePostEntry(post),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}
