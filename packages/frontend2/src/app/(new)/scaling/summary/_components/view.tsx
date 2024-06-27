'use client'
import React from 'react'
import { TabCountBadge } from '~/app/_components/badge/tab-count-badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import { ScalingLegend } from './table/layer2s/legend'
import { TvlChart } from '~/app/_components/chart/tvl-chart'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import { SummaryArchivedTable } from './table/archived.tsx/summary-archived.table'
import { SummaryLayer2sTable } from './table/layer2s/summary-layer2s-table'
import { SummaryLayer3sTable } from './table/layer3s/summary-layer3s-table'
import { SummaryUpcomingTable } from './table/upcoming/summary-upcoming-table'
import {
  type ScalingSummaryLayer2sEntry,
  type ScalingSummaryLayer3sEntry,
} from '~/server/features/scaling/types'
import { type TvlCharts } from '~/server/features/scaling/get-tvl'
import { type Milestone } from '@l2beat/config'

interface Props {
  layer2s: ScalingSummaryLayer2sEntry[]
  layer3s: ScalingSummaryLayer3sEntry[]
  layer2sTvl: TvlCharts
  milestones: Milestone[]
}

export function View({ layer2s, layer3s, layer2sTvl, milestones }: Props) {
  const layer2sProjects = layer2s.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const layer3sProjects = layer3s.filter(
    (item) => !item.isArchived && !item.isUpcoming,
  )
  const upcomingProjects = [...layer2s, ...layer3s].filter(
    (item) => item.isUpcoming,
  )
  const archivedProjects = layer2s.filter((item) => item.isArchived)

  return (
    <>
      <TvlChart data={layer2sTvl} milestones={milestones} />
      <HorizontalSeparator className="my-4 md:my-6" />
      <Tabs defaultValue="layer2s" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="layer2s" className="gap-1.5">
              <span className="md:hidden">Layer2s</span>
              <span className="hidden md:inline">Layer 2 projects</span>
              <TabCountBadge>{layer2sProjects.length}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="layer3s" className="gap-1.5">
              <span className="md:hidden">Layer 3s</span>
              <span className="hidden md:inline">Layer 3 projects</span>
              <TabCountBadge>{layer3sProjects.length}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5">
              <span className="md:hidden">Upcoming</span>
              <span className="hidden md:inline">Upcoming projects</span>
              <TabCountBadge>{upcomingProjects.length}</TabCountBadge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <span className="md:hidden">Archived</span>
              <span className="hidden md:inline">Archived projects</span>
              <TabCountBadge>{archivedProjects.length}</TabCountBadge>
            </TabsTrigger>
          </TabsList>
        </OverflowWrapper>
        <TabsContent value="layer2s">
          <SummaryLayer2sTable items={layer2sProjects} />
          <ScalingLegend />
        </TabsContent>
        <TabsContent value="layer3s">
          <SummaryLayer3sTable items={layer3sProjects} />
        </TabsContent>
        <TabsContent value="upcoming">
          <SummaryUpcomingTable items={upcomingProjects} />
        </TabsContent>
        <TabsContent value="archived">
          <SummaryArchivedTable items={archivedProjects} />
        </TabsContent>
      </Tabs>
    </>
  )
}
