import type { ProjectService } from '@l2beat/config'
import { createHash } from 'crypto'
import type { EcosystemsConfig, EcosystemTokenConfig } from '../Config'

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
        configurationId: createEcosystemTokenConfigId({
          projectId: p.id,
          coingeckoId: p.ecosystemConfig.token.coingeckoId,
        }),
        projectId: p.id,
        coingeckoId: p.ecosystemConfig.token.coingeckoId,
      }
    })
    .filter((x) => x !== undefined)

  return {
    tokens,
  }
}

function createEcosystemTokenConfigId(
  tokenConfig: Omit<EcosystemTokenConfig, 'configurationId'>,
): string {
  const input = []
  input.push(tokenConfig.projectId)
  input.push(tokenConfig.coingeckoId)

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
