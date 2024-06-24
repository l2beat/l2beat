import { HOMEPAGE_MILESTONES, layer2s } from '@l2beat/config'
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
import { toScalingSummaryEntry } from './_utils/scaling-summary-entry'
import { getDefaultMetadata } from '~/utils/get-default-metadata'

export const metadata = getDefaultMetadata({
  openGraph: {
    url: '/scaling/summary',
  },
})
import { layer2sTvl } from './tvl'

export default async function Page() {
  return (
    <div>
      <TvlChart data={layer2sTvl} milestones={HOMEPAGE_MILESTONES} />
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
          <SummaryLayer2sTable items={layer2s.map(toScalingSummaryEntry)} />
        </TabsContent>
        <TabsContent value="layer3s">Active Layer3s</TabsContent>
        <TabsContent value="upcoming">Upcoming Layer2s</TabsContent>
        <TabsContent value="archived">Archived Layer2s</TabsContent>
      </Tabs>
    </div>
  )
}
