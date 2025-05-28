'use client'
import type { Milestone } from '@l2beat/config'
import { useEffect, useMemo, useState } from 'react'
import type { ScalingCostsEntry } from 'rewrite/src/server/features/scaling/costs/get-scaling-costs-entries'
import { compareCosts } from 'rewrite/src/server/features/scaling/costs/utils/compare-stage-and-cost'
import type { TabbedScalingEntries } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { CountBadge } from '~/components/badge/count-badge'
import { ScalingCostsChart } from '~/components/chart/costs/scaling-costs-chart'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { OtherMigrationTabNotice } from '~/components/countdowns/other-migration/other-migration-tab-notice'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { OthersInfo, RollupsInfo } from '~/components/scaling-tabs-info'
import { TableFilters } from '~/components/table/filters/table-filters'
import { useFilterEntries } from '~/components/table/filters/use-filter-entries'
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props = TabbedScalingEntries<ScalingCostsEntry> & {
  milestones: Milestone[]
}

export function ScalingCostsTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const [tab, setTab] = useState('rollups')
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }
  const entries = checked
    ? getRecategorisedEntries(filteredEntries, compareCosts)
    : filteredEntries

  const projectToBeMigratedToOthers = useMemo(
    () =>
      checked
        ? []
        : [
            ...entries.rollups,
            ...entries.validiumsAndOptimiums,
            ...entries.others,
          ]
            .filter((project) => project.statuses?.countdowns?.otherMigration)
            .map((project) => ({
              slug: project.slug,
              name: project.name,
              icon: project.icon,
            })),
    [checked, entries.others, entries.rollups, entries.validiumsAndOptimiums],
  )

  const initialSort = {
    id: 'total-cost',
    desc: false,
  }

  useEffect(() => {
    if (!checked && tab === 'others' && entries.others.length === 0) {
      setTab('rollups')
    }
  }, [checked, entries.others, tab])

  const showOthers = checked || entries.others.length > 0
  return (
    <>
      <TableFilters
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
        ]}
      />
      <DirectoryTabs value={tab} onValueChange={setTab}>
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
              <OtherMigrationTabNotice
                projectsToBeMigrated={projectToBeMigratedToOthers}
                className="mt-2"
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
        )}
      </DirectoryTabs>
    </>
  )
}
