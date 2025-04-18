import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { AppLayout } from '~/app/_layout'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'
import AboutUs from '../../../../src/app/(side-nav)/about-us/page'

export interface AboutUsPageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
  showHiringBadge: boolean
  ecosystemsEnabled: boolean
}

export function AboutUsPage(props: AboutUsPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout
        showHiringBadge={props.showHiringBadge}
        ecosystemsEnabled={props.ecosystemsEnabled}
      >
        <AboutUs />
      </SideNavLayout>
    </AppLayout>
  )
}
