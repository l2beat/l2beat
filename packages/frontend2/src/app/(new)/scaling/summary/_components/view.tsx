'use client'
import React, { useMemo, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from '~/server/features/scaling/types'
import { type TvlCharts } from '~/server/features/scaling/get-tvl'
import { type Milestone } from '@l2beat/config'
import { useTable } from '~/hooks/use-table'
import {
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Checkbox } from '~/app/_components/checkbox'
import { summaryLayer3sColumns } from './table/layer3s/columns'
import { BasicTable } from '~/app/_components/table/basic-table'
import { scalingLayer2sColumns } from './table/layer2s/columns'
import { scalingUpcomingColumns } from './table/upcoming/columns'
import { scalingArchivedColumns } from './table/archived/columns'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import { ScalingLegend } from './table/layer2s/legend'

interface Props {
  layer2s: ScalingSummaryLayer2sEntry[]
  layer3s: ScalingSummaryLayer3sEntry[]
  layer2sTvl: TvlCharts
  milestones: Milestone[]
}

export function View({ layer2s, layer3s, layer2sTvl, milestones }: Props) {
  const [rollupsOnly, setRollupsOnly] = useState(false)

  const layer2sProjects = useMemo(
    () => layer2s.filter((item) => !item.isArchived && !item.isUpcoming),
    [layer2s],
  )
  const layer3sProjects = useMemo(
    () => layer3s.filter((item) => !item.isArchived && !item.isUpcoming),
    [layer3s],
  )
  const upcomingProjects = useMemo(
    () => [...layer2s, ...layer3s].filter((item) => item.isUpcoming),
    [layer2s, layer3s],
  )
  const archivedProjects = useMemo(
    () => layer2s.filter((item) => item.isArchived),
    [layer2s],
  )

  const columnFilters = useMemo(
    () => (rollupsOnly ? [{ id: 'category', value: 'Rollup' }] : []),
    [rollupsOnly],
  )

  const layer2sTable = useTable({
    data: layer2sProjects,
    columns: scalingLayer2sColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
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
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
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
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
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
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rollups-only"
          onCheckedChange={(checked) => setRollupsOnly(!!checked)}
        >
          Rollups only
        </Checkbox>
      </div>
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
