import type { ChartDescription } from '~/components/chart/ChartFigure'
import type {
  ActivityApiRange,
  TvsApiRange,
} from '~/server/routers/PublicApiRouter'
import type { JsonAlternate } from '~/ssr/head/getMetadata'

export function getTvsJsonUrl(slug: string, range: TvsApiRange) {
  return `/api/scaling/tvs/${slug}?range=${range}`
}

export function getActivityJsonUrl(slug: string, range: ActivityApiRange) {
  return `/api/scaling/activity/${slug}?range=${range}`
}

interface SectionWithChart {
  props: { title: string; chartDescription?: ChartDescription }
}

/**
 * Collects the JSON endpoints behind a page's charts for its head, from the
 * same section props that render the visible JSON links.
 */
export function getChartJsonAlternates(
  projectName: string,
  sections: SectionWithChart[],
): JsonAlternate[] {
  return sections.flatMap(({ props }) => {
    const jsonUrl = props.chartDescription?.jsonUrl
    if (!jsonUrl) return []
    return [
      {
        title: `${projectName} ${props.title.toLowerCase()} (JSON)`,
        href: jsonUrl,
      },
    ]
  })
}
