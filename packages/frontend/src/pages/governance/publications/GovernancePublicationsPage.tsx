import type { GovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
import { GovernancePublicationsPage as NextGovernancePublicationPage } from '~/app/(side-nav)/governance/publications/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  publications: GovernancePublicationEntry[]
}

export function GovernancePublicationsPage({ publications, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextGovernancePublicationPage publications={publications} />
      </SideNavLayout>
    </AppLayout>
  )
}
