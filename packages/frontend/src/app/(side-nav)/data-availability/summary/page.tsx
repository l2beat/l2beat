import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import { featureFlags } from '~/consts/feature-flags'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { getDaThroughputSummary } from '~/server/features/data-availability/throughput/get-da-throughput-summary'
import { cn } from '~/utils/cn'
import { getDefaultMetadata } from '~/utils/metadata'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../_components/da-category-info'
import { DaSummaryBoxes } from './_components/da-summary-boxes'
import { DaSummaryCustomTable } from './_components/table/da-summary-custom-table'
import { DaSummaryPublicTable } from './_components/table/da-summary-public-table'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/data-availability/summary',
  },
})

export default async function Page() {
  const [{ publicSystems, customSystems }, throughputSummaryData] =
    await Promise.all([getDaSummaryEntries(), getDaThroughputSummary()])

  return (
    <div>
      <MainPageHeader>Summary</MainPageHeader>
      {featureFlags.daThroughput && (
        <DaSummaryBoxes
          entries={publicSystems}
          throughputSummaryData={throughputSummaryData}
        />
      )}
      <div
        className={cn(
          'flex flex-col gap-6',
          featureFlags.daThroughput ? 'md:mt-2' : 'lg:-mt-4',
        )}
      >
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
