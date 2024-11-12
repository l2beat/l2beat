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
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { type CostsMetric, useCostsMetricContext } from './costs-metric-context'
import { useCostsTimeRangeContext } from './costs-time-range-context'
import { CostsMetricControls } from './costs-type-controls'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props = RecategorisedScalingEntry<ScalingCostsEntry>

export function ScalingCostsTables(props: Props) {
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
        <Controls
          entries={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
          className="mt-4"
          costMetricControlsClassname="max-md:ml-4"
        />
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
            </DirectoryTabsTrigger>
            {filteredEntries.others && filteredEntries.others.length > 0 && (
              <DirectoryTabsTrigger value="others">
                Others <CountBadge>{filteredEntries.others.length}</CountBadge>
              </DirectoryTabsTrigger>
            )}
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingCostsTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
          {filteredEntries.others && filteredEntries.others.length > 0 && (
            <DirectoryTabsContent value="others">
              <ScalingCostsTable entries={filteredEntries.others} />
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
      <ScalingCostsTable entries={filteredEntries} />
    </MainPageCard>
  )
}

function Controls({
  entries,
  className,
  costMetricControlsClassname,
}: {
  entries: ScalingCostsEntry[]
  className?: string
  costMetricControlsClassname?: string
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
        'flex flex-col gap-2 lg:flex-row lg:justify-between',
        className,
      )}
    >
      <ScalingFilters items={entries} />
      <CostsMetricControls
        value={metric}
        onValueChange={onMetricChange}
        className={costMetricControlsClassname}
      />
    </div>
  )
}
