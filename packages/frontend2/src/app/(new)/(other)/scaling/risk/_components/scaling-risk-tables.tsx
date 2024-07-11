'use client'
import { notUndefined } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { BasicTable } from '~/app/_components/table/basic-table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { useTable } from '~/hooks/use-table'
import { type ScalingRiskEntry } from '~/server/features/scaling/get-scaling-risk-entries'
import {
  ScalingFilters,
  type ScalingFiltersState,
} from '../../../_components/scaling-filters'
import { scalingRiskColumns } from './table/columns'

const DEFAULT_SCALING_FILTERS = {
  rollupsOnly: false,
  category: undefined,
  stack: undefined,
  stage: undefined,
  purpose: undefined,
  hostChain: undefined,
}

export function ScalingRiskTables({
  projects,
}: { projects: ScalingRiskEntry[] }) {
  const [scalingFilters, setScalingFilters] = useState<ScalingFiltersState>(
    DEFAULT_SCALING_FILTERS,
  )

  const includeFilters = useCallback(
    (entry: ScalingRiskEntry) => {
      const checks = [
        scalingFilters.rollupsOnly !== false
          ? entry.category.includes('Rollup')
          : undefined,
        scalingFilters.category !== undefined
          ? entry.category === scalingFilters.category
          : undefined,
        scalingFilters.stack !== undefined
          ? entry.provider === scalingFilters.stack
          : undefined,
        scalingFilters.stage !== undefined
          ? entry.type === 'layer2'
            ? entry.stage?.stage === scalingFilters.stage
            : false
          : undefined,
        scalingFilters.purpose !== undefined
          ? entry.purposes.some((purpose) => purpose === scalingFilters.purpose)
          : undefined,
      ].filter(notUndefined)

      return checks.length === 0 || checks.every(Boolean)
    },
    [scalingFilters],
  )

  const allProjects = useMemo(
    () => projects.filter((item) => includeFilters(item)),
    [projects, includeFilters],
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
          id: 'total',
          desc: true,
        },
      ],
    },
  })

  return (
    <div className="space-y-2">
      <ScalingFilters
        items={allProjects}
        state={scalingFilters}
        setState={setScalingFilters}
      />
      <Tabs defaultValue="active" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <span className="md:hidden">Active</span>
              <span className="max-md:hidden">Active projects</span>
              <TabCountBadge>{activeTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <span className="md:hidden">Archived</span>
              <span className="max-md:hidden">Archived projects</span>
              <TabCountBadge>{archivedTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
          </TabsList>
        </OverflowWrapper>
        <TabsContent value="active">
          <BasicTable
            table={activeTable}
            onResetFilters={() => setScalingFilters(DEFAULT_SCALING_FILTERS)}
          />
        </TabsContent>
        <TabsContent value="archived">
          <BasicTable
            table={archivedTable}
            onResetFilters={() => setScalingFilters(DEFAULT_SCALING_FILTERS)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
