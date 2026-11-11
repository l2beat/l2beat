import { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import {
  getProjectInteropData,
  type ProjectInteropData,
} from '../layer2s/interop/getProjectInteropData'
import { getChainProjects } from './getChainProjects'

export interface ChainProjectPageEntry {
  name: string
  slug: string
  icon: string
  interop: ProjectInteropData['summary']
  sections: ProjectDetailsSection[]
}

export async function getChainProjectEntry(
  slug: string,
  helpers: SsrHelpers,
): Promise<ChainProjectPageEntry | undefined> {
  const [chainProjects, interopProjects] = await Promise.all([
    getChainProjects(),
    ps.getProjects({ select: ['interopConfig'] }),
  ])
  const chain = chainProjects.find((chain) => chain.slug === slug)
  if (!chain) return undefined

  const interopData = await getProjectInteropData(
    ProjectId(chain.slug),
    interopProjects,
    helpers,
  )
  if (!interopData) return undefined

  return {
    name: chain.name,
    slug: chain.slug,
    icon: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    interop: interopData.summary,
    sections: [
      {
        type: 'InteropFlowsSection',
        props: {
          id: 'interop-flows',
          title: 'Volume and flows',
          interopChains: interopData.interopChains,
          protocols: interopData.protocols,
          defaultSelectedChains: interopData.defaultSelectedChains,
          defaultStatsChainId: interopData.chainId,
          canonicalProtocolId: interopData.canonicalProtocolId,
        },
      },
    ],
  }
}
