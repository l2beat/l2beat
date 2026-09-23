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

interface SectionWithJsonUrl {
  props: { title: string; jsonUrl?: string }
}

/**
 * Collects the JSON endpoints behind a page's charts for its head, from the
 * same section props that render the visible JSON links.
 */
export function getChartJsonAlternates(
  projectName: string,
  sections: SectionWithJsonUrl[],
): JsonAlternate[] {
  return sections.flatMap(({ props }) =>
    props.jsonUrl
      ? [
          {
            title: `${projectName} ${props.title.toLowerCase()} (JSON)`,
            href: props.jsonUrl,
          },
        ]
      : [],
  )
}
