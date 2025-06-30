import { useEffect, useState } from 'react'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import { useLivenessTimeRangeContext } from './LivenessTimeRangeContext'
import { LivenessTimeRangeControls } from './LivenessTimeRangeControls'
import { ScalingLivenessTable } from './table/ScalingLivenessTable'

type Props = TabbedScalingEntries<ScalingLivenessEntry>

export function ScalingLivenessTables(props: Props) {
  const filterEntries = useFilterEntries()
  const [tab, setTab] = useState('rollups')

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    underReview: props.underReview.filter(filterEntries),
  }

  const initialSort = {
    id: '#',
    desc: false,
  }

  useEffect(() => {
    if (tab === 'others' && entries.others.length === 0) {
      setTab('rollups')
    }
  }, [entries.others, tab])

  const showOthers = entries.others.length > 0

  return (
    <>
      <Controls
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
        ]}
      />
      <DirectoryTabs value={tab} onValueChange={setTab} defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          {showOthers && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{entries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            <RollupsInfo />
            <ScalingLivenessTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiumsAndOptimiums">
            <ValidiumsAndOptimiumsInfo />
            <ScalingLivenessTable entries={entries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              <OthersInfo />
              <ScalingLivenessTable entries={entries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}

function Controls({ entries }: { entries: ScalingLivenessEntry[] }) {
  const { timeRange, setTimeRange } = useLivenessTimeRangeContext()

  return (
    <div className="mr-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 md:mr-0">
      <TableFilters entries={entries} />
      <LivenessTimeRangeControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        className="max-md:ml-4"
      />
    </div>
  )
}
