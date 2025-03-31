import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { MainPageHeader } from '~/components/main-page-header'
import { Article } from '~/components/markdown/article'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { getCollection, getCollectionEntry } from '~/content/get-collection'
import { env } from '~/env'
import { roboto_serif } from '~/fonts'
import { cn } from '~/utils/cn'
import { getDefaultMetadata } from '~/utils/metadata'
import type { GovernancePublicationEntry } from '../../_utils/get-governance-publication-entry'
import { getGovernancePublicationEntry } from '../../_utils/get-governance-publication-entry'

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
  return (
    <>
      <MainPageHeader>Governance</MainPageHeader>
      <PrimaryCard className="md:p-8">
        <PublicationHeader publication={publicationEntry} />
        <HorizontalSeparator className="my-8" />
        <div
          className={cn(
            roboto_serif.variable,
            'mx-auto mt-8 max-w-[720px] md:pt-8',
          )}
        >
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
        </div>
      </PrimaryCard>
    </>
  )
}

function PublicationHeader({
  publication,
}: { publication: GovernancePublicationEntry }) {
  return (
    <div>
      <p className="subtitle-12 uppercase text-brand">
        {publication.readTimeInMinutes} min read • Published on{' '}
        {publication.publishedOn}
      </p>
      <h1 className="md:heading-32 heading-24 mt-2">{publication.title}</h1>
      <div className="mt-6 flex items-center justify-start">
        <Image
          alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
          src={`/images/avatars/${publication.author.id}.png`}
          width={128}
          height={128}
          className="mr-2 size-10 rounded-full"
        />
        <div>
          <p className="label-value-16-bold">
            {publication.author.firstName} {publication.author.lastName}
          </p>
          <p className="label-value-12-bold mt-1 text-zinc-500 dark:text-gray-50">
            {publication.author.role}
          </p>
        </div>
      </div>
    </div>
  )
}
