import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { Article } from '~/components/markdown/article'
import { getCollection, getCollectionEntry } from '~/content/get-collection'
import { roboto_serif } from '~/fonts'
import { cn } from '~/utils/cn'
import { getDefaultMetadata } from '~/utils/metadata'
import {
  type GovernancePublicationEntry,
  getGovernancePublicationEntry,
} from '../../_utils/get-governance-publication-entry'

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

export default function Page({ params }: Props) {
  const publication = getCollectionEntry('publications', params.slug)
  if (!publication) {
    return notFound()
  }
  const publicationEntry = getGovernancePublicationEntry(publication)
  return (
    <>
      <Header publication={publicationEntry} />
      <ContentWrapper
        className={cn(
          roboto_serif.variable,
          'mt-12 max-w-[816px] md:mt-16 lg:mt-20',
        )}
        asChild
      >
        <main>
          {publicationEntry.description && (
            <p className="mb-12 font-roboto-serif text-xl font-light leading-[1.6] opacity-80 ">
              {publicationEntry.description}
            </p>
          )}
          <Image
            alt={`${publicationEntry.title} publication thumbnail`}
            src={`/meta-images/governance/publications/${publication.id}.png`}
            className="mb-12 w-full rounded-lg"
            width={1200}
            height={674}
          />
          <Article>{publicationEntry.content}</Article>
        </main>
      </ContentWrapper>
    </>
  )
}

function Header({ publication }: { publication: GovernancePublicationEntry }) {
  return (
    <FullPageHeader contentWrapperClassName="flex-col items-start gap-6">
      <p className="text-2xs font-semibold uppercase text-purple-100 dark:text-pink-200">
        {publication.readTimeInMinutes} min read • Published on{' '}
        {publication.publishedOn}
      </p>
      <h1 className="text-2xl font-bold md:text-3xl lg:text-[44px] lg:leading-[1.2]">
        {publication.title}
      </h1>
      <div>
        <div className="flex items-center justify-center">
          <Image
            alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
            src={`/images/avatars/${publication.author.id}.png`}
            width={128}
            height={128}
            className="mr-2 size-10 rounded-full"
          />
          <div>
            <p className="text-lg font-bold leading-none">
              {publication.author.firstName} {publication.author.lastName}
            </p>
            <p className="text-2xs font-medium text-zinc-500 dark:text-gray-50">
              {publication.author.role}
            </p>
          </div>
        </div>
      </div>
    </FullPageHeader>
  )
}
