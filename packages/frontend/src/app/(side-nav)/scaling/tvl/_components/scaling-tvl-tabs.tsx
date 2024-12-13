'use client'
import { type Milestone } from '@l2beat/config'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingStackedTvlChart } from '~/components/chart/tvl/stacked/scaling-stacked-tvl-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { env } from '~/env'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { ScalingTvlTable } from './table/scaling-tvl-table'

type Props = TabbedScalingEntries<ScalingTvlEntry> & {
  milestones: Milestone[]
}

export function ScalingTvlTabs(props: Props) {
  const includeFilters = useScalingFilter()
  const useOthers = env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others?.filter(includeFilters) ?? [],
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <ScalingTvlFilters
        items={[
          ...filteredEntries.rollups,
          ...filteredEntries.validiumsAndOptimiums,
          ...filteredEntries.others,
        ]}
        className="mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiums-and-optimiums">
            Validiums & Optimiums{' '}
            <CountBadge>
              {filteredEntries.validiumsAndOptimiums.length}
            </CountBadge>
          </DirectoryTabsTrigger>
          {filteredEntries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{filteredEntries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups">
            {useOthers && (
              <MainPageCard className="p-0">
                <ScalingStackedTvlChart
                  milestones={props.milestones}
                  entries={props.rollups}
                />
              </MainPageCard>
            )}
            <ScalingTvlTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="validiums-and-optimiums">
            {useOthers && (
              <MainPageCard className="p-0">
                <ScalingStackedTvlChart
                  milestones={props.milestones}
                  entries={props.validiumsAndOptimiums}
                />
              </MainPageCard>
            )}
            <ScalingTvlTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {filteredEntries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others">
              {useOthers && (
                <MainPageCard className="p-0">
                  <ScalingStackedTvlChart
                    milestones={props.milestones}
                    entries={props.others ?? []}
                  />
                </MainPageCard>
              )}
              <ScalingTvlTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
