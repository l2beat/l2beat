import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { AppLayout } from '~/app/_layout'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import NextFaqPage from '../../../../src/app/(side-nav)/faq/page'

export interface FaqPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
  showHiringBadge: boolean
  ecosystemsEnabled: boolean
}

export function FaqPage(props: FaqPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <NextFaqPage />
      </SideNavLayout>
    </AppLayout>
  )
}
