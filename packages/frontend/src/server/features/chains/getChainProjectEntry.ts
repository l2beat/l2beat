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
  const chainInterop = await getChainInterop(slug, helpers)
  if (!chainInterop) return undefined
  const { chain, interopData } = chainInterop

  return {
    name: chain.name,
    slug: chain.slug,
    icon: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
    interop: interopData.summary,
    sections: [toFlowsSection(interopData)],
  }
}

/**
 * The flows of the chain across every protocol, for the page of a project
 * that is also a chain. Undefined when the chain has no page of its own.
 */
export async function getChainFlowsSection(slug: string, helpers: SsrHelpers) {
  const chainInterop = await getChainInterop(slug, helpers)
  return chainInterop && toFlowsSection(chainInterop.interopData)
}

async function getChainInterop(slug: string, helpers: SsrHelpers) {
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
  return interopData && { chain, interopData }
}

function toFlowsSection(
  interopData: ProjectInteropData,
): Extract<ProjectDetailsSection, { type: 'InteropFlowsSection' }> {
  return {
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
  }
}
