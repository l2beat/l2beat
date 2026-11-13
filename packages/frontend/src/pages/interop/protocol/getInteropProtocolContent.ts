import { getInteropProtocolData } from '~/server/features/layer2s/interop/getInteropProtocolData'
import { getInteropProtocolEntry } from '~/server/features/layer2s/interop/protocol/getInteropProtocolEntry'
import { getInteropChains } from '~/server/features/layer2s/interop/utils/getInteropChains'
import { ps } from '~/server/projects'
import { getInteropMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { mapInteropChainsToWithIcons } from '../utils/mapInteropChainsToWithIcons'
import { renderInteropProtocolMarkdown } from './renderInteropProtocolMarkdown'

export const interopProtocolPage: ProjectPageDefinition<'InteropProtocolPage'> =
  {
    component: 'InteropProtocolPage',
    getContent: getInteropProtocolContent,
    renderMarkdown: renderInteropProtocolMarkdown,
  }

export async function getInteropProtocolContent(
  slug: string,
  { helpers, manifest }: ProjectPageContext,
): Promise<ProjectPageContent<'InteropProtocolPage'> | undefined> {
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

  const protocolData = await getInteropProtocolData({
    id: project.id,
    ...apiSelection,
  })

  const projectEntry = await getInteropProtocolEntry(
    project,
    apiSelection,
    interopChainsWithIcons,
    protocolData,
    helpers,
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
