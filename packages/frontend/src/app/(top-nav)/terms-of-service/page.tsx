import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { Article } from '~/components/markdown/article'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { getCollectionEntry } from '~/content/get-collection'
import { roboto_serif, roboto_serif_ext } from '~/fonts'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import { getDefaultMetadata } from '~/utils/metadata'

export async function generateMetadata(): Promise<Metadata | null> {
  const page = getCollectionEntry('pages', 'terms-of-service')
  if (!page) {
    return null
  }
  return getDefaultMetadata({
    title: `Terms of Service - L2BEAT`,
    description: 'Terms of Service for L2BEAT',
    openGraph: {
      type: 'article',
      url: `/terms-of-service`,
    },
  })
}

export default function Page() {
  const page = getCollectionEntry('pages', 'terms-of-service')
  if (!page) {
    return notFound()
  }
  return (
    <>
      <Header lastUpdated={page.data.lastUpdated} />
      <ContentWrapper
        className={cn(
          roboto_serif_ext.variable,
          roboto_serif.variable,
          'mt-12 max-w-[816px] md:mt-16 lg:mt-20',
        )}
        asChild
      >
        <main>
          <Article className="extended-char-set">{page.content}</Article>
        </main>
      </ContentWrapper>
      <ScrollToTopButton />
    </>
  )
}

function Header({ lastUpdated }: { lastUpdated: Date }) {
  return (
    <FullPageHeader contentWrapperClassName="flex-col items-start gap-2 md:gap-6">
      <p className="text-2xs font-medium uppercase text-purple-100 dark:text-pink-200">
        Last updated on {formatPublicationDate(lastUpdated)}
      </p>
      <h1 className="text-2xl font-bold md:text-3xl lg:text-[44px] lg:leading-[1.2]">
        Terms of Service
      </h1>
    </FullPageHeader>
  )
}
