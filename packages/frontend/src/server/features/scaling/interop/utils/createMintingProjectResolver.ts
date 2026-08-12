import type { InteropPlugin, Project } from '@l2beat/config'

export interface MintingProjectInput {
  plugin: string
  chain: string
  abstractTokenId: string
}

export function createMintingProjectResolver(
  projects: Project<'interopConfig'>[],
): (input: MintingProjectInput) => Project<'interopConfig'>[] {
  return (input) => {
    const matchingProjects = projects.filter((project) =>
      project.interopConfig.plugins.some((plugin) =>
        matchesMintingPlugin(plugin, input),
      ),
    )

    const shadowedProjectIds = new Set(
      matchingProjects.flatMap((project) =>
        project.interopConfig.subgroupId
          ? [project.interopConfig.subgroupId]
          : [],
      ),
    )

    return matchingProjects.filter(
      (project) => !shadowedProjectIds.has(project.id),
    )
  }
}

function matchesMintingPlugin(
  plugin: InteropPlugin,
  input: MintingProjectInput,
): boolean {
  if (plugin.plugin !== input.plugin) return false
  if (plugin.bridgeType === 'nonMinting') return false
  if (plugin.chain !== undefined && plugin.chain !== input.chain) return false
  if (
    plugin.abstractTokenId !== undefined &&
    plugin.abstractTokenId !== input.abstractTokenId
  ) {
    return false
  }
  return true
}
