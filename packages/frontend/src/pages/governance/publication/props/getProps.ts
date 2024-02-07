import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getPageMetadata } from '../../index/props/getPageMetadata'
import { GovernancePublicationPageProps } from '../view/GovernancePublicationPage'

export function getProps(
  publication: CollectionEntry<'publications'>,
  config: Config,
): Wrapped<GovernancePublicationPageProps> {
  return {
    props: {
      publication: publication,
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}
