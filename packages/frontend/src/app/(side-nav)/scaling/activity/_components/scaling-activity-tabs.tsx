'use client'
import { type Milestone } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { CountBadge } from '~/components/badge/count-badge'
import { ActivityChart } from '~/components/chart/activity/activity-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { featureFlags } from '~/consts/feature-flags'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { cn } from '~/utils/cn'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { ScalingActivityFilters } from '../../_components/scaling-activity-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = TabbedScalingEntries<ScalingActivityEntry> & {
  milestones: Milestone[]
}

export function ScalingActivityTabs({
  rollups,
  validiumsAndOptimiums,
  others,
  milestones,
}: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: rollups.filter(includeFilters),
    validiumsAndOptimiums: validiumsAndOptimiums.filter(includeFilters),
    others: others.filter(includeFilters),
  }

  const initialSort = {
    id: 'data_pastDayCount',
    desc: true,
  }

  const showOthers =
    featureFlags.showOthers &&
    filteredEntries.others.length > 0 &&
    !filteredEntries.others.every((e) => !e.data || e.id === ProjectId.ETHEREUM)

  return (
    <>
      <ScalingActivityFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className={cn('mt-4', featureFlags.showOthers && 'md:mt-0')}
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups{' '}
            <CountBadge>{filteredEntries.rollups.length - 1}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums{' '}
            <CountBadge>
              {filteredEntries.validiumsAndOptimiums.length - 1}
            </CountBadge>
          </DirectoryTabsTrigger>
          {showOthers && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="main-page-card pt-5">
            {featureFlags.showOthers && (
              <>
                <ActivityChart milestones={milestones} entries={rollups} />
                <HorizontalSeparator className="mb-3 mt-5" />
              </>
            )}
            <ScalingActivityTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiums-and-optimiums"
            className="main-page-card pt-5"
          >
            {featureFlags.showOthers && (
              <>
                <ActivityChart
                  milestones={milestones}
                  entries={validiumsAndOptimiums}
                  hideScalingFactor
                />
                <HorizontalSeparator className="mb-3 mt-5" />
              </>
            )}
            <ScalingActivityTable
              entries={filteredEntries.validiumsAndOptimiums}
            />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent
              value="others"
              className="main-page-card pt-5"
            >
              {featureFlags.showOthers && (
                <>
                  <ActivityChart
                    milestones={milestones}
                    entries={others ?? []}
                    hideScalingFactor
                  />
                  <HorizontalSeparator className="mb-3 mt-5" />
                </>
              )}
              <ScalingActivityTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
