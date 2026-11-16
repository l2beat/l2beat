import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { PrivacySummaryTables } from '../summary/components/PrivacySummaryTables'
import type { PrivacySummaryGroup } from '../summary/privacySummaryGroups'

interface Props extends AppLayoutProps {
  groups: PrivacySummaryGroup[]
}

export function PrivacyArchivedPage({ groups, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Protocols that shut down, were drained or were replaced by a newer version.">
          Archived
        </MainPageHeader>
        <PrivacySummaryTables groups={groups} />
      </SideNavLayout>
    </AppLayout>
  )
}
