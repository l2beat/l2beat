import { getChainFlowsSection } from '~/server/features/chains/getChainProjectEntry'
import { getInteropProtocolData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import { getInteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { getInteropMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../../project/getProjectData'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'

export async function getInteropProtocolContent(
  page: ProjectPage,
  { helpers, manifest }: ProjectPageContext,
): Promise<ProjectPageContent<'InteropProtocolPage'> | undefined> {
  const { slug } = page
  const interopChains = getInteropChains()
  const liveChainIds = interopChains
    .filter((chain) => !chain.isUpcoming)
    .map((chain) => chain.id)
  const apiSelection = { from: liveChainIds, to: liveChainIds }

  const project = await ps.getProject({
    slug,
    select: ['interopConfig'],
    optional: ['statuses', 'display', 'discoveryUpdates', 'discoveryInfo'],
  })
  if (!project) return undefined

  const interopChainsWithIcons = mapInteropChainsToWithIcons(
    manifest,
    interopChains.filter((chain) => !chain.isUpcoming),
  )

  const [protocolData, chainFlows] = await Promise.all([
    getInteropProtocolData({ id: project.id, ...apiSelection }),
    page.sections.includes('chain')
      ? getChainFlowsSection(slug, helpers)
      : undefined,
  ])

  const projectEntry = await getInteropProtocolEntry(
    project,
    apiSelection,
    interopChainsWithIcons,
    protocolData,
    helpers,
    chainFlows,
  )

  return {
    props: { projectEntry, protocolData, apiSelection },
    metadata: {
      name: project.name,
      description: getInteropMetadataDescription({
        name: project.name,
        type: project.interopConfig.type,
        description: project.interopConfig.description,
      }),
    },
  }
}
