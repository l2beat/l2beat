'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useScalingFilter } from '~/app/(new)/(other)/_components/scaling-filter-context'
import { TabCountBadge } from '~/components/badge/tab-count-badge'
import { OverflowWrapper } from '~/components/core/overflow-wrapper'
import { BasicTable } from '~/components/table/basic-table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/tabs'
import { useTable } from '~/hooks/use-table'
import ActiveIcon from '~/icons/active.svg'
import ArchivedIcon from '~/icons/archived.svg'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { ScalingFilters } from '../../../../_components/scaling-filters'
import { scalingRiskColumns } from './columns'

export function ScalingRiskTables({
  entries,
}: { entries: ScalingRiskEntry[] }) {
  const includeFilters = useScalingFilter()

  const allProjects = useMemo(
    () => entries.filter((item) => includeFilters(item)),
    [entries, includeFilters],
  )

  const activeProjects = useMemo(
    () => allProjects.filter((item) => !item.isArchived && !item.isUpcoming),
    [allProjects],
  )

  const archivedProjects = useMemo(
    () => allProjects.filter((item) => item.isArchived),
    [allProjects],
  )

  const activeTable = useTable({
    data: activeProjects,
    columns: scalingRiskColumns,
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

  const archivedTable = useTable({
    data: archivedProjects,
    columns: scalingRiskColumns,
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
      <ScalingFilters items={allProjects} />
      <Tabs storeInSearchParams defaultValue="active" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <ActiveIcon />
              <span className="md:hidden">Active</span>
              <span className="max-md:hidden">Active projects</span>
              <TabCountBadge>{activeTable.getRowCount()}</TabCountBadge>
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
        <TabsContent value="archived">
          <BasicTable table={archivedTable} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
