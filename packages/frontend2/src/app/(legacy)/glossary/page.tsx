import type { Metadata } from 'next'
import { ContentWrapper } from '~/app/_components/content-wrapper'
import { FullPageHeader } from '~/app/_components/full-page-header'
import { ScrollToTopButton } from '~/app/_components/scroll-to-top-button'
import { getCollection } from '~/content/getCollection'
import { AlphabetSelector } from './_components/alphabet-selector'
import { GlossaryItem } from './_components/glossary-item'
import { GlossarySideNavigation } from './_components/glossary-side-navigation'

export const metadata: Metadata = {
  title: 'Glossary - L2BEAT',
  description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
  openGraph: {
    url: '/glossary',
  },
}

export default function Page() {
  const glossaryEntries = getCollection('glossary')

  return (
    <>
      <FullPageHeader className="pb-0">
        <div className="w-full">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:justify-between">
            <h1 className="text-6xl font-bold">Glossary</h1>
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
        className="sticky top-0 z-10 py-8 lg:pt-14"
        contentWrapperClassName="block"
        as="div"
      >
        <AlphabetSelector entries={glossaryEntries} />
      </FullPageHeader>
      <ContentWrapper className="mt-12 flex">
        <GlossarySideNavigation entries={glossaryEntries} />
        <main className="lg:ml-16">
          {glossaryEntries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </main>
      </ContentWrapper>
      <ScrollToTopButton />
    </>
  )
}
