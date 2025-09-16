import type { ProjectService } from '@l2beat/config'
import type { EcosystemsConfig } from '../Config'

export async function getEcosystemsConfig(
  ps: ProjectService,
): Promise<EcosystemsConfig> {
  const projects = await ps.getProjects({
    select: ['ecosystemConfig'],
  })

  const tokens = projects
    .map((p) => {
      if (!p.ecosystemConfig?.token) return undefined
      return {
        projectId: p.id,
        coingeckoId: p.ecosystemConfig.token.coingeckoId,
      }
    })
    .filter((x) => x !== undefined)

  return {
    tokens,
  }
}
