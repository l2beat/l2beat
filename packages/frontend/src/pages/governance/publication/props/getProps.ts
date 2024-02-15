import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'
import { GovernancePublicationPageProps } from '../view/GovernancePublicationPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  publication: CollectionEntry<'publications'>,
  config: Config,
): Wrapped<GovernancePublicationPageProps> {
  const publicationEntry = getGovernancePublicationEntry(publication)

  return {
    props: {
      publication: publicationEntry,
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(publicationEntry),
      banner: false,
    },
  }
}
