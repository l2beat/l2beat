'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type CategorisedScalingEntries } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { type CostsMetric, useCostsMetricContext } from './costs-metric-context'
import { useCostsTimeRangeContext } from './costs-time-range-context'
import { CostsMetricControls } from './costs-type-controls'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props = CategorisedScalingEntries<ScalingCostsEntry>

export function ScalingCostsTables(props: Props) {
  const includeFilters = useScalingFilter()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others?.filter(includeFilters) ?? [],
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
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <DirectoryTabsContent value="rollups">
          <ScalingCostsTable entries={filteredEntries.rollups} rollups />
        </DirectoryTabsContent>
        {filteredEntries.others.length > 0 && (
          <DirectoryTabsContent value="others">
            <ScalingCostsTable entries={filteredEntries.others} />
          </DirectoryTabsContent>
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
    <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:justify-between">
      <ScalingFilters items={entries} />
      <CostsMetricControls
        value={metric}
        onValueChange={onMetricChange}
        className="max-md:ml-4"
      />
    </div>
  )
}
