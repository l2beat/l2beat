import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import {
  CollectionEntry,
  getCollection,
} from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { getGovernancePublicationEntry } from '../../index/props/getGovernancePublicationEntry'
import { GovernancePublicationsPageProps } from '../view/GovernancePublicationsPage'
import { getPageMetadata } from './getPageMetadata'

export function getProps(
  config: Config,
): Wrapped<GovernancePublicationsPageProps> {
  const publications = getCollection('publications')

  return {
    props: {
      publications: getPublications(publications),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      banner: config.features.banner,
      metadata: getPageMetadata(),
    },
  }
}

function getPublications(publications: CollectionEntry<'publications'>[]) {
  return publications
    .sort((a, b) => {
      return b.data.publishedOn.getTime() - a.data.publishedOn.getTime()
    })
    .map(getGovernancePublicationEntry)
}
