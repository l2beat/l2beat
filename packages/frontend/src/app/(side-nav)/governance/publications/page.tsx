import type { Metadata } from 'next'
import { LinkWithThumbnail } from '~/components/link-with-thumbnail'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import type { GovernancePublicationEntry } from '../_utils/get-governance-publication-entry'
import { getGovernancePublicationEntry } from '../_utils/get-governance-publication-entry'

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

  return (
    <>
      <MainPageHeader>Governance Publications</MainPageHeader>
      <PrimaryCard className="md:p-8">
        <h1 className="mb-4 text-3xl font-bold md:hidden">
          Governance Publications
        </h1>
        <p className="md:paragraph-18 paragraph-16">
          Explore the L2BEAT Governance publications, and discover the latest
          insights, analyses, and updates on Layer 2 project governance, curated
          by our L2BEAT Governance Team. Empower your blockchain decisions with
          our focused research and discussions on decentralized governance.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication) => (
            <PublicationCard publication={publication} key={publication.id} />
          ))}
        </div>
      </PrimaryCard>
    </>
  )
}

function PublicationCard({
  publication,
}: {
  publication: GovernancePublicationEntry
}) {
  return (
    <LinkWithThumbnail
      href={`/governance/publications/${publication.id}`}
      src={`/meta-images/governance/publications/${publication.id}.png`}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <p className="subtitle-12 uppercase text-purple-100 dark:text-pink-200">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      }
      description={publication.description ?? publication.excerpt}
      orientation="vertical"
      className="justify-self-center hover:bg-surface-tertiary"
    />
  )
}
