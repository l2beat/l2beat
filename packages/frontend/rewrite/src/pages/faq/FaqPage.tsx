import { Suspense } from 'react'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { AppLayout } from '~/app/_layout'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import _FaqPage from '../../../../src/app/(side-nav)/faq/page'

export interface FaqPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}

export function FaqPage(props: FaqPageProps) {
  return (
    <AppLayout {...props}>
      <Suspense fallback={<div>Loading...</div>}>
        <SideNavLayout showHiringBadge={false}>
          <_FaqPage />
        </SideNavLayout>
      </Suspense>
    </AppLayout>
  )
}
