import { DonatePage as NextDonatePage } from '~/app/(side-nav)/donate/donate-page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import { AppLayout } from '~/app/_layout'
import type { GlossaryTermWithoutDescription } from '~/components/markdown/glossary-context'
import type { SearchBarProject } from '~/components/search-bar/search-bar-entry'

export interface DonatePageProps {
  terms: GlossaryTermWithoutDescription[]
  searchBarProjects: SearchBarProject[]
  qrCodeUrl: string
}

export function DonatePage(props: DonatePageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout showHiringBadge={false}>
        <NextDonatePage gitcoinOption={false} qrCodeUrl={props.qrCodeUrl} />
      </SideNavLayout>
    </AppLayout>
  )
}
