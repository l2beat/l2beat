import type { Env } from '@l2beat/backend-tools'
import type { ProjectService } from '@l2beat/config'
import type { EcosystemsConfig } from '../Config'

export async function getEcosystemsConfig(
  ps: ProjectService,
  env: Env,
): Promise<EcosystemsConfig> {
  const projects = await ps.getProjects({
    select: ['ecosystemConfig'],
  })

  const tokens = projects
    .map((x) => {
      if (!x.ecosystemConfig?.token) return undefined
      return {
        projectId: x.id,
        coingeckoId: x.ecosystemConfig.token.tokenId,
      }
    })
    .filter((x) => x !== undefined)

  return {
    tokens,
  }
}
