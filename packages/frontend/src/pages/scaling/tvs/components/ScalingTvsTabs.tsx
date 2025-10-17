import type { Milestone } from '@l2beat/config'
import { useState } from 'react'
import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import {
  NotReviewedInfo,
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/ScalingTabsInfo'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { ScalingTvsCharts } from './ScalingTvsCharts'
import { ScalingTvsDataKeysProvider } from './ScalingTvsDataKeysContext'
import { ScalingTvsTable } from './table/ScalingTvsTable'

type Props = TabbedScalingEntries<ScalingTvsEntry> & {
  milestones: Milestone[]
}

export function ScalingTvsTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const [breakdownType, setBreakdownType] = useState<
    'bridgeType' | 'assetCategory'
  >('bridgeType')

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
    notReviewed: props.notReviewed.filter(filterEntries),
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <TableFilters
        entries={[
          ...props.rollups,
          ...props.validiumsAndOptimiums,
          ...props.others,
          ...props.notReviewed,
        ]}
      />
      <DirectoryTabs defaultValue="rollups">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="rollups">
            Rollups <CountBadge>{entries.rollups.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="validiumsAndOptimiums">
            Validiums & Optimiums{' '}
            <CountBadge>{entries.validiumsAndOptimiums.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="others">
            Others <CountBadge>{entries.others.length}</CountBadge>
          </DirectoryTabsTrigger>
          {entries.notReviewed.length > 0 && (
            <DirectoryTabsTrigger value="notReviewed">
              Not reviewed
              <CountBadge>{entries.notReviewed.length}</CountBadge>
            </DirectoryTabsTrigger>
          )}
        </DirectoryTabsList>
        <ScalingTvsDataKeysProvider>
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
              <RollupsInfo />
              <ScalingTvsCharts
                tab="rollups"
                entries={entries.rollups}
                milestones={props.milestones}
              />
              <HorizontalSeparator className="mt-4 mb-3" />
              <BreakdownTypeTabs
                tab="rollups"
                entries={entries.rollups}
                breakdownType={breakdownType}
                setBreakdownType={setBreakdownType}
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent
              value="validiumsAndOptimiums"
              className="pt-4 sm:pt-3"
            >
              <ValidiumsAndOptimiumsInfo />
              <ScalingTvsCharts
                tab="validiumsAndOptimiums"
                entries={entries.validiumsAndOptimiums}
                milestones={props.milestones}
              />
              <HorizontalSeparator className="mt-4 mb-3" />
              <BreakdownTypeTabs
                tab="validiumsAndOptimiums"
                entries={entries.validiumsAndOptimiums}
                breakdownType={breakdownType}
                setBreakdownType={setBreakdownType}
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="others" className="pt-4 sm:pt-3">
              <OthersInfo />
              <ScalingTvsCharts
                tab="others"
                entries={entries.others}
                milestones={props.milestones}
              />
              <HorizontalSeparator className="mt-4 mb-3" />
              <BreakdownTypeTabs
                tab="others"
                entries={entries.others}
                breakdownType={breakdownType}
                setBreakdownType={setBreakdownType}
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="notReviewed" className="pt-4 sm:pt-3">
              <NotReviewedInfo />
              <BreakdownTypeTabs
                tab="notReviewed"
                entries={entries.notReviewed}
                breakdownType={breakdownType}
                setBreakdownType={setBreakdownType}
                ignoreUnderReviewIcon
              />
            </DirectoryTabsContent>
          </TableSortingProvider>
        </ScalingTvsDataKeysProvider>
      </DirectoryTabs>
    </>
  )
}

function BreakdownTypeTabs({
  tab,
  entries,
  breakdownType,
  setBreakdownType,
  ignoreUnderReviewIcon,
}: {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed'
  entries: ScalingTvsEntry[]
  breakdownType: 'bridgeType' | 'assetCategory'
  setBreakdownType: (value: 'bridgeType' | 'assetCategory') => void
  ignoreUnderReviewIcon?: boolean
}) {
  return (
    <Tabs
      name="breakdownType"
      value={breakdownType}
      onValueChange={(value) =>
        setBreakdownType(value as 'bridgeType' | 'assetCategory')
      }
    >
      <TabsList>
        <TabsTrigger value="bridgeType">By bridge type</TabsTrigger>
        <TabsTrigger value="assetCategory">By asset category</TabsTrigger>
      </TabsList>
      <TabsContent value="bridgeType">
        <ScalingTvsTable
          tab={tab}
          entries={entries}
          breakdownType={breakdownType}
          ignoreUnderReviewIcon={ignoreUnderReviewIcon}
        />
      </TabsContent>
      <TabsContent value="assetCategory">
        <ScalingTvsTable
          tab={tab}
          entries={entries}
          breakdownType={breakdownType}
          ignoreUnderReviewIcon={ignoreUnderReviewIcon}
        />
      </TabsContent>
    </Tabs>
  )
}
