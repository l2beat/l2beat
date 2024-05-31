import type { Metadata } from 'next'
import { getCollection, getCollectionEntry } from '~/content/getCollection'

interface Props {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const publications = getCollection('publications')

  return publications.map((publication) => ({
    slug: publication.id,
  }))
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | null> {
  const publication = getCollectionEntry('publications', params.slug)
  return {
    title: `${publication.data.shortTitle ?? publication.data.title} - L2BEAT`,
    description: publication.data.description ?? publication.excerpt,
    openGraph: {
      type: 'article',
      url: `/governance/publications/${publication.id}`,
    },
  }
}

export default function Page({ params }: Props) {
  return <>{params.slug}</>
}
