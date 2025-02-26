import type { Metadata } from 'next'
import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import { getCollection } from '~/content/get-collection'
import { getDefaultMetadata } from '~/utils/metadata'
import { GlossaryItem } from './_components/glossary-item'
import { Header } from './_components/header'
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
    <>
      <MainPageHeader>Glossary</MainPageHeader>
      <Header glossaryEntries={glossaryEntries} />
      <main className="mt-0 flex gap-8 border-t border-divider md:mt-6 md:border-t-0">
        <PrimaryCard>
          {glossaryEntries.map((entry) => (
            <GlossaryItem key={entry.id} entry={entry} />
          ))}
        </PrimaryCard>
        <GlossarySideNav entries={glossaryEntries} />
      </main>
      <ScrollToTopButton />
    </>
  )
}
