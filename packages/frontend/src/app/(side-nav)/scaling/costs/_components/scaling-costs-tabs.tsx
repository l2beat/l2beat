'use client'
import { type Milestone } from '@l2beat/config'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingCostsChart } from '~/components/chart/costs/scaling-costs-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { OthersInfo, RollupsInfo } from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { featureFlags } from '~/consts/feature-flags'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { cn } from '~/utils/cn'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { type CostsMetric, useCostsMetricContext } from './costs-metric-context'
import { useCostsTimeRangeContext } from './costs-time-range-context'
import { CostsMetricControls } from './costs-type-controls'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props = TabbedScalingEntries<ScalingCostsEntry> & {
  milestones: Milestone[]
}

export function ScalingCostsTabs(props: Props) {
  const includeFilters = useScalingFilter()
  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <Controls
        entries={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          {featureFlags.showOthers && filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="main-page-card pt-5">
            {featureFlags.showOthers && (
              <>
                <ScalingCostsChart
                  entries={props.rollups}
                  milestones={props.milestones}
                />
                <HorizontalSeparator className="my-5" />
              </>
            )}
            <RollupsInfo />
            <ScalingCostsTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {featureFlags.showOthers && filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent
              value="others"
              className="main-page-card pt-5"
            >
              {featureFlags.showOthers && (
                <>
                  <ScalingCostsChart
                    entries={props.others ?? []}
                    milestones={props.milestones}
                  />
                  <HorizontalSeparator className="my-5" />
                </>
              )}
              <OthersInfo />
              <ScalingCostsTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}

function Controls({
  entries,
}: {
  entries: ScalingCostsEntry[]
}) {
  const { metric, setMetric } = useCostsMetricContext()
  const { range, setRange } = useCostsTimeRangeContext()

  const onMetricChange = (metric: CostsMetric) => {
    setMetric(metric)
    if (metric === 'per-l2-tx' && (range === '1d' || range === '7d')) {
      setRange('30d')
    }
  }

  return (
    <div
      className={cn(
        'mt-4 flex flex-col gap-2 lg:flex-row lg:justify-between',
        featureFlags.showOthers && 'md:mt-0',
      )}
    >
      <ScalingFilters items={entries} />
      {!featureFlags.showOthers && (
        <CostsMetricControls
          value={metric}
          onValueChange={onMetricChange}
          className="max-md:ml-4"
        />
      )}
    </div>
  )
}
