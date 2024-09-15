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
import {
  bridgesSummaryActiveColumns,
  bridgesSummaryArchivedColumns,
} from './columns'

import { ActiveIcon } from '~/icons/active'
import { ArchivedIcon } from '~/icons/archived'
import { type BridgesSummaryEntry } from '~/server/features/bridges/get-bridge-summary-entries'
import { useBridgesFilter } from '../../../_components/bridges-filter-context'
import { BridgesFilters } from '../../../_components/bridges-filters'

export interface Props {
  entries: BridgesSummaryEntry[]
}

export function BridgesSummaryTables({ entries }: Props) {
  const includeFilters = useBridgesFilter()

  const commonTableSettings = useMemo(
    () => ({
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      manualFiltering: true,
      initialState: {
        sorting: [
          {
            id: 'tvl',
            desc: true,
          },
        ],
        columnPinning: {
          left: ['#', 'logo'],
        },
      },
    }),
    [],
  )

  const filteredEntries = useMemo(
    () => entries.filter(includeFilters),
    [entries, includeFilters],
  )

  const activeProjects = useMemo(
    () => filteredEntries.filter((item) => !item.isArchived),
    [filteredEntries],
  )

  const archivedProjects = useMemo(
    () => filteredEntries.filter((item) => item.isArchived),
    [filteredEntries],
  )

  const activeTable = useTable({
    data: activeProjects,
    columns: bridgesSummaryActiveColumns,
    ...commonTableSettings,
  })

  const archivedTable = useTable({
    data: archivedProjects,
    columns: bridgesSummaryArchivedColumns,
    ...commonTableSettings,
  })

  return (
    <div className="space-y-2">
      <BridgesFilters entries={filteredEntries} />
      <Tabs defaultValue="active" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <span className="flex items-center justify-center gap-1 md:hidden">
                <ActiveIcon />
                Active
              </span>
              <span className="flex items-center justify-center gap-1 max-md:hidden">
                <ActiveIcon />
                Active projects
              </span>
              <TabCountBadge>{activeTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <span className="flex items-center justify-center gap-1 md:hidden">
                <ArchivedIcon />
                Archived
              </span>
              <span className="flex items-center justify-center gap-1 max-md:hidden">
                <ArchivedIcon />
                Archived projects
              </span>
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
