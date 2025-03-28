import { AppLayout } from '~/app/_layout'
import AboutUs from '../../../../src/app/(side-nav)/about-us/page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'

export interface AboutUsPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
}

export function AboutUsPage(props: AboutUsPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout showHiringBadge={false}>
        <AboutUs />
      </SideNavLayout>
    </AppLayout>
  )
}
