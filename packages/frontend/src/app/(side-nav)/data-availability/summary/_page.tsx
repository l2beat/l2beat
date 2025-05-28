import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import type { ThroughputSummaryData } from '~/server/features/data-availability/throughput/get-da-throughput-summary'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../_components/da-category-info'
import { DaSummaryBoxes } from './_components/da-summary-boxes'
import { DaSummaryCustomTable } from './_components/table/da-summary-custom-table'
import { DaSummaryPublicTable } from './_components/table/da-summary-public-table'

interface Props {
  publicSystems: DaSummaryEntry[]
  customSystems: DaSummaryEntry[]
  throughputSummaryData: ThroughputSummaryData
}

export function DataAvailabilitySummaryPage({
  publicSystems,
  customSystems,
  throughputSummaryData,
}: Props) {
  return (
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
  )
}
