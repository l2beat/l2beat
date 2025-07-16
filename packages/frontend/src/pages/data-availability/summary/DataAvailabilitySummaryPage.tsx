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
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import type { ThroughputSummaryData } from '~/server/features/data-availability/throughput/getDaThroughputSummary'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../components/DaCategoryInfo'
import { DaSummaryBoxes } from './components/DaSummaryBoxes'
import { DaSummaryCustomTable } from './components/table/DaSummaryCustomTable'
import { DaSummaryPublicTable } from './components/table/DaSummaryPublicTable'

interface Props extends AppLayoutProps {
  publicSystems: DaSummaryEntry[]
  customSystems: DaSummaryEntry[]
  throughputSummaryData: ThroughputSummaryData
}

export function DataAvailabilitySummaryPage({
  publicSystems,
  customSystems,
  throughputSummaryData,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Summary</MainPageHeader>
          <DaSummaryBoxes
            entries={publicSystems}
            throughputSummaryData={throughputSummaryData}
          />
          <div className="flex flex-col gap-6 md:mt-2">
            <DirectoryTabs defaultValue="public">
              <DirectoryTabsList>
                <DirectoryTabsTrigger value="public">
                  Public <CountBadge>{publicSystems.length}</CountBadge>
                </DirectoryTabsTrigger>
                <DirectoryTabsTrigger value="custom">
                  Custom <CountBadge>{customSystems.length}</CountBadge>
                </DirectoryTabsTrigger>
              </DirectoryTabsList>
              <DirectoryTabsContent value="public">
                <PublicSystemInfo />
                <DaSummaryPublicTable items={publicSystems} />
              </DirectoryTabsContent>
              <DirectoryTabsContent value="custom">
                <CustomSystemInfo />
                <DaSummaryCustomTable items={customSystems} />
              </DirectoryTabsContent>
            </DirectoryTabs>
          </div>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
