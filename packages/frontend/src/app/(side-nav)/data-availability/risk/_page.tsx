import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageHeader } from '~/components/main-page-header'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/get-da-risk-entries'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../_components/da-category-info'
import { DaRiskTable } from './_components/table/da-risk-table'

interface Props {
  publicSystems: DaRiskEntry[]
  customSystems: DaRiskEntry[]
}

export function DataAvailabilityRiskPage({
  publicSystems,
  customSystems,
}: Props) {
  return (
    <div>
      <MainPageHeader>Risk Analysis</MainPageHeader>
      {/* 
    Negative margin is there to make the tabs align with the side nav
    Padding from directory tabs can not be removed because it is needed
    for the tabs to be sticky
  */}
      <div className="flex flex-col gap-6 lg:-mt-4">
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
            <DaRiskTable items={publicSystems} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="custom">
            <CustomSystemInfo />
            <DaRiskTable items={customSystems} excludeBridge />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </div>
    </div>
  )
}
