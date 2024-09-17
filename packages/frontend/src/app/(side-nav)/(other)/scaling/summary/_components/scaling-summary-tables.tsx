'use client'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { TabCountBadge } from '~/components/badge/tab-count-badge'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/tabs'
import { BasicTable } from '~/components/table/basic-table'
import { useTable } from '~/hooks/use-table'
import { ActiveIcon } from '~/icons/active'
import { ArchivedIcon } from '~/icons/archived'
import { UpcomingIcon } from '~/icons/upcoming'
import { type ScalingSummaryEntry } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { useScalingAssociatedTokensContext } from '../../../_components/scaling-associated-tokens-context'
import { useScalingFilter } from '../../../_components/scaling-filter-context'
import { ScalingTvlFilters } from '../../../_components/scaling-tvl-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingLayer2sColumns } from './table/active/columns'
import { scalingArchivedColumns } from './table/archived/columns'
import { scalingUpcomingColumns } from './table/upcoming/columns'

interface Props {
  entries: ScalingSummaryEntry[]
}

export function ScalingSummaryTables({ entries }: Props) {
  const { excludeAssociatedTokens } = useScalingAssociatedTokensContext()
  const includeFilters = useScalingFilter()

  const allProjects = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const active = useMemo(
    () =>
      toTableRows({
        projects: allProjects.filter(
          (item) => !item.isArchived && !item.isUpcoming,
        ),
        excludeAssociatedTokens,
      }),
    [allProjects, excludeAssociatedTokens],
  )

  const upcomingProjects = useMemo(
    () =>
      toTableRows({
        projects: allProjects.filter((item) => item.isUpcoming),
        excludeAssociatedTokens,
      }),
    [allProjects, excludeAssociatedTokens],
  )

  const archivedProjects = useMemo(
    () =>
      toTableRows({
        projects: allProjects.filter((item) => item.isArchived),
        excludeAssociatedTokens,
      }),
    [allProjects, excludeAssociatedTokens],
  )

  const activeTable = useTable({
    data: active,
    columns: scalingLayer2sColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  const archivedTable = useTable({
    data: archivedProjects,
    columns: scalingArchivedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: 'total',
          desc: true,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  const upcomingTable = useTable({
    data: upcomingProjects,
    columns: scalingUpcomingColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [
        {
          id: '#',
          desc: false,
        },
      ],
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
  })

  return (
    <div className="space-y-2">
      <ScalingTvlFilters items={allProjects} />
      <Tabs storeInSearchParams defaultValue="active" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <ActiveIcon />
              <span className="md:hidden">Active</span>
              <span className="max-md:hidden">Active projects</span>
              <TabCountBadge>{activeTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5">
              <UpcomingIcon />
              <span className="md:hidden">Upcoming</span>
              <span className="max-md:hidden">Upcoming projects</span>
              <TabCountBadge>{upcomingTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <ArchivedIcon />
              <span className="md:hidden">Archived</span>
              <span className="max-md:hidden">Archived projects</span>
              <TabCountBadge>{archivedTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
          </TabsList>
        </OverflowWrapper>
        <TabsContent value="active">
          <BasicTable table={activeTable} />
        </TabsContent>
        <TabsContent value="upcoming">
          <BasicTable table={upcomingTable} />
        </TabsContent>
        <TabsContent value="archived">
          <BasicTable table={archivedTable} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
