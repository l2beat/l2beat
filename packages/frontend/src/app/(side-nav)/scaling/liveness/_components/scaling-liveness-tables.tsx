'use client'

import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingLivenessEntry } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { BaseScalingFilters } from '../../_components/base-scaling-filters'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { useLivenessTimeRangeContext } from './liveness-time-range-context'
import { LivenessTimeRangeControls } from './liveness-time-range-controls'
import { ScalingLivenessTable } from './table/scaling-liveness-table'

type Props = RecategorisedScalingEntry<ScalingLivenessEntry>

export function ScalingLivenessTables(props: Props) {
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
            <ScalingLivenessTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
          {filteredEntries.others && filteredEntries.others.length > 0 && (
            <DirectoryTabsContent value="others">
              <ScalingLivenessTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          )}
        </DirectoryTabs>
      </>
    )
  }

  const filteredEntries = props.entries.filter(includeFilters)
  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <Controls entries={filteredEntries} />
      <ScalingLivenessTable entries={filteredEntries} />
    </MainPageCard>
  )
}

function Controls({ entries }: { entries: ScalingLivenessEntry[] }) {
  const { timeRange, setTimeRange } = useLivenessTimeRangeContext()

  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row">
      <BaseScalingFilters items={entries} />
      <LivenessTimeRangeControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </div>
  )
}
