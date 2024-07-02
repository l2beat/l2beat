import { ChainConverter, ChainId, ProjectId } from '@l2beat/shared-pure'
import { layer3s } from '../projects/layer3s'
import { chains } from '../chains'
import { layer2s } from '../projects/layer2s'

export const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

export function getChainToProjectMapping() {
  const chainToProject = new Map<string, ProjectId>()

  for (const project of layer2s) {
    if (project.chainConfig) {
      const chain = chainConverter.toName(ChainId(project.chainConfig.chainId))
      chainToProject.set(chain, project.id)
    }
  }

  for (const project of layer3s) {
    if (project.chainConfig) {
      const chain = chainConverter.toName(ChainId(project.chainConfig.chainId))
      chainToProject.set(chain, project.id)
    }
  }

  return chainToProject
}
