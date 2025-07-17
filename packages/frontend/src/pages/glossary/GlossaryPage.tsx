import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { CollectionEntry } from '~/content/getCollection'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GlossaryItem } from './components/GlossaryItem'
import { Header } from './components/Header'
import { GlossarySideNav } from './components/side-nav/GlossarySideNav'

interface Props extends AppLayoutProps {
  glossaryEntries: CollectionEntry<'glossary'>[]
}

export function GlossaryPage({ glossaryEntries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader className="relative z-10">Glossary</MainPageHeader>
        <Header glossaryEntries={glossaryEntries} />
        <main className="md:-mt-2 mt-0 flex gap-8 border-divider border-t md:border-t-0">
          <PrimaryCard className="">
            {glossaryEntries.map((entry) => (
              <GlossaryItem key={entry.id} entry={entry} />
            ))}
          </PrimaryCard>
          <GlossarySideNav entries={glossaryEntries} />
        </main>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
