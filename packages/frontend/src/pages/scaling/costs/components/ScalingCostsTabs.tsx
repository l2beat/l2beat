import type { Milestone } from '@l2beat/config'
import { useEffect, useState } from 'react'
import { OthersInfo, RollupsInfo } from '~/components/ScalingTabsInfo'
import { CountBadge } from '~/components/badge/CountBadge'
import { ScalingCostsChart } from '~/components/chart/costs/ScalingCostsChart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/getScalingCostsEntries'
import { ScalingCostsTable } from './table/ScalingCostsTable'

type Props = TabbedScalingEntries<ScalingCostsEntry> & {
  milestones: Milestone[]
}

export function ScalingCostsTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const [tab, setTab] = useState('rollups')

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    underReview: props.underReview.filter(filterEntries),
  }

  const initialSort = {
    id: 'total-cost',
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
      <TableFilters
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
          {showOthers && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{entries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
            <RollupsInfo />
            <ScalingCostsChart
              tab="rollups"
              entries={entries.rollups}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <ScalingCostsTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others" className="pt-4 sm:pt-3">
              <OthersInfo />
              <ScalingCostsChart
                tab="others"
                entries={entries.others}
                milestones={props.milestones}
              />
              <HorizontalSeparator className="my-5" />
              <ScalingCostsTable entries={entries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
