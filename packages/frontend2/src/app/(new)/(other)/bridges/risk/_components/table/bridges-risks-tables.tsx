'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { BasicTable } from '~/app/_components/table/basic-table'
import { useTable } from '~/hooks/use-table'

import { notUndefined } from '@l2beat/shared-pure'
import { useCallback, useMemo, useState } from 'react'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { type BridgesRiskEntry } from '~/server/features/bridges/types'
import {
  BridgesFilters,
  type BridgesFiltersState,
  DEFAULT_BRIDGES_FILTERS_STATE,
} from '../../../_components/bridges-filters'
import { bridgesRisksColumns } from './columns'

import ActiveIcon from '~/icons/active.svg'
import ArchivedIcon from '~/icons/archived.svg'

export interface Props {
  items: BridgesRiskEntry[]
}

export function BridgesRiskTables({ items }: Props) {
  const [filters, setFilters] = useState<BridgesFiltersState>(
    DEFAULT_BRIDGES_FILTERS_STATE,
  )

  const includeFilters = useCallback(
    (entry: BridgesRiskEntry) => {
      const checks = [
        filters.category !== undefined
          ? entry.category === filters.category
          : undefined,
        filters.validatedBy !== undefined
          ? entry.validatedBy?.value === filters.validatedBy
          : undefined,
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [filters],
  )

  const commonTableSettings = useMemo(
    () => ({
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
      },
    }),
    [],
  )
  const activeProjects = useMemo(
    () => items.filter(includeFilters).filter((item) => !item.isArchived),
    [items, includeFilters],
  )
  const archivedProjects = useMemo(
    () => items.filter(includeFilters).filter((item) => item.isArchived),
    [items, includeFilters],
  )

  const activeTable = useTable({
    data: activeProjects,
    columns: bridgesRisksColumns,
    ...commonTableSettings,
  })

  const archivedTable = useTable({
    data: archivedProjects,
    columns: bridgesRisksColumns,
    ...commonTableSettings,
  })

  return (
    <div className="space-y-2">
      <BridgesFilters items={items} state={filters} setState={setFilters} />
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
          <BasicTable table={activeTable} onResetFilters={() => null} />
        </TabsContent>
        <TabsContent value="archived">
          <BasicTable table={archivedTable} onResetFilters={() => null} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
