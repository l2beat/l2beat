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
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/scaling-tabs-info'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { featureFlags } from '~/consts/feature-flags'
import { type ScalingTvlEntry } from '~/server/features/scaling/tvl/get-scaling-tvl-entries'
import { cn } from '~/utils/cn'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../_components/scaling-tvl-filters'
import { ScalingTvlTable } from './table/scaling-tvl-table'

type Props = TabbedScalingEntries<ScalingTvlEntry> & {
  milestones: Milestone[]
}

export function ScalingTvlTabs(props: Props) {
  const includeFilters = useScalingFilter()
  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
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
        className={cn('mt-4', featureFlags.showOthers && 'md:mt-0')}
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
                <ScalingStackedTvlChart
                  milestones={props.milestones}
                  entries={props.rollups}
                />
                <HorizontalSeparator className="my-5" />
              </>
            )}
            <RollupsInfo />
            <ScalingTvlTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent
            value="validiums-and-optimiums"
            className="main-page-card pt-5"
          >
            {featureFlags.showOthers && (
              <>
                <ScalingStackedTvlChart
                  milestones={props.milestones}
                  entries={props.validiumsAndOptimiums}
                />
                <HorizontalSeparator className="my-5" />
              </>
            )}
            <ValidiumsAndOptimiumsInfo />
            <ScalingTvlTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {featureFlags.showOthers && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent
              value="others"
              className="main-page-card pt-5"
            >
              {featureFlags.showOthers && (
                <>
                  <ScalingStackedTvlChart
                    milestones={props.milestones}
                    entries={props.others ?? []}
                  />
                  <HorizontalSeparator className="my-5" />
                </>
              )}
              <OthersInfo />
              <ScalingTvlTable entries={filteredEntries.others} />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
