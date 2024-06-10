import type { Metadata } from 'next'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { FullPageHeader } from '~/app/_components/full-page-header'
import { LinkWithThumbnail } from '~/app/_components/link-with-thumbnail'
import { getCollection } from '~/content/getCollection'
import { getDefaultMetadata } from '~/utils/get-default-metadata'
import {
  type GovernancePublicationEntry,
  getGovernancePublicationEntry,
} from '../_utils/get-governance-publication-entry'
import { getGovernanceOpenGraphImageUrl } from './og-image/_utils/get-open-graph-image-url'

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
      <Header />
      <ContentWrapper as="main">
        <h1 className="mt-20 text-3xl font-bold">
          All governance publications
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((publication) => (
            <PublicationCard publication={publication} key={publication.id} />
          ))}
        </div>
      </ContentWrapper>
    </>
  )
}

function Header() {
  return (
    <FullPageHeader contentWrapperClassName="flex-col md:text-center md:items-center items-start">
      <h1 className="mb-6 text-5xl font-bold">Governance publications</h1>
      <p className="text-xl">
        Explore the L2BEAT Governance publications, and discover the latest
        insights, analyses, and updates on Layer 2 project governance, curated
        by our L2BEAT Governance Team. Empower your blockchain decisions with
        our focused research and discussions on decentralized governance.
      </p>
    </FullPageHeader>
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
      src={getGovernanceOpenGraphImageUrl({
        title: publication.title,
      })}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      }
      description={publication.description ?? publication.excerpt}
      orientation="vertical"
      className="justify-self-center"
    />
  )
}
