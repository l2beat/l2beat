import { CollectionEntry } from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'
import { GovernancePublicationPageProps } from '../view/GovernancePublicationPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  publication: CollectionEntry<'publications'>,
): Wrapped<GovernancePublicationPageProps> {
  const publicationEntry = getGovernancePublicationEntry(publication)

  return {
    props: {
      publication: publicationEntry,
    },
    wrapper: {
      metadata: getPageMetadata(publicationEntry),
      banner: false,
    },
  }
}
