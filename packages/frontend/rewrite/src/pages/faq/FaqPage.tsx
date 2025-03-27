import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import _FaqPage from '../../../../src/app/(side-nav)/faq/page'
import { AppLayout } from '~/app/_layout'
import SideNavLayout from '~/app/(side-nav)/layout'

export interface FaqPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}

export function FaqPage(props: FaqPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <_FaqPage />
      </SideNavLayout>
    </AppLayout>
  )
}
