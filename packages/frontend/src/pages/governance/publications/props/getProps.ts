import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { ContentEntry } from '../../../../content/getContent'
import { Wrapped } from '../../../Page'
import { getGovernancePublicationEntry } from '../../getGovernancePublicationEntry'
import { GovernanceAllPublicationsPageProps } from '../view/GovernanceAllPublicationsPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
  post: ContentEntry<'publications'>[],
): Wrapped<GovernanceAllPublicationsPageProps> {
  return {
    props: {
      publications: post.map(getGovernancePublicationEntry),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}
