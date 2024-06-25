import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { OverflowWrapper } from '~/app/_components/overflow-wrapper'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/app/_components/tabs'
import ActiveIcon from '~/icons/active.svg'
import ArchivedIcon from '~/icons/archived.svg'
import Layer3sIcon from '~/icons/layer3s.svg'
import UpcomingIcon from '~/icons/upcoming.svg'
import { TvlChart } from '../../../_components/chart/tvl-chart'
import { SummaryLayer2sTable } from './_components/table/layer2s/summary-layer2s-table'
import { getDefaultMetadata } from '~/utils/get-default-metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})
import { getScalingSummaryEntries } from '~/server/features/scaling/get-scaling-summary-entries'
import { getTvl } from '~/server/features/scaling/get-tvl'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { SummaryLayer3sTable } from './_components/table/layer3s/summary-layer3s-table'
import { SummaryUpcomingTable } from './_components/table/upcoming/summary-upcoming-table'
import { SummaryArchivedTable } from './_components/table/archived.tsx/summary-archived.table'
import { ScalingLegend } from './_components/table/layer2s/legend'
import { OtherSites } from '~/app/_components/other-sites'
import { About } from '~/app/_components/about'

export default async function Page() {
  const tvl = await getTvl()
  const { layer2s, layer3s } = await getScalingSummaryEntries(tvl)

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
    <div className="mb-20">
      <TvlChart data={tvl.layers2s} milestones={HOMEPAGE_MILESTONES} />
      <HorizontalSeparator className="my-4 md:my-6" />
      <Tabs defaultValue="layer2s" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="layer2s" className="gap-1.5">
              <ActiveIcon />
              <span className="md:hidden">Layer2s</span>
              <span className="hidden md:inline">Layer 2 projects</span>
            </TabsTrigger>
            <TabsTrigger value="layer3s" className="gap-1.5">
              <Layer3sIcon />
              <span className="md:hidden">Layer 3s</span>
              <span className="hidden md:inline">Layer 3 projects</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="gap-1.5">
              <UpcomingIcon />
              <span className="md:hidden">Upcoming</span>
              <span className="hidden md:inline">Upcoming projects</span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="gap-1.5">
              <ArchivedIcon />
              <span className="md:hidden">Archived</span>
              <span className="hidden md:inline">Archived projects</span>
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
      <OtherSites />
      <About />
    </div>
  )
}
