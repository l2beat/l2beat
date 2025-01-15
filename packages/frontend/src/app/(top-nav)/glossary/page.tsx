import type { Metadata } from 'next'
import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import { AlphabetSelector } from './_components/alphabet-selector/alphabet-selector'
import { GlossaryItem } from './_components/glossary-item'
import { GlossarySideNav } from './_components/side-nav/glossary-side-nav'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Glossary - L2BEAT',
  description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
  openGraph: {
    url: '/glossary',
  },
})

export default function Page() {
  const glossaryEntries = getCollection('glossary')
  return (
    <div className="header-height-glossary reading">
      <FullPageHeader className="border-none !pb-0">
        <div className="w-full">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
            <h1 className="text-5xl font-bold md:text-6xl">Glossary</h1>
            <div className="w-full text-lg lg:w-2/3">
              <p className="font-medium">
                Explore the L2BEAT Glossary, your comprehensive resource for
                understanding the terms and concepts of the L2 ecosystem. Find
                here all essential definitions and insights.
              </p>{' '}
              <p className="font-light">
                Designed for everyone from developers to enthusiasts, this
                resource simplifies the complexities of L2s, helping you
                navigate Ethereum&apos;s advanced landscape with ease.
              </p>
            </div>
          </div>
        </div>
      </FullPageHeader>
      <FullPageHeader
        className="sticky top-0 z-10 py-8 md:py-8 lg:pt-14"
        contentWrapperClassName="block"
        as="div"
      >
        <AlphabetSelector entries={glossaryEntries} />
      </FullPageHeader>
      <ContentWrapper className="mt-12 flex">
        <GlossarySideNav entries={glossaryEntries} />
        <main className="lg:ml-16">
          {glossaryEntries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </main>
      </ContentWrapper>

      <ScrollToTopButton />
    </div>
  )
}
