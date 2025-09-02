import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { MainPageHeader } from '~/components/MainPageHeader'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { DaLivenessEntry } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { DaLivenessTable } from './components/table/DaLivenessTable'

interface Props extends AppLayoutProps {
  publicSystems: DaLivenessEntry[]
}

export function DataAvailabilityLivenessPage({
  publicSystems,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Liveness</MainPageHeader>
          <div className="lg:-mt-4 flex flex-col gap-6">
            <DirectoryTabs defaultValue="public">
              <DirectoryTabsList>
                <DirectoryTabsTrigger value="public">
                  Public <CountBadge>{publicSystems.length}</CountBadge>
                </DirectoryTabsTrigger>
              </DirectoryTabsList>
              <DirectoryTabsContent value="public">
                <DaLivenessTable items={publicSystems} />
              </DirectoryTabsContent>
            </DirectoryTabs>
          </div>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
