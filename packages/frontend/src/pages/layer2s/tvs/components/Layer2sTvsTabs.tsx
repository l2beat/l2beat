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
  OthersInfo,
  RollupsInfo,
  ValidiumsAndOptimiumsInfo,
} from '~/components/Layer2sTabsInfo'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import { DisplayControls } from '~/components/table/display/DisplayControls'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableSortingProvider } from '~/components/table/sorting/TableSortingContext'
import type { TabbedLayer2sEntries } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import type { Layer2sTvsEntry } from '~/server/features/layer2s/tvs/getLayer2sTvsEntries'
import { Layer2sTvsCharts } from './Layer2sTvsCharts'
import { Layer2sTvsDataKeysProvider } from './Layer2sTvsDataKeysContext'
import { Layer2sTvsStats } from './Layer2sTvsStats'
import { Layer2sTvsTable } from './table/Layer2sTvsTable'

type Props = TabbedLayer2sEntries<Layer2sTvsEntry> & {
  milestones: Milestone[]
}

export function Layer2sTvsTabs(props: Props) {
  const filterEntries = useFilterEntries()
  const { display, setDisplay } = useTvsDisplayControlsContext()
  const [breakdownType, setBreakdownType] = useState<
    'bridgeType' | 'assetCategory'
  >('bridgeType')

  const entries = {
    rollups: props.rollups.filter(filterEntries),
    validiumsAndOptimiums: props.validiumsAndOptimiums.filter(filterEntries),
    others: props.others.filter(filterEntries),
  }

  const initialSort = {
    id: 'total',
    desc: true,
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 max-md:mt-4 max-md:px-4">
        <TableFilters
          entries={[
            ...props.rollups,
            ...props.validiumsAndOptimiums,
            ...props.others,
          ]}
        />
        <DisplayControls display={display} setDisplay={setDisplay} />
      </div>
      <div className="mt-4">
        <Layer2sTvsStats entries={entries} />
      </div>
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
        </DirectoryTabsList>
        <Layer2sTvsDataKeysProvider>
          <TableSortingProvider initialSort={initialSort}>
            <DirectoryTabsContent value="rollups" className="pt-4 sm:pt-3">
              <RollupsInfo />
              <Layer2sTvsCharts
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
              <Layer2sTvsCharts
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
              <Layer2sTvsCharts
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
        </Layer2sTvsDataKeysProvider>
      </DirectoryTabs>
    </>
  )
}

function BreakdownTypeTabs({
  tab,
  entries,
  breakdownType,
  setBreakdownType,
}: {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  entries: Layer2sTvsEntry[]
  breakdownType: 'bridgeType' | 'assetCategory'
  setBreakdownType: (value: 'bridgeType' | 'assetCategory') => void
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
        <Layer2sTvsTable
          tab={tab}
          entries={entries}
          breakdownType={breakdownType}
        />
      </TabsContent>
      <TabsContent value="assetCategory">
        <Layer2sTvsTable
          tab={tab}
          entries={entries}
          breakdownType={breakdownType}
        />
      </TabsContent>
    </Tabs>
  )
}
