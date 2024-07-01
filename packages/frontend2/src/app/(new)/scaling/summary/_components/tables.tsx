'use client'
import { type Milestone } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { BasicTable } from '~/app/_components/table/basic-table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { useTable } from '~/hooks/use-table'
import { type TvlCharts } from '~/server/features/scaling/get-tvl'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from '~/server/features/scaling/types'
import { ScalingFilters, type ScalingFiltersState } from './scaling-filters'
import { scalingArchivedColumns } from './table/archived/columns'
import { scalingLayer2sColumns } from './table/layer2s/columns'
import { ScalingLegend } from './table/layer2s/legend'
import { summaryLayer3sColumns } from './table/layer3s/columns'
import { scalingUpcomingColumns } from './table/upcoming/columns'

interface Props {
  layer2s: ScalingSummaryLayer2sEntry[]
  layer3s: ScalingSummaryLayer3sEntry[]
  layer2sTvl: TvlCharts
  milestones: Milestone[]
}

export function Tables({ layer2s, layer3s, layer2sTvl, milestones }: Props) {
  const [scalingFilters, setScalingFilters] = useState<ScalingFiltersState>({
    rollupsOnly: false,
    category: undefined,
    stack: undefined,
    stage: undefined,
    purpose: undefined,
  })

  const includeFilters = useCallback(
    (entry: ScalingSummaryLayer2sEntry | ScalingSummaryLayer3sEntry) => {
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

  const layer2sProjects = useMemo(
    () =>
      layer2s.filter(
        (item) => !item.isArchived && !item.isUpcoming && includeFilters(item),
      ),
    [layer2s, includeFilters],
  )
  const layer3sProjects = useMemo(
    () =>
      layer3s.filter(
        (item) => !item.isArchived && !item.isUpcoming && includeFilters(item),
      ),
    [layer3s, includeFilters],
  )
  const upcomingProjects = useMemo(
    () =>
      [...layer2s, ...layer3s].filter(
        (item) => item.isUpcoming && includeFilters(item),
      ),
    [layer2s, layer3s, includeFilters],
  )
  const archivedProjects = useMemo(
    () => layer2s.filter((item) => item.isArchived && includeFilters(item)),
    [layer2s, includeFilters],
  )

  const layer2sTable = useTable({
    data: layer2sProjects,
    columns: scalingLayer2sColumns,
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

  const layer3sTable = useTable({
    data: layer3sProjects,
    columns: summaryLayer3sColumns,
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
    },
  })

  return (
    <>
      <TvlChart data={layer2sTvl} milestones={milestones} />
      <HorizontalSeparator className="my-4 md:my-6" />
      <ScalingFilters
        items={[
          ...layer2sProjects,
          ...layer3sProjects,
          ...archivedProjects,
          ...upcomingProjects,
        ]}
        state={scalingFilters}
        setState={setScalingFilters}
      />
      <Tabs defaultValue="layer2s" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="layer2s" className="gap-1.5">
              <span className="md:hidden">Layer2s</span>
              <span className="max-md:hidden">Layer 2 projects</span>
              <TabCountBadge>{layer2sTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="layer3s" className="gap-1.5">
              <span className="md:hidden">Layer 3s</span>
              <span className="max-md:hidden">Layer 3 projects</span>
              <TabCountBadge>{layer3sTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5">
              <span className="md:hidden">Upcoming</span>
              <span className="max-md:hidden">Upcoming projects</span>
              <TabCountBadge>{upcomingTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <span className="md:hidden">Archived</span>
              <span className="max-md:hidden">Archived projects</span>
              <TabCountBadge>{archivedTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
          </TabsList>
        </OverflowWrapper>
        <TabsContent value="layer2s">
          <BasicTable table={layer2sTable} />
          <ScalingLegend />
        </TabsContent>
        <TabsContent value="layer3s">
          <BasicTable table={layer3sTable} />
        </TabsContent>
        <TabsContent value="upcoming">
          <BasicTable table={upcomingTable} />
        </TabsContent>
        <TabsContent value="archived">
          <BasicTable table={archivedTable} />
        </TabsContent>
      </Tabs>
    </>
  )
}
