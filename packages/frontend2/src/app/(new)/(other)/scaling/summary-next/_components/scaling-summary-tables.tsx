'use client'

import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import React, { useCallback, useMemo } from 'react'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { BasicTable } from '~/app/_components/table/basic-table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { useCookieState } from '~/hooks/use-cookie-state'
import { useTable } from '~/hooks/use-table'
import { type ScalingSummaryEntry } from '~/server/features/scaling/get-scaling-summary-entries'
import { api } from '~/trpc/react'
import { useScalingFilter } from '../../../_components/scaling-filter-context'
import { ScalingFilters } from '../../../_components/scaling-filters'
import { toTableRows } from '../_utils/to-table-rows'
import { scalingArchivedColumns } from './table/archived/columns'
import { scalingLayer2sColumns } from './table/layer2s/columns'
import { ScalingLegend } from './table/layer2s/legend'
import { summaryLayer3sColumns } from './table/layer3s/columns'
import { scalingUpcomingColumns } from './table/upcoming/columns'

interface Props {
  projects: ScalingSummaryEntry[]
}

export function ScalingSummaryTables({ projects }: Props) {
  const [timeRange] = useCookieState('chartRange')
  const includeFilters = useScalingFilter()
  const { data } = api.scaling.summary.useQuery({
    range: timeRange,
    type: 'layer2',
  })

  const layer2sProjects = useMemo(
    () =>
      data
        ? toTableRows({
            projects: projects.filter(
              (item) =>
                item.type === 'layer2' &&
                !item.isArchived &&
                !item.isUpcoming &&
                includeFilters(item),
            ),
            summaryData: data,
          })
        : [],
    [projects, includeFilters, data],
  )
  {
    /*const layer3sProjects = useMemo(
    () =>
      data
        ? toTableRows({
            projects: projects.filter(
              (item) =>
                item.type === 'layer3' &&
                !item.isArchived &&
                !item.isUpcoming &&
                includeFilters(item),
            ),
            summaryData: data,
          })
        : [],
    [projects, includeFilters, data],
  )
  const upcomingProjects = useMemo(
    () =>
      data
        ? toTableRows({
            projects: projects.filter(
              (item) => item.isUpcoming && includeFilters(item),
            ),
            summaryData: data,
          })
        : [],
    [projects, includeFilters, data],
  )
  const archivedProjects = useMemo(
    () =>
      data
        ? toTableRows({
            projects: projects.filter(
              (item) => item.isArchived && includeFilters(item),
            ),
            summaryData: data,
          })
        : [],
    [projects, includeFilters, data],
  )*/
  }

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

  /*const layer3sTable = useTable({
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
  })*/

  if (!data) return null

  return (
    <div className="space-y-2">
      <ScalingFilters
        items={[
          ...layer2sProjects,
          //...layer3sProjects,
          //...archivedProjects,
          //...upcomingProjects,
        ]}
      />
      <Tabs defaultValue="layer2s" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="layer2s" className="gap-1.5">
              <span className="md:hidden">Layer2s</span>
              <span className="max-md:hidden">Layer 2 projects</span>
              <TabCountBadge>{layer2sTable.getRowCount()}</TabCountBadge>
            </TabsTrigger>
            {/*<TabsTrigger value="layer3s" className="gap-1.5">
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
            </TabsTrigger>*/}
          </TabsList>
        </OverflowWrapper>
        <TabsContent value="layer2s">
          <BasicTable table={layer2sTable} />
          <ScalingLegend />
        </TabsContent>
        {/*<TabsContent value="layer3s">
          <BasicTable table={layer3sTable} />
        </TabsContent>
        <TabsContent value="upcoming">
          <BasicTable table={upcomingTable} />
        </TabsContent>
        <TabsContent value="archived">
          <BasicTable table={archivedTable} />
        </TabsContent>*/}
      </Tabs>
    </div>
  )
}
