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
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import {
  CustomSystemInfo,
  PublicSystemInfo,
} from '../components/DaCategoryInfo'
import { DaRiskTable } from './components/table/DaRiskTable'

interface Props extends AppLayoutProps {
  publicSystems: DaRiskEntry[]
  customSystems: DaRiskEntry[]
}

export function DataAvailabilityRiskPage({
  publicSystems,
  customSystems,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div>
          <MainPageHeader>Risk Analysis</MainPageHeader>
          {/* 
    Negative margin is there to make the tabs align with the side nav
    Padding from directory tabs can not be removed because it is needed
    for the tabs to be sticky
  */}
          <div className="lg:-mt-4 flex flex-col gap-6">
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
      </SideNavLayout>
    </AppLayout>
  )
}
