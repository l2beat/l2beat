import type { Metadata } from 'next'
import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import { getGovernancePublicationEntry } from '../_utils/get-governance-publication-entry'
import { GovernancePublicationsPage } from './_page'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Governance publications - L2BEAT',
  description:
    'Explore publications from L2BEAT Governance, discover the latest insights, analyses, and updates on Layer 2 project governance, curated by our L2BEAT Governance Team',
  openGraph: {
    url: '/governance/publications',
  },
})

export default function Page() {
  const publications = getCollection('publications')
    .sort((b, a) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .map(getGovernancePublicationEntry)

  return <GovernancePublicationsPage publications={publications} />
}
