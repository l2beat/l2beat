'use client'
import { CountBadge } from "~/components/badge/count-badge"
import { DirectoryTabs, DirectoryTabsContent, DirectoryTabsList, DirectoryTabsTrigger } from "~/components/core/directory-tabs"
import { MainPageCard } from "~/components/main-page-card"
import { type ScalingSummaryEntry } from "~/server/features/scaling/summary/get-scaling-summary-entries"
import { type groupByMainCategories } from "~/utils/group-by-main-categories"
import { ScalingFilterContextProvider, useScalingFilter } from "../../_components/scaling-filter-context"
import { ScalingTvlFilters } from "../../_components/scaling-tvl-filters"
import { OthersComingSoonNotice } from "./table/others-coming-soon-notice"
import { ScalingSummaryRollupsTable } from "./table/scaling-summary-rollups-table"
import { ScalingSummaryTable } from "./table/scaling-summary-table"
import { ScalingSummaryValidiumsAndOptimiumsTable } from "./table/scaling-summary-validiums-and-optimiums-table"

type Props = {
  type?: never
  entries: ScalingSummaryEntry[]
} | {
  type: 'recategorised'
  entries: ReturnType<typeof groupByMainCategories<ScalingSummaryEntry>>
}
export function ScalingSummaryTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = ({
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums: props.entries.validiumsAndOptimiums.filter(includeFilters),
    })
    return (
      <>
        <ScalingTvlFilters items={[...filteredEntries.rollups, ...filteredEntries.validiumsAndOptimiums]} />
        <DirectoryTabs className="mt-6" defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups" >Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge></DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="validiums-and-optimiums" >
              Validiums & Optimiums <CountBadge>{filteredEntries.validiumsAndOptimiums.length}</CountBadge>
            </DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="others">Others</DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingSummaryRollupsTable entries={filteredEntries.rollups} />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingSummaryValidiumsAndOptimiumsTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="others">
            <OthersComingSoonNotice />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }

  return (
    <ScalingFilterContextProvider>
      <MainPageCard className="md:mt-6">
        <ScalingSummaryTable entries={props.entries} />
      </MainPageCard>
    </ScalingFilterContextProvider>
  )
}