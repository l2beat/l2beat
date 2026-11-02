import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getSearchBarProjectMatches } from '~/server/features/search-bar/getSearchBarEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getSearchQueryFromUrl, getSectionIndexFromUrl } from './notFoundUrl'

const SUGGESTIONS_LIMIT = 3
// Shorter fragments fuzzy-match most project names, so the list would be noise.
const SUGGESTIONS_MIN_QUERY_LENGTH = 3

export async function getNotFoundData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const searchQuery = getSearchQueryFromUrl(url)
  const [appLayoutProps, suggestions] = await Promise.all([
    getAppLayoutProps(),
    searchQuery.length >= SUGGESTIONS_MIN_QUERY_LENGTH
      ? getSearchBarProjectMatches(searchQuery, SUGGESTIONS_LIMIT)
      : [],
  ])

  return {
    head: {
      manifest,
      metadata: {
        ...getMetadata(manifest, {
          name: 'Page not found',
          description: 'The page you are looking for does not exist.',
          url,
          openGraph: {
            image: '/meta-images/home/opengraph-image.png',
          },
          excludeFromSearchEngines: true,
        }),
        // The URL may look like a page with a markdown version, but it is not one.
        markdownAlternateUrl: undefined,
      },
    },
    ssr: {
      page: 'NotFoundPage',
      props: {
        ...appLayoutProps,
        searchQuery,
        sectionIndex: getSectionIndexFromUrl(url),
        suggestions,
      },
    },
  }
}
