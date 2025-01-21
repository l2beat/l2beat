'use client'
import type { Milestone } from '@l2beat/config'
import { useMemo } from 'react'
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
import { TableSortingProvider } from '~/components/table/sorting/table-sorting-context'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type TabbedScalingEntries } from '~/utils/group-by-tabs'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { getRecategorisedEntries } from '../../_utils/get-recategorised-entries'
import { ScalingCostsTable } from './table/scaling-costs-table'

type Props = TabbedScalingEntries<ScalingCostsEntry> & {
  milestones: Milestone[]
}

export function ScalingCostsTabs(props: Props) {
  const includeFilters = useScalingFilter()
  const { checked } = useRecategorisationPreviewContext()

  const filteredEntries = {
    rollups: props.rollups.filter(includeFilters),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(includeFilters),
    others: props.others.filter(includeFilters),
  }
  const entries = checked
    ? getRecategorisedEntries(
        filteredEntries,
        (a, b) => b.tvlOrder - a.tvlOrder,
      )
    : filteredEntries

  const projectToBeMigratedToOthers = useMemo(
    () =>
      [...props.rollups, ...props.validiumsAndOptimiums, ...props.others]
        .filter((project) => project.statuses?.countdowns?.otherMigration)
        .map((project) => ({
          slug: project.slug,
          name: project.name,
        })),
    [props.others, props.rollups, props.validiumsAndOptimiums],
  )

  const initialSort = {
    id: '#',
    desc: false,
  }

  return (
    <>
      <ScalingFilters
        items={[
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ]}
        className="max-md:mt-4"
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          {entries.others.length > 0 && (
            <DirectoryTabsTrigger value="others">
              Others <CountBadge>{entries.others.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <TableSortingProvider initialSort={initialSort}>
          <DirectoryTabsContent value="rollups" className="pt-5">
            <ScalingCostsChart
              tab="rollups"
              entries={props.rollups}
              milestones={props.milestones}
            />
            <HorizontalSeparator className="my-5" />
            <RollupsInfo />
            <ScalingCostsTable entries={entries.rollups} rollups />
          </DirectoryTabsContent>
        </TableSortingProvider>
        {entries.others.length > 0 && (
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others" className="pt-5">
              <ScalingCostsChart
                tab="others"
                entries={props.others ?? []}
                milestones={props.milestones}
              />
              <HorizontalSeparator className="my-5" />
              <OthersInfo />
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
