import React from 'react'

import { PageWrapper } from '../../../components'
import { CollectionEntry, getCollection } from '../../../content/getCollection'
import { getProps } from './props/getProps'
import { GovernancePublicationPage } from './view/GovernancePublicationPage'

export function getGovernancePublicationPages() {
  const publications = getCollection('publications')

  return publications.map((publication) =>
    getGovernancePublicationPage(publication),
  )
}

function getGovernancePublicationPage(
  publication: CollectionEntry<'publications'>,
) {
  const { wrapper, props } = getProps(publication)
  return {
    slug: `/governance/publications/${publication.id}`,
    page: (
      <PageWrapper {...wrapper}>
        <GovernancePublicationPage {...props} />
      </PageWrapper>
    ),
  }
}
