'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { getStageSortedRowModel } from '~/components/table/sorting/get-stage-sorting-row-model'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { cn } from '~/utils/cn'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { ScalingActivityFilters } from '../../_components/scaling-activity-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from './activity-metric-context'
import { ActivityMetricControls } from './activity-type-controls'
import { ScalingActivityTable } from './table/scaling-activity-table'

type Props = RecategorisedScalingEntry<ScalingActivityEntry>

export function ScalingActivityTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
      others: props.entries.others?.filter(includeFilters),
    }
    return (
      <>
        <ScalingActivityFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
          className="mt-4"
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
            {filteredEntries.others && filteredEntries.others.length > 0 && (
              <DirectoryTabsTrigger value="others">
                Others <CountBadge>{filteredEntries.others.length}</CountBadge>
              </DirectoryTabsTrigger>
            )}
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingActivityTable
              entries={filteredEntries.rollups}
              rollups
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingActivityTable
              entries={filteredEntries.validiumsAndOptimiums}
              customSortedRowModel={getStageSortedRowModel()}
            />
          </DirectoryTabsContent>
          {filteredEntries.others && filteredEntries.others.length > 0 && (
            <DirectoryTabsContent value="others">
              <ScalingActivityTable
                entries={filteredEntries.others}
                customSortedRowModel={getStageSortedRowModel()}
              />
            </DirectoryTabsContent>
          )}
        </DirectoryTabs>
      </>
    )
  }

  const filteredEntries = props.entries.filter(includeFilters)
  return (
    <MainPageCard className="space-y-3 md:mt-6 md:space-y-6">
      <Controls entries={filteredEntries} />
      <ScalingActivityTable entries={filteredEntries} />
    </MainPageCard>
  )
}

function Controls({
  entries,
  className,
}: { entries: ScalingActivityEntry[]; className?: string }) {
  const { metric, setMetric } = useActivityMetricContext()

  const onMetricChange = (metric: ActivityMetric) => {
    setMetric(metric)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-2 lg:flex-row lg:justify-between',
        className,
      )}
    >
      <ScalingActivityFilters items={entries} />
      <ActivityMetricControls value={metric} onValueChange={onMetricChange} />
    </div>
  )
}
