import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCollection, getCollectionEntry } from '~/content/get-collection'
import { env } from '~/env'
import { getDefaultMetadata } from '~/utils/metadata'
import { getGovernancePublicationEntry } from '../../_utils/get-governance-publication-entry'
import { GovernancePublicationPage } from './_page'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  if (env.VERCEL_ENV !== 'production') return []

  const publications = getCollection('publications')
  return publications.map((publication) => ({
    slug: publication.id,
  }))
}

export async function generateMetadata(props: Props): Promise<Metadata | null> {
  const params = await props.params
  const publication = getCollectionEntry('publications', params.slug)
  if (!publication) {
    return null
  }
  return getDefaultMetadata({
    title: `${publication.data.shortTitle ?? publication.data.title} - L2BEAT`,
    description: publication.data.description ?? publication.excerpt,
    openGraph: {
      type: 'article',
      url: `/governance/publications/${publication.id}`,
      images: [`/meta-images/governance/publications/${publication.id}.png`],
    },
  })
}

export default async function Page(props: Props) {
  const params = await props.params
  const publication = getCollectionEntry('publications', params.slug)
  if (!publication) {
    return notFound()
  }
  const publicationEntry = getGovernancePublicationEntry(publication)
  return <GovernancePublicationPage publication={publicationEntry} />
}
