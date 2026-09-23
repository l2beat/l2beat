import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type ComponentType, createElement, type ReactNode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getMetadata } from '~/ssr/head/getMetadata'
import { Head } from '~/ssr/head/Head'
import { TRPCReactProvider } from '~/trpc/React'
import type { Manifest } from '~/utils/Manifest'
import {
  getActivityChartCaption,
  getTvsChartCaption,
} from '~/utils/project/chart-figures/chartCaptions'
import {
  getActivityJsonUrl,
  getChartJsonAlternates,
  getTvsJsonUrl,
} from '~/utils/project/chart-figures/chartJsonLinks'

// Server render of an L2 project page's chart sections, end to end from
// endpoint-shaped series: the section getters' caption and link builders
// produce the section props, which render through the page's ProjectDetails
// tree and head with renderToString, as the SSR entry does. No query data is
// available to the charts, so they render their loading state, which is what
// a crawler sees before hydration. Expected sentences are written out by hand.
describe('L2 project page chart figures', () => {
  const START = UnixTime.fromDate(new Date('2025-09-23T00:00:00Z'))
  const END = UnixTime.fromDate(new Date('2026-09-22T00:00:00Z'))
  const project: ChartProject = {
    id: ProjectId('arbitrum'),
    name: 'Arbitrum One',
    shortName: undefined,
    iconUrl: '/icons/arbitrum.png',
  }
  const sections: ProjectDetailsSection[] = [
    {
      type: 'L2TvsSection',
      props: {
        id: 'tvs',
        title: 'Value Secured',
        project,
        milestones: [],
        tokens: [],
        tvsInfo: { associatedTokens: [], warnings: [] },
        defaultRange: [START, END],
        chartDescription: {
          caption: getTvsChartCaption(project.name, [
            [START, 3000, 8e9, 1e9, 1e9, 0, 0, 0, 0, 0, 0],
            [END, 4000, 9e9, 2e9, 1e9, 0, 0, 0, 0, 0, 0],
          ]),
          jsonUrl: getTvsJsonUrl('arbitrum', '1y'),
        },
      },
    },
    {
      type: 'ActivitySection',
      props: {
        id: 'activity',
        title: 'Activity',
        project,
        milestones: [],
        defaultRange: [START, END],
        dataSource: undefined,
        chartDescription: {
          caption: getActivityChartCaption(project.name, [
            [START, 86_400, 0, 86_400 * 20, 0],
            [END, 86_400, 0, 86_400 * 25, 0],
          ]),
          jsonUrl: getActivityJsonUrl('arbitrum', '1y'),
        },
      },
    },
  ]

  it('server-renders each chart as a figure with its caption and JSON link', () => {
    const html = renderWithAppProviders(
      createElement(ProjectDetails, { items: sections }),
    )

    expect(html).toInclude(
      '<figcaption class="sr-only">Total value secured by Arbitrum One in USD from 2025 Sep 23 to 2026 Sep 22. Latest value: $12.00 B, up 20.0% over this range.</figcaption>',
    )
    expect(html).toInclude(
      '<figcaption class="sr-only">Daily average user operations per second (UOPS) on Arbitrum One from 2025 Sep 23 to 2026 Sep 22. Latest value: 25.00 UOPS, up 25.0% over this range.</figcaption>',
    )
    for (const endpoint of ['tvs', 'activity']) {
      expect(html).toMatchRegex(
        new RegExp(
          `<figure>.*<a [^>]*href="/api/scaling/${endpoint}/arbitrum\\?range=1y"[^>]*type="application/json"[^>]*>JSON</a>`,
        ),
      )
    }
  })

  it('advertises the JSON endpoints in the head', () => {
    const manifest: Manifest = {
      getUrl: (url) => url,
      getImage: (url) => ({ src: url, width: 0, height: 0 }),
    }
    const metadata = getMetadata(manifest, {
      title: 'Arbitrum One - L2BEAT',
      url: '/scaling/projects/arbitrum',
      openGraph: { image: '/og.png' },
      jsonAlternates: getChartJsonAlternates(project.name, sections),
    })

    const head = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(head).toInclude(
      '<link rel="alternate" type="application/json" href="/api/scaling/tvs/arbitrum?range=1y" title="Arbitrum One value secured (JSON)"/>',
    )
    expect(head).toInclude(
      '<link rel="alternate" type="application/json" href="/api/scaling/activity/arbitrum?range=1y" title="Arbitrum One activity (JSON)"/>',
    )
  })
})

// The subset of the app layout's providers that chart sections read.
function renderWithAppProviders(page: ReactNode) {
  const providers: ComponentType<{ children: ReactNode }>[] = [
    TRPCReactProvider,
    TooltipProvider,
    ChartLegendOnboardingProvider,
  ]
  return renderToString(
    providers.reduceRight(
      (children, Provider) => createElement(Provider, { children }),
      page,
    ),
  )
}
