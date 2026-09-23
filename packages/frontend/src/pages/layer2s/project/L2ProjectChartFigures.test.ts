import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { type ComponentType, createElement, type ReactNode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { ChartLegendOnboardingProvider } from '~/components/core/chart/ChartLegendOnboardingContext'
import { TooltipProvider } from '~/components/core/tooltip/Tooltip'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { getMetadata } from '~/ssr/head/getMetadata'
import { Head } from '~/ssr/head/Head'
import { TRPCReactProvider } from '~/trpc/React'
import type { Manifest } from '~/utils/Manifest'
import { getChartJsonAlternates } from '~/utils/project/chart-figures/chartJsonLinks'

// End to end over the server render of an L2 project page's chart section:
// the section list the page loader builds is rendered through the same
// ProjectDetails tree and head the page uses, with renderToString standing in
// for the SSR entry. No query data is provided, so the chart itself renders
// its loading state, exactly as a crawler sees it before hydration.
describe('L2 project page chart figures', () => {
  const caption =
    'Daily average user operations per second (UOPS) on Arbitrum One from 2025 Sep 23 to 2026 Sep 22. Latest value: 30.00 UOPS, up 25.0% over this range.'
  const jsonUrl = '/api/scaling/activity/arbitrum?range=1y'
  const sections: ProjectDetailsSection[] = [
    {
      type: 'ActivitySection',
      props: {
        id: 'activity',
        title: 'Activity',
        project: {
          id: ProjectId('arbitrum'),
          name: 'Arbitrum One',
          shortName: undefined,
          iconUrl: '/icons/arbitrum.png',
        },
        milestones: [],
        defaultRange: [UnixTime(1758585600), UnixTime(1790121600)],
        dataSource: undefined,
        caption,
        jsonUrl,
      },
    },
  ]

  it('server-renders the activity chart as a captioned figure with a JSON link', () => {
    const html = renderWithAppProviders(
      createElement(ProjectDetails, { items: sections }),
    )

    expect(html).toInclude(
      `<figcaption class="sr-only">${caption}</figcaption>`,
    )
    expect(html).toMatchRegex(
      /<figure>.*<a [^>]*href="\/api\/scaling\/activity\/arbitrum\?range=1y"[^>]*type="application\/json"[^>]*>JSON<\/a>.*<\/figure>/,
    )
  })

  it('advertises the activity JSON endpoint in the head', () => {
    const manifest: Manifest = {
      getUrl: (url) => url,
      getImage: (url) => ({ src: url, width: 0, height: 0 }),
    }
    const metadata = getMetadata(manifest, {
      title: 'Arbitrum One - L2BEAT',
      url: '/scaling/projects/arbitrum',
      openGraph: { image: '/og.png' },
      jsonAlternates: getChartJsonAlternates('Arbitrum One', sections),
    })

    const head = renderToStaticMarkup(
      createElement(Head, { manifest, metadata }),
    )

    expect(head).toInclude(
      `<link rel="alternate" type="application/json" href="${jsonUrl}" title="Arbitrum One activity (JSON)"/>`,
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
