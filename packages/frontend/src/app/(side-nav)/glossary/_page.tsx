import { MainPageHeader } from '~/components/main-page-header'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import type { CollectionEntry } from '~/content/get-collection'
import { GlossaryItem } from './_components/glossary-item'
import { Header } from './_components/header'
import { GlossarySideNav } from './_components/side-nav/glossary-side-nav'

interface Props {
  glossaryEntries: CollectionEntry<'glossary'>[]
}

export function GlossaryPage({ glossaryEntries }: Props) {
  return (
    <>
      <MainPageHeader className="relative z-10">Glossary</MainPageHeader>
      <Header glossaryEntries={glossaryEntries} />
      <main className="mt-0 flex gap-8 border-t border-divider md:-mt-2 md:border-t-0">
        <PrimaryCard className="">
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
