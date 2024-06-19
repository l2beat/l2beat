import { HOMEPAGE_MILESTONES, type Milestone, layer2s } from '@l2beat/config'
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
import { SummaryActiveTable } from './_components/table/active/summary-active-table'
import { toScalingSummaryEntry } from './_utils/scaling-summary-entry'
import { TvlApiResponse } from '@l2beat/shared-pure'
import { SummaryChart } from './_components/summary-chart'
import { readFile } from 'fs/promises'
import path from 'path'

export default async function Page() {
  // NOTE: This is too big to cache, we should split this into multiple smaller
  // endpoint.
  const tvlData = await readFile(
    path.join(process.cwd(), '/src/app/(new)/scaling/summary/tvl.json'),
    'utf8',
  )
    .then((data) => JSON.parse(data) as unknown)
    .then((data) => TvlApiResponse.parse(data))

  const milestones = getMilestones(HOMEPAGE_MILESTONES)

  const columns = tvlData.layers2s.daily.data.map((d) => {
    const timestamp = d[0]
    const usdValue = d[1]
    const ethValue = d[5]

    return {
      values: [{ value: usdValue }],
      data: {
        timestamp: timestamp.toNumber(),
        usdValue,
        ethValue,
      },
      milestone: milestones[timestamp.toNumber()],
    }
  })

  return (
    <div>
      <SummaryChart columns={columns} />
      <Tabs defaultValue="active" className="w-full">
        <OverflowWrapper>
          <TabsList>
            <TabsTrigger value="active" className="gap-1.5">
              <ActiveIcon />
              <span className="md:hidden">Active</span>
              <span className="hidden md:inline">Active projects</span>
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

        <TabsContent value="active">
          <SummaryActiveTable items={layer2s.map(toScalingSummaryEntry)} />
        </TabsContent>
        <TabsContent value="layer3s">Active Layer3s</TabsContent>
        <TabsContent value="upcoming">Upcoming Layer2s</TabsContent>
        <TabsContent value="archived">Archived Layer2s</TabsContent>
      </Tabs>
    </div>
  )
}

function getMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
