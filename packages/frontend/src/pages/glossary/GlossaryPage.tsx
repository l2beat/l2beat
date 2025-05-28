import type { CollectionEntry } from '~/content/get-collection'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { AppLayout, type AppLayoutProps } from '~/app/_layout'
import { GlossaryPage as NextGlossaryPage } from '../../app/(side-nav)/glossary/_page'

interface Props extends AppLayoutProps {
  glossaryEntries: CollectionEntry<'glossary'>[]
}

export function GlossaryPage({ glossaryEntries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextGlossaryPage glossaryEntries={glossaryEntries} />
      </SideNavLayout>
    </AppLayout>
  )
}
