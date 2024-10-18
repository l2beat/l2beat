'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { cn } from '~/utils/cn'
import { type groupByMainCategories } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { type CostsMetric, useCostsMetricContext } from './costs-metric-context'
import { useCostsTimeRangeContext } from './costs-time-range-context'
import { CostsMetricControls } from './costs-type-controls'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props =
  | {
      type?: never
      entries: ScalingCostsEntry[]
    }
  | {
      type: 'recategorised'
      entries: ReturnType<typeof groupByMainCategories<ScalingCostsEntry>>
    }

export function ScalingCostsTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
    }
    return (
      <>
        <Controls
          entries={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
          className="mt-6"
        />
        <DirectoryTabs className="mt-6" defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingCostsTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }

  return (
    <MainPageCard className="space-y-3 md:mt-6 md:space-y-6">
      <Controls entries={props.entries} />
      <ScalingCostsTables entries={props.entries} />
    </MainPageCard>
  )
}

function Controls({
  entries,
  className,
}: { entries: ScalingCostsEntry[]; className?: string }) {
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
        'flex flex-col gap-2 lg:flex-row lg:justify-between',
        className,
      )}
    >
      <ScalingFilters items={entries} />
      <CostsMetricControls value={metric} onValueChange={onMetricChange} />
    </div>
  )
}
