import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingProjectTvsBreakdownData as nextGetScalingProjectTvsBreakdownData } from '~/server/features/scaling/project/get-scaling-project-tvs-breakdown-data'

export async function getScalingProjectTvsBreakdownData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const [searchBarProjects, tvsBreakdownData] = await Promise.all([
    getSearchBarProjects(),
    nextGetScalingProjectTvsBreakdownData(slug),
  ])

  if (!tvsBreakdownData) {
    return undefined
  }

  return {
    head: {
      manifest,
      title: `${tvsBreakdownData.project.name} | TVS Breakdown - L2BEAT`,
      description: `${tvsBreakdownData.project.name} project TVS Breakdown overview on L2BEAT. In depth scaling protocol analysis. Ethereum scaling analytics and research.`,
    },
    ssr: {
      page: 'ScalingProjectTvsBreakdownPage',
      props: {
        tvsBreakdownData,
        searchBarProjects,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
      },
    },
  }
}
