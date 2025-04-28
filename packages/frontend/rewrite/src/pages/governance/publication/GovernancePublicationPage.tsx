import type { GovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
import { GovernancePublicationPage as NextGovernancePublicationPage } from '~/app/(side-nav)/governance/publications/[slug]/_page'
import { SideNavLayout } from '~/app/(side-nav)/side-nav-layout'
import type { AppLayoutProps } from '~/app/_layout'
import { AppLayout } from '~/app/_layout'

interface Props extends AppLayoutProps {
  publication: GovernancePublicationEntry
}

export function GovernancePublicationPage({ publication, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <NextGovernancePublicationPage
          publication={publication}
          descriptionClassName="font-rewrite-roboto-serif"
        />
      </SideNavLayout>
    </AppLayout>
  )
}
