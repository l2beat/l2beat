import React from 'react'

import { Config } from '../../../build/config'
import { PageWrapper } from '../../../components'
import { CollectionEntry, getCollection } from '../../../content/getCollection'
import { getProps } from './props/getProps'
import { GovernancePublicationPage } from './view/GovernancePublicationPage'

export function getGovernancePublicationPages(config: Config) {
  const publications = getCollection('publications')

  return publications.map((publication) =>
    getGovernancePublicationPage(publication, config),
  )
}

function getGovernancePublicationPage(
  publication: CollectionEntry<'publications'>,
  config: Config,
) {
  const { wrapper, props } = getProps(publication, config)
  return {
    slug: `/governance/publications/${publication.id}`,
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePublicationPage {...props} />
      </PageWrapper>
    ),
  }
}
